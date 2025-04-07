import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { BrowserRouter } from "react-router-dom";

import Dashboard from "./Dashboard.jsx";

test("Renders the Dashboard page", async () => {
    const { getByText } = render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
    
    // Verify key elements are present
    expect(getByText("Dashboard")).not.toBeNull();
    expect(getByText("Welcome to your financial overview")).not.toBeNull();
    expect(getByText("Financial Overview")).not.toBeNull();
    expect(getByText("Monthly Income")).not.toBeNull();
    expect(getByText("Total Spent")).not.toBeNull();
    expect(getByText("Remaining Budget")).not.toBeNull();
    
    // Check for section headings
    expect(getByText("Budget Overview")).not.toBeNull();
    expect(getByText("Spending by Category")).not.toBeNull();
    expect(getByText("Recent Transactions")).not.toBeNull();
    expect(getByText("Upcoming Bills")).not.toBeNull();
    expect(getByText("Savings Goals")).not.toBeNull();
    expect(getByText("Quick Actions")).not.toBeNull();
    
    // Verify buttons
    expect(getByText("View All Transactions")).not.toBeNull();
    expect(getByText("Manage Goals")).not.toBeNull();
    expect(getByText("Add Expense")).not.toBeNull();
    expect(getByText("Add Payment Card")).not.toBeNull();
    expect(getByText("View Full Report")).not.toBeNull();
});