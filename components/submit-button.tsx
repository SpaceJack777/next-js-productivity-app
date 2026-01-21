"use client";

import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { Spinner } from "./ui/spinner";
import { PropsWithChildren } from "react";

export default function SubmitButton({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : null}
      {children}
    </Button>
  );
}
