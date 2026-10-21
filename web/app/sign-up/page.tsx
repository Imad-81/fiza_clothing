import type { Metadata } from "next";
import SignUpClient from "./sign-up-client";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Style By Fiza account to start shopping chic ready-to-wear fashion.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <SignUpClient />;
}
