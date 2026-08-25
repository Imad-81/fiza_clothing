import type { Metadata } from "next";
import SignInClient from "./sign-in-client";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your House of Aarovi account to view orders, manage your wishlist, and more.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInClient />;
}
