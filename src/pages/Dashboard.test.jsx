import {expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import Dashboard from "./dashboard.jsx";

test("Renders the Dashboard", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
    expect(getByText("Dashboard")).not.toBeNull();
});