import {expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import AddExpense from "./AddExpense.jsx";

test("Renders the Data Analysis page", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <AddExpense />
        </BrowserRouter>
    );
    expect(getByText("Add New Expense")).not.toBeNull();
});