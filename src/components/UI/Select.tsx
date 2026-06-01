import { Field, Select as DesignSelect } from '../../design/components/Field'

export default function Select({ label, value, onChange, options, className, ...rest }) {
  const normalizedOptions = options.map((opt) => ({
    value: opt.value ?? opt,
    label: opt.label ?? opt,
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
