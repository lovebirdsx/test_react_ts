import { client } from '../api/client';

function sum(a: number, b: number): number {
  return a + b;
}

test('sum', () => {
  expect(sum(1, 2)).toBe(3);
  expect(sum(2, 2)).toBe(4);
});

test('get posts from server', async () => {
  const res = await client.get('/fakeApi/posts');
  const posts = res.data as unknown[];
  expect(posts.length).toBeGreaterThan(0);
});
