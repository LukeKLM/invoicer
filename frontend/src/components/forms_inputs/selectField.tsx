import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  className?: string;
  label: string;
  id: string;
  name: string;
  required: boolean;
  options: SelectOption[];
  value?: string | number | undefined
  placeholder?: string;
  hint?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, name, required = false, options, value, placeholder, hint, onChange, className }) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          value={value ?? ""}
          onChange={onChange}
          className="block h-9 w-full appearance-none rounded-lg border border-input bg-card py-1.5 pl-3 pr-9 text-base text-foreground shadow-xs transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 md:text-sm"
        >
          {placeholder !== undefined && <option value="" disabled>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
