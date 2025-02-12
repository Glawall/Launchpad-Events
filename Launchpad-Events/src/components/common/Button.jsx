export default function Button({
  children,
  variant = "default",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  let baseClass = "btn-default";

  switch (variant) {
    case "active":
      baseClass = "btn-active";
      break;
    case "red":
      baseClass = "btn-red";
      break;
    case "calendar":
      baseClass = "btn-calendar";
      break;
    case "link":
      baseClass = "btn-link";
      break;
  }

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
