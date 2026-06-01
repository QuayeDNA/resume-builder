import { Field, TextArea as DesignTextArea } from '../../design/components/Field'

export default function TextArea({ label, hint, error, value, onChange, placeholder, rows, className, ...rest }) {
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
