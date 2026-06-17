export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden" aria-hidden>
      <div className="ambient-mesh absolute inset-0" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="ambient-grain absolute inset-0" />
    </div>
  );
}
