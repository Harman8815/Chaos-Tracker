import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { search, groupByCategory, type SearchableData } from '../src/lib/search';

const data: SearchableData = {
  habits: [{ id: 'h1', name: 'Morning Run', target: 10, rangeMax: 10 }],
  goals: [
    { id: 1, text: 'Read two books', status: 'active', category: 'monthly', created_at: '2024-01-01', tags: ['reading'], target: 2, completed_tasks: 0 },
    { id: 2, text: 'Finish the report for Q3', status: 'active', category: 'daily', created_at: '2024-01-01', tags: ['work'], target: 1, completed_tasks: 0 },
  ],
  expenses: [{ id: 'e1', date: '2024-01-01', item: 'Coffee', category: 'Food', quantity: 1, price: 3.5 }],
  quotes: [],
  achievements: [],
  planner: { blocks: [{ id: 'b1', title: 'To-Do', x: 0, y: 0, tasks: [{ id: 't1', text: 'Write tests', completed: false }] }], links: [], transform: { scale: 1, panX: 0, panY: 0 } },
  dailyData: { '2024-01-01': { journal: 'Today I felt great and ran 5km' } },
};

describe('search', () => {
  it('returns no results for empty query', () => {
    assert.deepEqual(search(data, '   '), []);
  });

  it('finds goals by text', () => {
    const results = search(data, 'books');
    assert.equal(results.length, 1);
    assert.equal(results[0].category, 'Goals');
    assert.equal(results[0].title, 'Read two books');
  });

  it('finds expenses by item name (case-insensitive)', () => {
    const results = search(data, 'coffee');
    assert.equal(results[0].title, 'Coffee');
    assert.equal(results[0].category, 'Expenses');
  });

  it('finds planner tasks', () => {
    const results = search(data, 'tests');
    assert.equal(results.length, 1);
    assert.equal(results[0].subtitle, 'Planner · To-Do');
  });

  it('finds journal entries and groups them', () => {
    const results = search(data, 'ran');
    const grouped = groupByCategory(results);
    assert.ok(grouped['Journal']);
    assert.equal(grouped['Journal'][0].id, 'journal:2024-01-01');
  });

  it('ranks higher-scoring matches first', () => {
    const results = search(data, 'report');
    assert.equal(results[0].title, 'Finish the report for Q3');
  });

  it('limits results', () => {
    const results = search(data, 'a', 1);
    assert.equal(results.length, 1);
  });
});

describe('groupByCategory', () => {
  it('groups results by category', () => {
    const grouped = groupByCategory([
      { id: '1', title: 'A', category: 'Goals', url: '/goals', score: 1 },
      { id: '2', title: 'B', category: 'Goals', url: '/goals', score: 1 },
      { id: '3', title: 'C', category: 'Habits', url: '/habits', score: 1 },
    ]);
    assert.equal(grouped['Goals'].length, 2);
    assert.equal(grouped['Habits'].length, 1);
  });
});
