import { createContext, type ReactNode, useContext } from "react";
import type { Repository } from "./repository.ts";

const RepositoryContext = createContext<Repository | null>(null);

export function RepositoryProvider({ repository, children }: { repository: Repository; children: ReactNode }) {
  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>;
}

export const useRepository = (): Repository => {
  const repository = useContext(RepositoryContext);
  if (!repository) throw new Error("useRepository must be used inside <RepositoryProvider>");
  return repository;
};
