"use client";

import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <Suspense fallback={null}>
        <SignUp
          signInUrl="/sign-in"
          />
      </Suspense>
    </div>
  );
}