import {expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import DataAnalysis from "./DataAnalysis";

test("Renders the Data Analysis page", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <DataAnalysis />
        </BrowserRouter>
    );
    expect(getByText("Budget Report")).not.toBeNull();
});