"use client";

function Puff({ className }: { className: string }) {
  return (
    <span className={`cloud-puff ${className}`}>
      <i className="bump k1" />
      <i className="bump k2" />
      <i className="bump k3" />
      <i className="bump k4" />
      <i className="bump k5" />
    </span>
  );
}

export function OpeningOverlay({ parting }: { parting: boolean }) {
  return (
    <div className={`intro-clouds ${parting ? "is-parting" : ""}`} aria-hidden>
      <div className="cloud-layer cloud-layer-left">
        <Puff className="p1" />
        <Puff className="p2" />
        <Puff className="p3" />
        <Puff className="p4" />
        <Puff className="p5" />
      </div>
      <div className="cloud-layer cloud-layer-right">
        <Puff className="p6" />
        <Puff className="p7" />
        <Puff className="p8" />
        <Puff className="p9" />
        <Puff className="p10" />
      </div>
    </div>
  );
}
