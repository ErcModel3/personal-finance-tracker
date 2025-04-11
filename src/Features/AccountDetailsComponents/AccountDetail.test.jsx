import {expect, test}  from "vitest";
import {render} from "vitest-browser-react";

import {BrowserRouter} from "react-router-dom";
import AccountDetail from "./AccountDetail.jsx";

test("Renders  Account Details section", async () => {
    const { getByText } = render(
        <BrowserRouter>
            <AccountDetail />
        </BrowserRouter>
    );

    expect(getByText("Delete Account")).not.toBeNull();
});