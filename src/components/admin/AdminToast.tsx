"use client";

import { useEffect, useState } from "react";

export function AdminToast({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!message) {
      setOpen(false);
      return;
    }
    setOpen(true);
    const timer = window.setTimeout(() => setOpen(false), 2800);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!open || !message) return null;

  return (
    <div className={`admin-toast ${error ? "is-error" : "is-success"}`} role="status">
      {message}
    </div>
  );
}
