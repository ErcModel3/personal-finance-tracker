import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { BrowserRouter } from "react-router-dom";

import DirectDebitsList from "./DirectDebitList.jsx";

// Mock the supabase client
vi.mock("../auth/Client.js", () => {
    return {
        default: {
            auth: {
                getUser: vi.fn().mockResolvedValue({
                    data: { user: { id: "test-user-id" } },
                    error: null,
                }),
            },
            from: vi.fn(() => ({
                select: vi.fn(() => ({
                    eq: vi.fn(() => Promise.resolve({
                        data: [
                            {
                                id: 1,
                                Userid: "test",
                                Name: "Netflix",
                                Amount: "9.99",
                                Recurrance: "Monthly",
                                Start_date: "2023-01-01",
                                End_Date: null
                            },
                            {
                                id: 2,
                                Userid: "test2",
                                Name: "Gym Membership",
                                Amount: "29.99",
                                Recurrance: "Monthly",
                                Start_date: "2023-02-15",
                                End_Date: "2024-02-15"
                            }
                        ],
                        error: null
                    }))
                })),
                delete: vi.fn(() => ({
                    eq: vi.fn(() => Promise.resolve({ error: null }))
                }))
            }))
        }
    };
});


test("Renders the Direct Debits list page with data", async () => {
    const { getByText } = render(
        <BrowserRouter>
            <DirectDebitsList />
        </BrowserRouter>
    );

    // Check if table headers are displayed
    expect(getByText("Name")).not.toBeNull();
    expect(getByText("Amount")).not.toBeNull();
    expect(getByText("Frequency")).not.toBeNull();
    expect(getByText("Start Date")).not.toBeNull();
    expect(getByText("End Date")).not.toBeNull();
    expect(getByText("Actions")).not.toBeNull();

    // Check if the items are displayed
    expect(getByText("Netflix")).not.toBeNull();
    expect(getByText("Gym Membership")).not.toBeNull();
    expect(getByText("£9.99")).not.toBeNull();
    expect(getByText("£29.99")).not.toBeNull();

});
