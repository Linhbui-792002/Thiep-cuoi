export function DaisyBouquet({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="40" cy="55" rx="18" ry="22" fill="var(--background)" stroke="var(--primary)" strokeWidth="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx={40 + Math.cos((angle * Math.PI) / 180) * 14}
          cy={55 + Math.sin((angle * Math.PI) / 180) * 14}
          rx="9"
          ry="5"
          fill="white"
          stroke="#ddd"
          strokeWidth="0.5"
          transform={`rotate(${angle} ${40 + Math.cos((angle * Math.PI) / 180) * 14} ${55 + Math.sin((angle * Math.PI) / 180) * 14})`}
        />
      ))}
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle
          key={`c-${angle}`}
          cx={40 + Math.cos((angle * Math.PI) / 180) * 6}
          cy={55 + Math.sin((angle * Math.PI) / 180) * 6}
          r="4"
          fill="#f9d71c"
        />
      ))}
      <path d="M38 75 Q40 90 42 75" stroke="var(--primary-light)" strokeWidth="2" fill="none" />
      <path d="M35 80 Q30 95 28 88" stroke="var(--primary-light)" strokeWidth="1.5" fill="none" />
      <path d="M45 80 Q50 95 52 88" stroke="var(--primary-light)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function TulipBouquet({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M20 65 Q18 45 20 30 Q22 20 18 15" stroke="var(--primary-light)" strokeWidth="1.5" fill="none" />
      <path d="M30 65 Q28 40 30 25 Q32 15 28 10" stroke="var(--primary-light)" strokeWidth="1.5" fill="none" />
      <path d="M40 65 Q42 45 38 28 Q36 18 42 12" stroke="var(--primary-light)" strokeWidth="1.5" fill="none" />
      <ellipse cx="18" cy="14" rx="7" ry="10" fill="#e74c3c" />
      <ellipse cx="28" cy="9" rx="7" ry="10" fill="#f1c40f" />
      <ellipse cx="42" cy="11" rx="7" ry="10" fill="#3498db" />
    </svg>
  );
}

function linenPattern(id: string) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6">
      <rect width="6" height="6" fill="var(--primary)" />
      <path d="M0 6 L6 0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
      <path d="M-1 2 L2 -1" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
    </pattern>
  );
}

function scallopedPath(cx: number, cy: number, r: number, lobes: number, amp: number) {
  const steps = lobes * 14;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const rr = r + amp * Math.cos(lobes * a);
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

/** Diamond 4-flap silhouette that sits behind the photos. */
export function EnvelopeBack({ className = "", uid = "back" }: { className?: string; uid?: string }) {
  const fill = `url(#linen-${uid})`;
  return (
    <svg
      className={className}
      viewBox="0 0 280 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>{linenPattern(`linen-${uid}`)}</defs>
      <path
        d="M140 10
           C168 10 214 78 248 108
           C268 124 274 148 272 168
           C268 198 214 236 140 268
           C66 236 12 198 8 168
           C6 148 12 124 32 108
           C66 78 112 10 140 10 Z"
        fill={fill}
      />
      <path d="M140 10 C168 10 214 78 248 108 L140 148 Z" fill="rgba(255,255,255,0.07)" />
      <path d="M32 108 C66 78 112 10 140 10 L140 148 Z" fill="rgba(0,0,0,0.08)" />
      <path d="M8 168 C12 198 66 236 140 268 L140 148 Z" fill="rgba(0,0,0,0.1)" />
      <path d="M272 168 C268 198 214 236 140 268 L140 148 Z" fill="rgba(255,255,255,0.05)" />
      <path
        d="M32 108 L140 148 L248 108"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/** Front flaps with a V opening so photos/ticket sit inside the pocket. */
export function EnvelopeFront({ className = "", uid = "front" }: { className?: string; uid?: string }) {
  const fill = `url(#linen-${uid})`;
  return (
    <svg
      className={className}
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>{linenPattern(`linen-${uid}`)}</defs>
      <path
        fill={fill}
        fillRule="evenodd"
        d="M4 14 H316 V198 Q160 224 4 198 Z
           M4 14 L160 128 L316 14 Z"
      />
      <path d="M4 14 L160 128 L4 198 Z" fill="rgba(0,0,0,0.16)" />
      <path d="M316 14 L160 128 L316 198 Z" fill="rgba(0,0,0,0.08)" />
      <path
        d="M24 200 L148 132 Q160 118 172 132 L296 200 Q160 218 24 200 Z"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M4 14 L160 128 L316 14"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M160 124 L18 196"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M160 124 L302 196"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function EnvelopeGraphic({ className = "", uid = "env" }: { className?: string; uid?: string }) {
  return <EnvelopeFront className={className} uid={uid} />;
}

export function SealBadge({
  monogram,
  ringText,
  className = "",
  uid = "seal",
}: {
  monogram: string;
  ringText: string;
  className?: string;
  uid?: string;
}) {
  const pathId = `seal-circle-${uid}`;
  const loop = `${ringText}  •  ${ringText}  •  `;
  return (
    <div className={`seal-badge ${className}`}>
      <div className="seal-badge-inner">
        <svg className="seal-ring" viewBox="0 0 100 100" width="108" height="108" aria-hidden>
          <defs>
            <path
              id={pathId}
              d="M 50,50 m -41,0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0"
            />
          </defs>
          <text>
            <textPath href={`#${pathId}`} startOffset="0%" textLength="258" lengthAdjust="spacing">
              {loop}
            </textPath>
          </text>
        </svg>
        <svg className="seal-wax" viewBox="0 0 100 100" width="67" height="67" aria-hidden>
          <path d={scallopedPath(50, 50, 34, 9, 4.6)} fill="var(--primary-dark)" />
          <path d={scallopedPath(50, 50, 32, 9, 4.2)} fill="var(--primary)" />
          <circle cx="50" cy="50" r="22" fill="var(--primary-dark)" />
          <circle cx="50" cy="50" r="20.5" fill="var(--primary)" />
          <circle cx="42" cy="40" r="10" fill="rgba(255,255,255,0.12)" />
        </svg>
        <span className="seal-mono font-script">{monogram}</span>
      </div>
    </div>
  );
}

export function HeartBouquet({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 50 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M25 45 C25 45 8 32 8 20 C8 13 13 8 20 8 C23 8 25 10 25 10 C25 10 27 8 30 8 C37 8 42 13 42 20 C42 32 25 45 25 45Z"
        stroke="var(--primary)"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="18" cy="18" r="3" fill="#e74c3c" opacity="0.7" />
      <circle cx="32" cy="16" r="2.5" fill="#f39c12" opacity="0.7" />
      <circle cx="25" cy="22" r="2" fill="#e91e8c" opacity="0.7" />
    </svg>
  );
}
