import {expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import ContactUs from "./ContactUs.jsx";

test("Renders the ContactUs", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <ContactUs />
        </BrowserRouter>
    );
    expect(getByText("ContactUs")).not.toBeNull();
});