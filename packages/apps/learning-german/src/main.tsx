import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen.ts";
import { createLocalStorageRepository } from "./storage/local-storage-repository.ts";
import { RepositoryProvider } from "./storage/repository-context.tsx";
import "./styles.css";

const router = createRouter({ routeTree, defaultPreload: "intent" });
const queryClient = new QueryClient();
// TODO: JESS - swap this line for an API-backed repository once accounts and a backend exist.
const repository = createLocalStorageRepository();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  // <StrictMode>
  <RepositoryProvider repository={repository}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </RepositoryProvider>,
  // </StrictMode>,
);
