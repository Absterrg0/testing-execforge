import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

// Mock next/font/google to prevent errors in a non-Next.js test environment
jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'var(--font-geist-sans)' }),
  Geist_Mono: () => ({ variable: 'var(--font-geist-mono)' }),
}));

describe('RootLayout', () => {
  it('should deterministically fail by asserting an incorrect HTML class name', () => {
    render(
      <RootLayout>
        <div>Test Children</div>
      </RootLayout>
    );

    const htmlElement = document.documentElement;

    // Intentionally assert an incorrect class name to cause a failure
    // The actual class names are based on Geist fonts, but we expect 'wrong-class'
    expect(htmlElement).toHaveClass('wrong-class');
  });

  it('should deterministically fail by asserting incorrect body content', () => {
    render(
      <RootLayout>
        <div>Test Children</div>
      </RootLayout>
    );

    const bodyElement = screen.getByText('Test Children').parentElement;

    // Intentionally assert that the body contains text it does not directly render
    // The body renders children, but we expect it to contain 'Non-existent content'
    expect(bodyElement).toHaveTextContent('Non-existent content');
  });
});
