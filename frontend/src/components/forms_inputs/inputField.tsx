import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputFieldProps {
  className?: string;
  label: string;
  id: string;
  name: string;
  type: string;
  required: boolean;
  value?: string | number | undefined
  autoComplete?: boolean;
  readonly?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  /** Blurred while privacy mode is on */
  sensitive?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, name, type, required = false, value, autoComplete = false, readonly = false, placeholder, hint, error, sensitive = false, onChange, className }) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete ? "on" : "new-password"}
        onChange={onChange}
        readOnly={readonly}
        aria-invalid={error ? true : undefined}
        data-sensitive={sensitive || undefined}
        className={cn(readonly && "cursor-not-allowed text-muted-foreground")}
      />
      {error
        ? <p className="text-xs text-destructive">{error}</p>
        : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
