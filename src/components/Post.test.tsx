import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Post } from './Post';

// Mock server actions
vi.mock('@/app/actions/engagement', () => ({
  toggleLike: vi.fn(),
  toggleRepost: vi.fn(),
}));

describe('Post Component Engagement', () => {
  it('increments counters on clicking Like and Repost buttons', async () => {
    // Render the post with 0 likes and 0 reposts, initially not liked or reposted
    render(
      <Post 
        id="test-post-123" 
        content="Hello world!" 
        initialLikes={0} 
        initialReposts={0} 
        initialHasLiked={false} 
        initialHasReposted={false} 
      />
    );

    // Verify initial state
    const likeButton = screen.getByRole('button', { name: /like/i });
    const repostButton = screen.getByRole('button', { name: /repost/i });
    
    expect(likeButton.textContent).toMatch(/0/);
    expect(repostButton.textContent).toMatch(/0/);

    // Simulate clicking Like
    fireEvent.click(likeButton);
    expect(likeButton.textContent).toMatch(/1/); // Counter should increment

    // Simulate clicking Repost
    fireEvent.click(repostButton);
    expect(repostButton.textContent).toMatch(/1/); // Counter should increment
  });
});
