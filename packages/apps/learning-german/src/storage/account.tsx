import { useQueryClient } from "@tanstack/react-query";
import {
  browserPopupRedirectResolver,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { firebase } from "#/lib/firebase.ts";
import { createFirestoreRepository, importIntoFirestore } from "./firestore-repository.ts";
import {
  clearLocalData,
  createLocalStorageRepository,
  hasLocalData,
  readLocalSnapshot,
} from "./local-storage-repository.ts";
import { RepositoryProvider } from "./repository-context.tsx";

interface Account {
  /** False when Firebase isn't configured: no sign-in, everything stays in localStorage. */
  enabled: boolean;
  user: User | null;
  /** Signs in or up: Google doesn't distinguish, a new Google user just gets an account. */
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AccountContext = createContext<Account | null>(null);

const localRepository = createLocalStorageRepository();

/**
 * Signed out, data lives in localStorage. Signed in, it lives in Firestore (with an offline cache),
 * and whatever was saved locally is merged into the account on sign-in.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // `undefined` until Firebase has restored the session, so the wrong data never flashes up.
  const [user, setUser] = useState<User | null | undefined>(firebase ? undefined : null);

  useEffect(() => {
    if (!firebase) return;
    return onAuthStateChanged(firebase.auth, (next) => {
      // Cached queries belong to the previous repository.
      queryClient.clear();
      setUser(next);
    });
  }, [queryClient]);

  const repository = useMemo(
    () => (user && firebase ? createFirestoreRepository(firebase.db, user.uid) : localRepository),
    [user],
  );

  const account = useMemo((): Account => {
    const requireFirebase = () => {
      if (!firebase) throw new Error("Accounts are not configured");
      return firebase;
    };

    const importLocalData = async ({ user: signedIn }: UserCredential) => {
      if (!hasLocalData()) return;
      await importIntoFirestore(requireFirebase().db, signedIn.uid, readLocalSnapshot());
      clearLocalData();
      await queryClient.invalidateQueries();
    };

    return {
      enabled: firebase !== null,
      user: user ?? null,
      signInWithGoogle: async () =>
        importLocalData(
          await signInWithPopup(requireFirebase().auth, new GoogleAuthProvider(), browserPopupRedirectResolver),
        ),
      signInWithEmail: async (email, password) =>
        importLocalData(await signInWithEmailAndPassword(requireFirebase().auth, email, password)),
      signUpWithEmail: async (email, password) =>
        importLocalData(await createUserWithEmailAndPassword(requireFirebase().auth, email, password)),
      signOut: () => signOut(requireFirebase().auth),
    };
  }, [user, queryClient]);

  if (user === undefined) return null;

  return (
    <AccountContext.Provider value={account}>
      <RepositoryProvider repository={repository}>{children}</RepositoryProvider>
    </AccountContext.Provider>
  );
}

export const useAccount = (): Account => {
  const account = useContext(AccountContext);
  if (!account) throw new Error("useAccount must be used inside <AccountProvider>");
  return account;
};
