from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from tracker.models import (
    Achievement,
    Expense,
    Goal,
    PlannerBlock,
    Quote,
    QuoteSource,
    QuoteTag,
)

User = get_user_model()


class ExpenseCRUDTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('expenseuser', 'exp@test.com', 'pass123')
        self.client.force_authenticate(user=self.user)
        self.expense_data = {
            'date': '2025-01-15',
            'item': 'Coffee',
            'category': 'Food',
            'quantity': 2,
            'price': '3.50'
        }

    def test_create_expense(self):
        response = self.client.post('/api/expenses/', self.expense_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Expense.objects.count(), 1)
        self.assertEqual(Expense.objects.first().item, 'Coffee')

    def test_list_expenses(self):
        Expense.objects.create(user=self.user, **self.expense_data)
        response = self.client.get('/api/expenses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_update_expense(self):
        expense = Expense.objects.create(user=self.user, **self.expense_data)
        response = self.client.patch(f'/api/expenses/{expense.id}/', {'price': '4.00'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expense.refresh_from_db()
        self.assertEqual(str(expense.price), '4.00')

    def test_delete_expense(self):
        expense = Expense.objects.create(user=self.user, **self.expense_data)
        response = self.client.delete(f'/api/expenses/{expense.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Expense.objects.count(), 0)


class GoalCRUDTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('goaluser', 'goal@test.com', 'pass123')
        self.client.force_authenticate(user=self.user)
        self.goal_data = {
            'text': 'Test goal',
            'category': 'daily',
            'status': 'active',
            'target': 1,
            'completed_tasks': 0
        }

    def test_create_goal(self):
        response = self.client.post('/api/goals/', self.goal_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.count(), 1)
        self.assertEqual(Goal.objects.first().text, 'Test goal')

    def test_list_goals(self):
        Goal.objects.create(user=self.user, **self.goal_data)
        response = self.client.get('/api/goals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_update_goal(self):
        goal = Goal.objects.create(user=self.user, **self.goal_data)
        response = self.client.patch(f'/api/goals/{goal.id}/', {'status': 'completed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        goal.refresh_from_db()
        self.assertEqual(goal.status, 'completed')

    def test_delete_goal(self):
        goal = Goal.objects.create(user=self.user, **self.goal_data)
        response = self.client.delete(f'/api/goals/{goal.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Goal.objects.count(), 0)


class APIVersioningTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('versionuser', 'version@test.com', 'pass123')
        self.client.force_authenticate(user=self.user)

    def test_versioned_endpoint_returns_api_version_header(self):
        response = self.client.get('/api/v1/expenses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.headers.get('API-Version'), 'v1')

    def test_versioned_domain_error_returns_api_version_header(self):
        response = self.client.get('/api/v1/expenses/999999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.headers.get('API-Version'), 'v1')

    def test_legacy_endpoint_remains_available_without_version_header(self):
        response = self.client.get('/api/expenses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('API-Version', response.headers)


class V1APIRegressionTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('v1user', 'v1@test.com', 'pass123')
        self.other_user = User.objects.create_user('v1other', 'v1other@test.com', 'pass123')
        self.client.force_authenticate(user=self.user)

    def test_namespace_reverse_builds_versioned_url(self):
        self.assertEqual(reverse('v1:journal-list-create'), '/api/v1/journal/')

    def test_goal_create_uses_server_id_and_aware_timestamp(self):
        response = self.client.post('/api/v1/goals/', {
            'text': 'Complete a task',
            'category': 'daily',
            'status': 'completed',
            'target': 1,
            'completed_tasks': 1,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        goal = Goal.objects.get()
        self.assertIsInstance(goal.id, int)
        self.assertIsNotNone(goal.completed_at)
        self.assertTrue(timezone.is_aware(goal.completed_at))

    def test_achievement_create_uses_server_id(self):
        response = self.client.post('/api/v1/achievements/', {
            'title': 'Finished',
            'description': 'Done',
            'date': '2025-01-01',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(Achievement.objects.get().id, int)

    def test_quote_source_and_quote_create_without_client_ids(self):
        source_response = self.client.post('/api/v1/quotes/sources/', {
            'title': 'A Book',
            'type': 'Book',
        }, format='json')
        self.assertEqual(source_response.status_code, status.HTTP_201_CREATED)
        source_id = source_response.data['data']['id']
        self.assertNotEqual(source_id, '')

        quote_response = self.client.post(f'/api/v1/quotes/sources/{source_id}/quotes/', {
            'text': 'Hello world',
            'author': 'Author',
            'tags': ['greeting'],
        }, format='json')
        self.assertEqual(quote_response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(quote_response.data['data']['id'], '')
        self.assertEqual(Quote.objects.filter(source_id=source_id).count(), 1)

    def test_quote_source_type_query_filter(self):
        QuoteSource.objects.create(id='source-movie', user=self.user, title='Movie', type='Movie')
        QuoteSource.objects.create(id='source-book', user=self.user, title='Book', type='Book')
        response = self.client.get('/api/v1/quotes/sources/?type=Book')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['data'][0]['type'], 'Book')

    def test_quote_source_detail_reports_quote_count(self):
        source = QuoteSource.objects.create(id='source-1', user=self.user, title='Source', type='Book')
        Quote.objects.create(id='quote-1', source=source, text='Quote', author='Author')
        response = self.client.get(f'/api/v1/quotes/sources/{source.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['quote_count'], 1)

    def test_quote_search_returns_match_type_and_limit(self):
        source = QuoteSource.objects.create(id='source-2', user=self.user, title='Source', type='Book')
        Quote.objects.create(id='quote-2', source=source, text='A useful quote', author='Ada')
        quote = Quote.objects.get(source=source)
        quote.tags.create(tag='wisdom')
        response = self.client.get('/api/v1/quotes/search/?q=Ada&limit=1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['data']['results'][0]['match_type'], 'author')

    def test_quote_tags_are_wrapped(self):
        source = QuoteSource.objects.create(id='source-3', user=self.user, title='Source', type='Book')
        quote = Quote.objects.create(id='quote-3', source=source, text='Quote', author='Author')
        quote.tags.create(tag='tag-one')
        response = self.client.get('/api/v1/quotes/tags/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data'], {'tags': ['tag-one']})
        self.assertEqual(response.data['count'], 1)

    def test_expense_query_validation_returns_domain_error_shape(self):
        response = self.client.get('/api/v1/expenses/?month=12')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['success'], False)
        self.assertEqual(response.data['error']['code'], 'VALIDATION_ERROR')
        self.assertEqual(response.headers.get('API-Version'), 'v1')

    def test_expense_list_uses_domain_summary(self):
        Expense.objects.create(user=self.user, date='2025-01-05', item='Coffee', category='Food', quantity=2, price='3.50')
        Expense.objects.create(user=self.user, date='2025-01-06', item='Lunch', category='Food', quantity=1, price='10.00')
        Expense.objects.create(user=self.user, date='2025-01-07', item='Book', category='Education', quantity=1, price='15.00')
        response = self.client.get('/api/v1/expenses/?year=2025&month=0&category=food')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['data']['count'], 2)
        self.assertEqual(response.data['data']['total_amount'], 17.0)
        self.assertEqual(len(response.data['data']['expenses']), 2)

    def test_expense_summary_filters_by_category(self):
        Expense.objects.create(user=self.user, date='2025-01-05', item='Coffee', category='Food', quantity=2, price='3.50')
        Expense.objects.create(user=self.user, date='2025-01-06', item='Book', category='Education', quantity=1, price='15.00')
        response = self.client.get('/api/v1/expenses/summary/?year=2025&month=0&category=food')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['summary']['total_expenses'], 1)
        self.assertEqual(response.data['data']['summary']['total_amount'], 7.0)

    def test_expense_top_items_rejects_invalid_limit(self):
        response = self.client.get('/api/v1/expenses/top-items/?limit=-1')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_versioned_endpoint_is_rejected(self):
        client = APIClient()
        response = client.get('/api/v1/mood/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cross_user_expense_detail_is_not_found(self):
        expense = Expense.objects.create(user=self.other_user, date='2025-01-01', item='Secret', category='Food', quantity=1, price='1.00')
        response = self.client.get(f'/api/v1/expenses/{expense.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error']['code'], 'NOT_FOUND')

    def test_planner_rejects_self_link(self):
        response = self.client.put('/api/v1/planner/', {
            'blocks': [
                {'id': 'block-1', 'title': 'Block', 'x': 0, 'y': 0, 'tasks': []},
            ],
            'links': [
                {'id': 'link-1', 'from': 'block-1', 'to': 'block-1'},
            ],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error']['code'], 'VALIDATION_ERROR')


class AchievementCRUDTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('achuser', 'ach@test.com', 'pass123')
        self.client.force_authenticate(user=self.user)
        self.achievement_data = {
            'title': 'Test Achievement',
            'description': 'A test achievement',
            'date': '2025-01-01'
        }

    def test_create_achievement(self):
        response = self.client.post('/api/achievements/', self.achievement_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Achievement.objects.count(), 1)
        self.assertEqual(Achievement.objects.first().title, 'Test Achievement')

    def test_list_achievements(self):
        Achievement.objects.create(user=self.user, **self.achievement_data)
        response = self.client.get('/api/achievements/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_update_achievement(self):
        achievement = Achievement.objects.create(user=self.user, **self.achievement_data)
        response = self.client.patch(f'/api/achievements/{achievement.id}/', {'description': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        achievement.refresh_from_db()
        self.assertEqual(achievement.description, 'Updated')

    def test_delete_achievement(self):
        achievement = Achievement.objects.create(user=self.user, **self.achievement_data)
        response = self.client.delete(f'/api/achievements/{achievement.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Achievement.objects.count(), 0)
