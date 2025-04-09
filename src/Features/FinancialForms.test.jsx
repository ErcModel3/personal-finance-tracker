import {expect, test, vi} from "vitest";
import {render} from "vitest-browser-react";
import {BrowserRouter} from "react-router-dom";

import FinancialForms from "./FinancialForms.jsx";

// Mock the supabase client
vi.mock("../auth/Client.js", () => {
  return {
    default: {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
          error: null,
        }),
      },
    },
  };
});

// Mock the components that might be harder to render in tests
vi.mock("../components/AuthenticatedNavbar.jsx", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../components/Footer.jsx", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

test("Renders the Financial Forms page", async () => {
    const {getByText} = render(
        <BrowserRouter>
            <FinancialForms />
        </BrowserRouter>
    );
    expect(getByText("Direct Debit")).not.toBeNull();
    expect(getByText("Subscription")).not.toBeNull();
    expect(getByText("Add Direct Debit")).not.toBeNull();
});