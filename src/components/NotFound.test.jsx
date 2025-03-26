import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound Component', () => {
    it('renders 404 error page correctly', () => {
        render(<NotFound />);

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
        expect(screen.getByText("The page you are looking for doesn't exist or has been moved.")).toBeInTheDocument();

        const homeLink = screen.getByText('Go Home');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink.getAttribute('href')).toBe('/');
    });
});