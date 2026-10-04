"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="text-lg font-semibold">Inventory Management</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-medium">
            D
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">Employee</p>
            <p className="text-xs text-muted-foreground">
              Inventory Staff
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}