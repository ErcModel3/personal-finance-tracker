import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AccountInformation from './AccountInformation';
import {BrowserRouter} from "react-router-dom";

// Mock the imported components and see if pathing works
vi.mock('../../pages/AccountDetailsSection.jsx', () => ({
    default: () => <div data-testid="account-details-section">Account Details Section</div>
}));

vi.mock('./NotificationSettings.jsx', () => ({
    default: () => <div data-testid="notification-settings">Notification Settings</div>
}));

vi.mock('./DeleteAccount.jsx', () => ({
    default: () => <div data-testid="delete-account">Delete Account</div>
}));

vi.mock('../../components/Footer.jsx', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('../../components/AuthenticatedNavbar.jsx', () => ({
    default: () => <div data-testid="authenticated-navbar">Navbar</div>
}));

// Mock CSS modules
vi.mock('./Settings.module.css', () => ({
    default: {
        compactContainer: 'mockCompactContainer',
        compactHeader: 'mockCompactHeader',
        compactTitle: 'mockCompactTitle',
        compactSubtitle: 'mockCompactSubtitle',
        contentGrid: 'mockContentGrid'
    }
}));

describe('AccountInformation Component', () => {
    it('renders the component with all sections', () => {
        render(
            <BrowserRouter>
                <AccountInformation />
            </BrowserRouter>
        );

        // Check header content
        expect(screen.getByText('Account Information')).toBeInTheDocument();
        expect(screen.getByText('View and update your account details')).toBeInTheDocument();
        // Check that all  components are rendered
        expect(screen.getByTestId('authenticated-navbar')).toBeInTheDocument();
        expect(screen.getByTestId('account-details-section')).toBeInTheDocument();
        expect(screen.getByTestId('notification-settings')).toBeInTheDocument();
        expect(screen.getByTestId('delete-account')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});