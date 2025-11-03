import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PaymentQRModal({ recipient = "", amount = "" }) {
  const payload = JSON.stringify({ recipient, amount });
  return (
    <div className="card flex items-center space-x-6">
      <div>
        <QRCodeSVG value={payload} size={140} />
      </div>
      <div>
        <div className="text-sm small-muted">Recipient</div>
        <div className="font-semibold">{recipient}</div>
        <div className="text-sm small-muted mt-3">Amount</div>
        <div className="font-semibold text-amber-300">{amount} MUSD</div>
      </div>
    </div>
  );
}
