import { Field, Input as DesignInput } from '../../design/components/Field'

export default function Input({ label, hint, error, value, onChange, placeholder, type, className, ...rest }) {
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
