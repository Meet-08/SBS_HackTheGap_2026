"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface SearchSelectProps {
  items: string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export function SelectInput({
  items,
  value,
  onSelect,
  placeholder,
  disabled,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>(items.slice(0, 5));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-white p-3 h-12 rounded-lg border-gray-200",
            disabled && "opacity-50 cursor-not-allowed bg-gray-50"
          )}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command
          shouldFilter={false}
          className="p-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D9A282]"
        >
          <CommandInput
            placeholder={`Search...`}
            onValueChange={(value) => {
              setFiltered(
                value
                  ? items
                      .filter((item) =>
                        item.toLowerCase().includes(value.toLowerCase())
                      )
                      .slice(0, 5)
                  : items.slice(0, 5)
              );
            }}
          />
          <CommandList>
            {filtered.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <CommandGroup>
              {filtered.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
