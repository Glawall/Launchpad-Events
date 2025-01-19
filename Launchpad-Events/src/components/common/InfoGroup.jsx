export default function InfoGroup({ label, children }) {
  return (
    <div className="info-group">
      <span className="info-label">{label}</span>
      {children}
    </div>
  );
}
