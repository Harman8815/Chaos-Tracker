import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './DropdownMenu';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || 'Select';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-white shadow-sm transition-colors hover:bg-white/[0.1]">
          {selectedLabel}
          <ChevronDown className="h-4 w-4 text-text-secondary pointer-events-none" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[8rem]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className={value === option.value ? 'bg-white/[0.08] text-white' : 'text-text-secondary'}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CustomSelect };
export default CustomSelect;
