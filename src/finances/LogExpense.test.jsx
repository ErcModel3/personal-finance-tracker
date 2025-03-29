import {expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import LogExpense from "./LogExpense";

test("Renders the Data Analysis page", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <LogExpense />
        </BrowserRouter>
    );
    expect(getByText("Add New Expense")).not.toBeNull();
});