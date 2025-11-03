import React, { useState } from "react";
import { useWeb3 } from "../context/wagmiClient";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { ethers } from "ethers";
import MUSDABI from "../abi/MUSD.json";

export default function ScanQRPage() {
  const { signer, account } = useWeb3();
  const [payload, setPayload] = useState("");
  const [parsed, setParsed] = useState(null);
  const [status, setStatus] = useState("");

  function parsePayload() {
    try {
      const obj = JSON.parse(payload);
      setParsed(obj);
      setStatus("");
    } catch (e) {
      setParsed(null);
      setStatus("Invalid JSON payload");
    }
  }

  async function acceptPayment() {
    if (!parsed || !signer) return setStatus("Connect wallet and parse payment");
    try {
      setStatus("Accepting payment...");
      const musd = new ethers.Contract(CONTRACT_ADDRESSES.MUSD, MUSDABI.abi ?? MUSDABI, signer);
      const amt = ethers.parseUnits(parsed.amount || "0", 18);
      // merchant pulls funds with transferFrom if buyer approved merchant beforehand
      const tx = await musd.transferFrom(parsed.recipient, account, amt);
      await tx.wait();
      setStatus("Payment received");
    } catch (e) {
      console.error(e);
      setStatus("Error: " + (e?.message || e));
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Merchant — Scan / Paste QR</h3>
      <div className="text-sm small-muted mb-3">Paste payment JSON or scan QR string</div>

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        rows={4}
        className="w-full p-3 bg-black/30 rounded-md border border-white/5"
        placeholder='{"recipient":"0x...","amount":"10"}'
      />

      <div className="flex items-center space-x-3 mt-3">
        <button onClick={parsePayload} className="px-4 py-2 rounded-md bg-gray-700">Parse</button>
        <button onClick={acceptPayment} className="px-4 py-2 rounded-md btn-primary">Accept Payment</button>
        <div className="small-muted">{status}</div>
      </div>

      {parsed && (
        <div className="mt-3 p-3 bg-black/20 rounded-md">
          <div className="text-sm small-muted">Recipient</div>
          <div className="font-semibold">{parsed.recipient}</div>
          <div className="text-sm small-muted mt-2">Amount</div>
          <div className="font-semibold text-amber-300">{parsed.amount} MUSD</div>
        </div>
      )}
    </div>
  );
}
