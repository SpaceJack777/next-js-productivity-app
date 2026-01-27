"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, type LucideIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export type ActionOption = {
  label?: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  icon?: LucideIcon | null;
  separator?: boolean;
};

export function AppActions({ options }: { options: ActionOption[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (onClick?: () => void) => {
    if (onClick) {
      onClick();
      setIsOpen(false);
    }
  };
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option, index) => {
          if (option.separator) {
            return <DropdownMenuSeparator key={index} />;
          }

          const content = (
            <div className="flex items-center gap-2">
              {option.icon && <option.icon className="size-4" />}
              {option.label}
            </div>
          );

          if (option.href) {
            return (
              <DropdownMenuItem
                key={index}
                asChild
                variant={option.variant ?? "default"}
                disabled={option.disabled}
              >
                <Link href={option.href} onClick={() => setIsOpen(false)}>
                  {content}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleClick(option.onClick)}
              variant={option.variant ?? "default"}
              disabled={option.disabled}
            >
              {content}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
