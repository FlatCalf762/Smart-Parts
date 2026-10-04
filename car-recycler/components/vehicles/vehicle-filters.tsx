"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VehicleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function VehicleFilters({
  search,
  onSearchChange,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search VIN, make, model..."
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <Button variant="outline">
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}