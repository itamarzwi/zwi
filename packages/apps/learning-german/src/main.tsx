import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen.ts";
import { AccountProvider } from "./storage/account.tsx";
import "./styles.css";

const router = createRouter({ routeTree, defaultPreload: "intent" });
const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AccountProvider>
      <RouterProvider router={router} />
    </AccountProvider>
  </QueryClientProvider>,
  // </StrictMode>,
);
