import {expect, test}  from "vitest";
import {render} from "vitest-browser-react";

import DataAnalysis from "./DataAnalysis";

test("Renders the Data Analysis page", async () => {
    const {getByText} = render(<DataAnalysis />);
    expect(getByText("Budget Report")).not.toBeNull();
});