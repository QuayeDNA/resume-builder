import { Field, Select as DesignSelect } from '../../design/components/Field'

type SelectOption = string | { value: string; label: string }

type SelectProps = {
  label?: string
  value: string
  onChange?: (value: string) => void
  options: SelectOption[]
  className?: string
  [key: string]: unknown
}

export default function Select({ label, value, onChange, options, className, ...rest }: SelectProps) {
  const normalizedOptions = options.map((opt) => ({
    value: typeof opt === 'string' ? opt : opt.value,
    label: typeof opt === 'string' ? opt : opt.label,
  }))

  return (
    <Field label={label}>
      <DesignSelect
        value={value}
        onChange={onChange}
        options={normalizedOptions}
        className={className}
        {...rest}
      />
    </Field>
  )
}
