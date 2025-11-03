// src/components/MerchantCard.jsx
import React, { useState } from "react";

const MerchantCard = () => {
  const [qrPayload, setQrPayload] = useState("");
  const [parsedData, setParsedData] = useState(null);

  const handleParse = () => {
    try {
      const data = JSON.parse(qrPayload);
      if (!data.recipient || !data.amount) {
        alert("Invalid payload: missing recipient or amount");
        return;
      }
      setParsedData(data);
    } catch (err) {
      alert("Invalid JSON format");
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h3 className="text-xl font-bold mb-2">Merchant</h3>

      <label className="block mb-1">Paste QR payload</label>
      <textarea
        className="border p-2 rounded w-full mb-2"
        value={qrPayload}
        onChange={(e) => setQrPayload(e.target.value)}
        placeholder='{"recipient":"0x...","amount":"10"}'
        rows={3}
      />

      <button
        onClick={handleParse}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mb-4"
      >
        Parse QR
      </button>

      {parsedData && (
        <div className="bg-gray-100 p-3 rounded">
          <p>
            <span className="font-semibold">Recipient:</span> {parsedData.recipient}
          </p>
          <p>
            <span className="font-semibold">Amount:</span> {parsedData.amount} MUSD
          </p>
        </div>
      )}
    </div>
  );
};

export default MerchantCard;
