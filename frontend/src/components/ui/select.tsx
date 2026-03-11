"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, options, value, onValueChange, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const selected = options.find((opt) => opt.value === value)

    return (
      <div className="relative">
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
          onClick={() => setOpen(!open)}
          {...props}
        >
          {selected ? selected.label : "Select..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {open && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === option.value && "bg-accent"
                )}
                onClick={() => {
                  onValueChange?.(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
