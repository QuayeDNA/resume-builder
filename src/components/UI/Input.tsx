import { Field, Input as DesignInput } from '../../design/components/Field'

type InputProps = {
  label?: string
  hint?: string
  error?: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
  [key: string]: unknown
}

export default function Input({ label, hint, error, value, onChange, placeholder, type, className, ...rest }: InputProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      <DesignInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={className}
        {...rest}
      />
    </Field>
  )
}
