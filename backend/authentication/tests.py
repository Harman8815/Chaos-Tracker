from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from tracker.models import Expense, Goal, Achievement

User = get_user_model()


class AuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }

    def test_signup(self):
        response = self.client.post('/api/auth/signup/', self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get('success'))
        self.assertIn('user', response.data.get('data', {}))

    def test_login(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get('success'))

    def test_login_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'wrongpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_requires_auth(self):
        response = self.client.get('/api/auth/me/')
        self.assertIn(
            response.status_code, [
                status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])


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
        response = self.client.patch(
            f'/api/expenses/{expense.id}/', {'price': '4.00'}, format='json')
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
        response = self.client.patch(
            f'/api/goals/{goal.id}/', {'status': 'completed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        goal.refresh_from_db()
        self.assertEqual(goal.status, 'completed')

    def test_delete_goal(self):
        goal = Goal.objects.create(user=self.user, **self.goal_data)
        response = self.client.delete(f'/api/goals/{goal.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Goal.objects.count(), 0)


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
        response = self.client.patch(
            f'/api/achievements/{achievement.id}/', {'description': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        achievement.refresh_from_db()
        self.assertEqual(achievement.description, 'Updated')

    def test_delete_achievement(self):
        achievement = Achievement.objects.create(user=self.user, **self.achievement_data)
        response = self.client.delete(f'/api/achievements/{achievement.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Achievement.objects.count(), 0)
