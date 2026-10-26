import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function TextField({
  label,
  description,
  error,
  name,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string
  name: string
  description?: string
  error?: string
}) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input id={name} name={name} aria-invalid={!!error} {...props} />
      {error ? (
        <FieldError>{error}</FieldError>
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  )
}

export { TextField }
