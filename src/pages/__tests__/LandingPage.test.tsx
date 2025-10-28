import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from '../LandingPage';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Build Something')).toBeInTheDocument();
    expect(screen.getByText('Amazing')).toBeInTheDocument();
  });

  it('renders the call-to-action buttons', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders the features section', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Everything you need to get started')).toBeInTheDocument();
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Production Ready')).toBeInTheDocument();
    expect(screen.getByText('Modern Stack')).toBeInTheDocument();
  });

  it('renders the testimonials section', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Loved by developers')).toBeInTheDocument();
  });
});
