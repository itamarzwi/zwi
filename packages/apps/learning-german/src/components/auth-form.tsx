import { useMutation } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { useAccount } from "#/storage/account.tsx";

type Mode = "sign-in" | "sign-up";

const copy = {
  "sign-in": {
    title: "Sign in",
    submit: "Sign in",
    switchPrompt: "No account yet?",
    switchLabel: "Sign up",
    switchTo: "/sign-up",
  },
  "sign-up": {
    title: "Create an account",
    submit: "Sign up",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchTo: "/sign-in",
  },
} as const;

/** Firebase's own messages are developer-facing ("Firebase: Error (auth/…)"), so translate the common ones. */
const errorMessages: Record<string, string> = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/invalid-email": "That doesn't look like an email address.",
  "auth/email-already-in-use": "There's already an account with this email. Sign in instead.",
  "auth/weak-password": "Pick a password with at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/operation-not-allowed": "This sign-in method isn't enabled for the app yet.",
  "auth/unauthorized-domain": "Sign-in isn't allowed from this domain yet.",
};

/** Closing the Google popup isn't an error worth showing. */
const dismissedCodes = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request"]);

const describeError = (error: unknown): string | null => {
  if (error == null) return null;
  if (!(error instanceof FirebaseError)) return error instanceof Error ? error.message : String(error);
  if (dismissedCodes.has(error.code)) return null;
  return errorMessages[error.code] ?? error.message;
};

export function AuthForm({ mode }: { mode: Mode }) {
  const account = useAccount();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const text = copy[mode];

  const onSuccess = () => navigate({ to: "/" });
  const google = useMutation({ mutationFn: account.signInWithGoogle, onSuccess });
  const emailAuth = useMutation({
    mutationFn: () =>
      mode === "sign-in" ? account.signInWithEmail(email, password) : account.signUpWithEmail(email, password),
    onSuccess,
  });

  if (!account.enabled || account.user) return <Navigate to="/" />;

  // Deliberately not including `google.isPending`: when the popup is closed, Firebase takes several
  // seconds to reject, which would leave the buttons disabled. Clicking again just opens a new popup.
  const pending = emailAuth.isPending;
  const error = describeError(emailAuth.error ?? google.error);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    google.reset();
    emailAuth.mutate();
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{text.title}</CardTitle>
        <CardDescription>Sync your progress, words and lists across devices.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          onClick={() => {
            emailAuth.reset();
            google.mutate();
          }}
          disabled={pending}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={mode === "sign-up" ? 6 : undefined}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {emailAuth.isPending ? "One moment…" : text.submit}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center gap-1 text-sm text-muted-foreground">
        {text.switchPrompt}
        <Link to={text.switchTo} className="text-primary underline-offset-4 hover:underline">
          {text.switchLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}

/** Google's multicolour "G" mark, as Google's sign-in branding guidelines ask for. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" data-icon="inline-start" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
