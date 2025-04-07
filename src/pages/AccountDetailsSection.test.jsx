import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import AccountDetailsSection from "./AccountDetailsSection.jsx";

test("Renders the Account Details section", async () => {
    const { getByText } = render(<AccountDetailsSection />);
    
    // Verify section title is present
    expect(getByText("Account Details")).not.toBeNull();
    
    // Verify account details are displayed
    expect(getByText("Username")).not.toBeNull();
    expect(getByText("Username will be displayed here")).not.toBeNull();
    
    expect(getByText("Email")).not.toBeNull();
    expect(getByText("user@example.com")).not.toBeNull();
    
    expect(getByText("Password Management")).not.toBeNull();
    
    // Verify the password change button exists
    const changePasswordButton = getByText("Change Password");
    expect(changePasswordButton).not.toBeNull();
});