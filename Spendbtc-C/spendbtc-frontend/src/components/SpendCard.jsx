import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";


const SpendCard = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [qrValue, setQrValue] = useState("");

  const generateQR = () => {
    if (!recipient || !amount) {
      alert("Please enter both recipient and amount");
      return;
    }

    const payload = {
      recipient,
      amount,
    };

    setQrValue(JSON.stringify(payload));
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h3 className="text-xl font-bold mb-2">Spend</h3>

      <label className="block mb-1">Recipient Address</label>
      <input
        type="text"
        className="border p-2 rounded w-full mb-2"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="0x..."
      />

      <label className="block mb-1">Amount (MUSD)</label>
      <input
        type="number"
        className="border p-2 rounded w-full mb-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
      />

      <button
        onClick={generateQR}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-4"
      >
        Generate QR
      </button>

      {qrValue && (
        <div className="flex flex-col items-center">
          <QRCode value={qrValue} size={150} />
          <p className="mt-2 text-sm break-all">{qrValue}</p>
        </div>
      )}
    </div>
  );
};

export default SpendCard;
