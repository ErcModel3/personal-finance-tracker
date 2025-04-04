import {expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import AddPaymentCard from "./AddPaymentCard.jsx";

test("Renders the add card  page", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <AddPaymentCard />
        </BrowserRouter>
    );
    expect(getByText("Add new Bank Card")).not.toBeNull();
});