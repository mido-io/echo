import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './page';

// Mock Supabase client
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  }),
}));

describe('Login/Signup Page', () => {
  it('renders the login form', () => {
    render(<Login />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { level: 2, name: /Sign in to your account/i })).toBeInTheDocument();
    
    // Check for email and password inputs
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });
});
