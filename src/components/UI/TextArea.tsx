import { Field, TextArea as DesignTextArea } from '../../design/components/Field'

type TextAreaProps = {
  label?: string
  hint?: string
  error?: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  [key: string]: unknown
}

export default function TextArea({ label, hint, error, value, onChange, placeholder, rows, className, ...rest }: TextAreaProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      <DesignTextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={className}
        {...rest}
      />
    </Field>
  )
}
