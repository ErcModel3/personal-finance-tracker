import {expect, test}  from "vitest";
import {render} from "vitest-browser-react";

import {BrowserRouter} from "react-router-dom";
import DeleteAccount from "./DeleteAccount.jsx";

test("Renders Delete Account section", async () => {
    const { getByText } = render(
        <BrowserRouter>
            <DeleteAccount />
        </BrowserRouter>
    );

    expect(getByText("Delete Account")).not.toBeNull();
});