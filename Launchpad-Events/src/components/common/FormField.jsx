export default function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
  rows,
  className = "",
}) {
  const inputProps = {
    type,
    name,
    value,
    onChange,
    required,
    placeholder,
    className: `input ${className}`,
  };

  return (
    <div className="input-group">
      <label className="label">{label}</label>
      {type === "textarea" ? (
        <textarea {...inputProps} rows={rows} />
      ) : (
        <input {...inputProps} />
      )}
    </div>
  );
}
