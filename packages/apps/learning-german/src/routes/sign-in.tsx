import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "#/components/auth-form.tsx";

export const Route = createFileRoute("/sign-in")({ component: SignInPage });

function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
