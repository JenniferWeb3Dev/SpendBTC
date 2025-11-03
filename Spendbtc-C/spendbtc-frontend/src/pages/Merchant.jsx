import React from "react";
import ScanQRPage from "../components/ScanQRPage";

export default function Merchant() {
  return (
    <div>
      <h2>Merchant</h2>
      <p>Paste or scan QR data to accept payments.</p>
      <ScanQRPage />
    </div>
  );
}
