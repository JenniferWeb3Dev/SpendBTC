import React, { useState } from "react";
import PaymentQRModal from "../components/PaymentQRModal";
import { useWeb3 } from "../context/wagmiClient";

export default function Spend() {
  const { account } = useWeb3();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div>
      <h2>Spend</h2>
      <p>Create a payment QR to give to a merchant.</p>

      <div style={{ marginTop: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Recipient address</label>
          <input value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ marginLeft: 8, width: 420 }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Amount (MUSD)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <PaymentQRModal recipient={recipient || account} amount={amount || "0"} />
        </div>
      </div>
    </div>
  );
}
