import { render, screen } from '@testing-library/react';
import Home from '../page';
import Image from 'next/image';

// Mock next/image to prevent errors in a non-Next.js test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('Home Page', () => {
  it('should deterministically fail by asserting wrong image width', () => {
    render(<Home />);

    const nextLogo = screen.getByAltText('Next.js logo');

    // Intentionally assert an incorrect width to cause a failure
    // The actual width is 100, but we expect 200
    expect(nextLogo).toHaveAttribute('width', '200');
  });

  it('should deterministically fail by asserting wrong heading text', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });

    // Intentionally assert incorrect heading text to cause a failure
    // The actual text is 'To get started, edit the page.tsx file.', but we expect 'Wrong heading text'
    expect(heading).toHaveTextContent('Wrong heading text');
  });
});
