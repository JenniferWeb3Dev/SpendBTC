import React from "react";

export default function Notifications({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: "#fff3cd", padding: 8, borderRadius: 6, marginBottom: 8 }}>
      {message}
    </div>
  );
}
