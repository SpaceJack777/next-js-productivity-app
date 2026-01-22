"use client";

import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { Spinner } from "./ui/spinner";
import { PropsWithChildren } from "react";

type SubmitButtonProps = PropsWithChildren<{
  className?: string;
}>;

export default function SubmitButton({
  children,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? <Spinner /> : null}
      {children}
    </Button>
  );
}
