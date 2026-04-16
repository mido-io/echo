import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Composer } from './Composer';
import * as postActions from '@/app/actions/post';

vi.mock('@/app/actions/post', () => ({
  createPost: vi.fn(),
}));

describe('Composer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enforces a 280-character limit and correctly submits an allowed post', async () => {
    render(<Composer onPostCreated={vi.fn()} />);

    const textarea = screen.getByPlaceholderText(/What's happening?/i);
    const submitBtn = screen.getByRole('button', { name: /Post/i });

    // Initial state: submit button should be disabled because content is empty
    expect(submitBtn).toBeDisabled();

    // Type a valid post
    fireEvent.change(textarea, { target: { value: 'Hello World!' } });
    expect(submitBtn).not.toBeDisabled();

    // Type an overly long post (>280 chars)
    const longText = 'a'.repeat(281);
    fireEvent.change(textarea, { target: { value: longText } });
    
    // The submit button should not allow the submission if the character limit is exceeded.
    // It could be disabled, or the input could be clamped, but let's assume it disables the button.
    expect(submitBtn).toBeDisabled();
    
    // Check character count UI
    expect(screen.getByText('-1')).toBeInTheDocument(); // 280 - 281 = -1

    // Back to valid length
    fireEvent.change(textarea, { target: { value: 'Valid length post' } });
    expect(submitBtn).not.toBeDisabled();

    // Submit
    fireEvent.click(submitBtn);

    // Ensure action is called correctly
    expect(postActions.createPost).toHaveBeenCalledWith('Valid length post', []);
  });
});
