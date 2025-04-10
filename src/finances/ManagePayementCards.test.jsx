import {expect, test}  from "vitest";
import {render} from "vitest-browser-react";

import ManageBankCards from "../finances/ManagePaymentCards.jsx";
import {BrowserRouter} from "react-router-dom";

test("Renders bank card adding", async () => {
    const { getByText } = render(
        <BrowserRouter>
            <ManageBankCards />
        </BrowserRouter>
    );

    expect(getByText("Your Bank Cards")).not.toBeNull();
});