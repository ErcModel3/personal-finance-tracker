import {expect, test}  from "vitest";
import {render} from "vitest-browser-react";

import App from "./App";

test("Renders the main scren", async () => {
    const {getByText} = render(<App />);
    expect(getByText("Welcome to Your Budgeting Dashboard")).not.toBeNull(); 
});