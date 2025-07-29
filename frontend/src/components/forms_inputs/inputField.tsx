import { Input } from "@/components/ui/input"

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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, name, type, required = false, value, autoComplete = false, readonly = false, onChange, className }) => {
  return (
    <div className={className}>
      <label className="block text-sm/6 font-medium text-gray-900">{label}</label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete ? "on" : "new-password"}
        onChange={onChange}
        readOnly={readonly}
        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      />
    </div>
  )
}
