import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { BrowserRouter } from "react-router-dom";

import MonthlySalary from "./MonthlySalary.jsx";

test("Renders the Monthly Salary page", async () => {
    const { getByText } = render(
        <BrowserRouter>
            <MonthlySalary />
        </BrowserRouter>
    );
    
    // Check if some part of the component renders
    expect(getByText(/Monthly Salary/i)).not.toBeNull();
});
