import type {
  AllData,
  DailyData,
  Expense,
  Goal,
  Habit,
  PlannerData,
  QuoteSource,
  Achievement,
} from '../types';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  url: string;
  score: number;
}

export interface SearchableData {
  habits: Habit[];
  goals: Goal[];
  expenses: Expense[];
  quotes: QuoteSource[];
  achievements: Achievement[];
  planner: PlannerData;
  dailyData: AllData;
}

const EMPTY: SearchableData = {
  habits: [],
  goals: [],
  expenses: [],
  quotes: [],
  achievements: [],
  planner: { blocks: [], links: [], transform: { scale: 1, panX: 0, panY: 0 } },
  dailyData: {},
};

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,;]+/)
    .filter(Boolean);
}

function fuzzyScore(haystack: string, tokens: string[]): number {
  const hay = (haystack || '').toLowerCase();
  let matched = 0;
  for (const token of tokens) {
    if (hay.includes(token)) {
      matched += 1;
    } else if (tokenMatch(hay, token)) {
      matched += 0.5;
    }
  }
  return matched / (tokens.length || 1);
}

function tokenMatch(haystack: string, token: string): boolean {
  if (!token) return false;
  let j = 0;
  for (let i = 0; i < haystack.length && j < token.length; i++) {
    if (haystack[i] === token[j]) j++;
  }
  return j === token.length;
}

function score(text: string, tokens: string[], weight = 1): number {
  if (!text) return 0;
  return fuzzyScore(text, tokens) * weight;
}

export function searchDomains(data: Partial<SearchableData>): SearchableData {
  return { ...EMPTY, ...data };
}

export function search(data: SearchableData, query: string, limit = 20): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const results: SearchResult[] = [];

  const habits = data.habits || [];
  for (const habit of habits) {
    const s = score(habit.name, tokens, 1);
    if (s > 0) results.push({ id: `habit:${habit.id}`, title: habit.name, subtitle: 'Habit', category: 'Habits', url: '/habits', score: s });
  }

  const goals = data.goals || [];
  for (const goal of goals) {
    const s =
      score(goal.text, tokens, 2) +
      score(goal.description || '', tokens, 1) +
      score((goal.tags || []).join(' '), tokens, 1);
    if (s > 0)
      results.push({
        id: `goal:${goal.id}`,
        title: goal.text,
        subtitle: goal.category,
        category: 'Goals',
        url: '/goals',
        score: s,
      });
  }

  const expenses = data.expenses || [];
  for (const expense of expenses) {
    const s = score(expense.item, tokens, 1) + score(expense.category, tokens, 1);
    if (s > 0)
      results.push({
        id: `expense:${expense.id}`,
        title: expense.item,
        subtitle: `${expense.category} · $${Number(expense.price).toFixed(2)}`,
        category: 'Expenses',
        url: '/expense',
        score: s,
      });
  }

  const quotesData = data.quotes || [];
  for (const source of quotesData) {
    for (const q of source.quotes) {
      const s = score(q.text, tokens, 1) + score(q.author || '', tokens, 1) + score(source.title, tokens, 0.5);
      if (s > 0)
        results.push({
          id: `quote:${q.id || source.id}`,
          title: q.text,
          subtitle: `— ${q.author} (${source.title})`,
          category: 'Quotes',
          url: '/quotes',
          score: s,
        });
    }
  }

  const achievements = data.achievements || [];
  for (const a of achievements) {
    const s = score(a.title, tokens, 2) + score(a.description || '', tokens, 1) + score((a.tags || []).join(' '), tokens, 1);
    if (s > 0)
      results.push({
        id: `achievement:${a.id}`,
        title: a.title,
        subtitle: a.date,
        category: 'Achievements',
        url: '/achievements',
        score: s,
      });
  }

  const planner = data.planner || EMPTY.planner;
  for (const block of planner.blocks) {
    for (const task of block.tasks) {
      const s = score(task.text, tokens, 1);
      if (s > 0)
        results.push({
          id: `task:${task.id}`,
          title: task.text,
          subtitle: `Planner · ${block.title}`,
          category: 'Planner',
          url: '/planner',
          score: s,
        });
    }
  }

  const dailyData = data.dailyData || {};
  for (const [date, day] of Object.entries(dailyData)) {
    const d = day as DailyData;
    const journalScore = score(d.journal || '', tokens, 2);
    if (journalScore > 0)
      results.push({
        id: `journal:${date}`,
        title: date,
        subtitle: d.journal?.slice(0, 80) || '',
        category: 'Journal',
        url: '/journal',
        score: journalScore,
      });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function groupByCategory(results: SearchResult[]): Record<string, SearchResult[]> {
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    const cat = r.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  }
  return grouped;
}
