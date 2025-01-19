export default function Button({
  children,
  variant = "blue", // blue, red, calendar
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  const baseClass = variant === "calendar" ? "btn-calendar" : `btn-${variant}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className}`}
    >
      {children}
    </button>
  );
}
