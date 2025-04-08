import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { BrowserRouter } from "react-router-dom";

import Transactions from "./Transactions.jsx";

// Mock the Supabase client and userID
vi.mock("../auth/Client.js", () => ({
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            data: [],
            error: null
          })
        })
      })
    })
  }
}));

vi.mock("../auth/SessionData.js", () => ({
  default: Promise.resolve("mock-user-id")
}));

test("Renders the Transactions page", async () => {
  const { getByText } = render(
    <BrowserRouter>
      <Transactions />
    </BrowserRouter>
  );
  
  // Check if main title is present
  expect(getByText("Transactions")).not.toBeNull();
});