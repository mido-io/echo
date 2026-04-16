import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Feed } from './Feed';
import * as feedActions from '@/app/actions/feed';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock the server action fetching
vi.mock('@/app/actions/feed', () => ({
  fetchPosts: vi.fn(),
}));

describe('Infinite Scroll Feed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial posts and fetches more when IntersectionObserver triggers', async () => {
    // Setup mock to return a page of posts, then a second page
    (feedActions.fetchPosts as any)
      .mockResolvedValueOnce([
        { id: '1', content: 'Post 1', likesCount: 0, repostsCount: 0, hasLiked: false, hasReposted: false },
        { id: '2', content: 'Post 2', likesCount: 0, repostsCount: 0, hasLiked: false, hasReposted: false },
      ])
      .mockResolvedValueOnce([
        { id: '3', content: 'Post 3', likesCount: 0, repostsCount: 0, hasLiked: false, hasReposted: false },
      ]);

    render(<Feed />);

    // Wait for the first fetch to load the initial posts
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });

    // Simulate what would happen when the observer triggers intersection
    // Grab the callback passed to the IntersectionObserver constructor
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    observerCallback([{ isIntersecting: true }]);

    // Wait for the second fetch to load the incoming posts
    await waitFor(() => {
      expect(screen.getByText('Post 3')).toBeInTheDocument();
    });

    // Confirm that fetchPosts was called twice
    expect(feedActions.fetchPosts).toHaveBeenCalledTimes(2);
    // Page 0 then Page 1
    expect(feedActions.fetchPosts).toHaveBeenNthCalledWith(1, 0);
    expect(feedActions.fetchPosts).toHaveBeenNthCalledWith(2, 1);
  });
});
