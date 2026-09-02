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

/** Front of the same envelope: V opening so photos/ticket sit in the pocket. */
export function EnvelopeFront({ className = "", uid = "front" }: { className?: string; uid?: string }) {
  const fill = `url(#linen-${uid})`;
  return (
    <svg
      className={className}
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>{linenPattern(`linen-${uid}`)}</defs>
      <path
        fill={fill}
        fillRule="evenodd"
        d="M2 8 H298 V184 Q150 198 2 184 Z
           M2 8 L150 116 L298 8 Z"
      />
      <path d="M2 8 L150 116 L2 184 Z" fill="rgba(0,0,0,0.16)" />
      <path d="M298 8 L150 116 L298 184 Z" fill="rgba(0,0,0,0.08)" />
      <path
        d="M2 8 L150 116 L298 8"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

export function EnvelopeGraphic({ className = "", uid = "env" }: { className?: string; uid?: string }) {
  return <EnvelopeFront className={className} uid={uid} />;
}

/** Rectangular body of a closed envelope. */
export function EnvelopeBody({ className = "", uid = "body" }: { className?: string; uid?: string }) {
  const fill = `url(#linen-${uid})`;
  return (
    <svg
      className={className}
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>{linenPattern(`linen-${uid}`)}</defs>
      <rect x="2" y="8" width="296" height="176" rx="4" fill={fill} />
      <rect
        x="2"
        y="8"
        width="296"
        height="176"
        rx="4"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/** Downward triangular flap that covers the body when the envelope is shut. */
export function EnvelopeFlap({ className = "", uid = "flap" }: { className?: string; uid?: string }) {
  const fill = `url(#linen-${uid})`;
  return (
    <svg
      className={className}
      viewBox="0 0 300 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>{linenPattern(`linen-${uid}`)}</defs>
      <path d="M2 2 H298 L150 116 Z" fill={fill} />
      <path d="M2 2 L150 116 L150 2 Z" fill="rgba(0,0,0,0.1)" />
      <path d="M298 2 L150 116 L150 2 Z" fill="rgba(255,255,255,0.08)" />
      <path
        d="M2 2 H298 L150 116 Z"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

export function WaxSeal({ monogram, className = "" }: { monogram: string; className?: string }) {
  return (
    <div className={`wax-natural ${className}`} aria-hidden>
      <svg className="wax-natural-svg" viewBox="0 0 90 108" fill="none">
        <path
          d="M24 86 C22 96 28 106 34 104 C36 98 34 90 32 86 Z"
          fill="var(--primary-dark)"
        />
        <path
          d="M48 88 C50 100 56 110 61 106 C62 98 56 90 52 86 Z"
          fill="var(--primary)"
        />
        <path
          d="M62 78 C66 90 72 96 76 92 C74 84 68 78 64 74 Z"
          fill="var(--primary-dark)"
          opacity="0.92"
        />
        <path
          d="M40 6
             C18 10 8 28 10 46
             C7 58 14 70 22 76
             C18 82 26 86 34 80
             C40 86 54 84 58 76
             C70 80 82 66 80 50
             C84 32 72 12 54 8
             C50 4 44 4 40 6 Z"
          fill="var(--primary-dark)"
        />
        <path
          d="M40 11
             C22 15 14 30 16 46
             C14 56 20 67 28 72
             C26 76 32 78 38 74
             C44 80 56 76 58 70
             C68 74 76 62 74 48
             C78 32 66 16 52 13
             C48 10 44 10 40 11 Z"
          fill="var(--primary)"
        />
        <path
          d="M28 24 C22 28 24 38 32 36 C38 28 34 22 28 24 Z"
          fill="rgba(255,255,255,0.22)"
        />
        <path
          d="M36 38 C28 42 30 58 42 60 C54 58 56 42 46 38 C42 36 38 36 36 38 Z"
          fill="var(--primary-dark)"
          opacity="0.28"
        />
      </svg>
      <span className="wax-imprint font-script">{monogram}</span>
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
