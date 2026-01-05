"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

function SignOutButton() {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
    >
      Sign out
    </Button>
  );
}

export { SignOutButton };
