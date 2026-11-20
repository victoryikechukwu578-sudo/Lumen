"use client";

import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <Suspense fallback={null}>
        <SignIn
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "mx-auto",
            }
          }}
        />
      </Suspense>
    </div>
  );
}