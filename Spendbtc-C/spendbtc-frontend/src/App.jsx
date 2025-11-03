import React, { useState, useEffect } from "react";
import { WagmiConfig, useAccount, useConnect, useDisconnect } from "wagmi";
import { wagmiConfig } from "./wagmiClient"; // assume your wagmiClient is set up
import { QRCodeCanvas as QRCode } from "qrcode.react";
import "./App.css"; // keep your black & gold CSS here

const STORAGE_KEY = "spendbtc_vault";

function readVaultState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { btcCollateral: 0, musdDebt: 0 };
    return JSON.parse(raw);
  } catch {
    return { btcCollateral: 0, musdDebt: 0 };
  }
}

function writeVaultState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <AppInner />
    </WagmiConfig>
  );
}

function AppInner() {
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // UI state
  const [activePage, setActivePage] = useState("home"); // home, borrow, pay, send
  const [btcCollateral, setBtcCollateral] = useState(0);
  const [musdDebt, setMusdDebt] = useState(0);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [qrRequestAmount, setQrRequestAmount] = useState("");

  useEffect(() => {
    const { btcCollateral: bc, musdDebt: md } = readVaultState();
    setBtcCollateral(bc);
    setMusdDebt(md);

    const params = new URLSearchParams(window.location.search);
    const recipient = params.get("recipient");
    const amount = params.get("amount");
    if (recipient && amount) {
      setRepayAmount(amount);
      setActivePage("borrow");
    }
  }, []);

  function fetchVaultData() {
    const { btcCollateral: bc, musdDebt: md } = readVaultState();
    setBtcCollateral(bc);
    setMusdDebt(md);
  }

  function depositAndBorrow() {
    const borrow = parseFloat(borrowAmount);
    if (!isConnected) return alert("Please connect your wallet first.");
    if (!borrow || borrow <= 0) return alert("Enter a valid borrow amount.");
    // simulate: collateral increases by borrow * 0.02 (tunable)
    const addedCollateral = borrow * 0.02; // e.g., 2% of borrowed amount in BTC (demo)
    const newCollateral = +(btcCollateral + addedCollateral).toFixed(6);
    const newDebt = +(musdDebt + borrow).toFixed(6);

    writeVaultState({ btcCollateral: newCollateral, musdDebt: newDebt });
    fetchVaultData();
    setBorrowAmount("");
    alert(`Borrowed ${borrow} MUSD (simulated). Collateral +${addedCollateral.toFixed(6)} BTC.`);
  }

  async function repayAndFreeCollateral() {
    const repay = parseFloat(repayAmount);
    if (!isConnected) return alert("Please connect your wallet first.");
    if (!repay || repay <= 0) return alert("Enter a valid repay amount.");
    if (repay > musdDebt) return alert("Repay amount cannot exceed current debt.");

    const freedCollateral = repay * 0.02;
    const newDebt = +(musdDebt - repay).toFixed(6);
    const newCollateral = Math.max(0, +(btcCollateral - freedCollateral).toFixed(6));

    writeVaultState({ btcCollateral: newCollateral, musdDebt: newDebt });
    fetchVaultData();
    setRepayAmount("");

    alert(`Repaid ${repay} MUSD (simulated). Freed ${freedCollateral.toFixed(6)} BTC collateral.`);
  }

  function handleSendBTC() {
    if (!isConnected) return alert("Connect wallet first.");
    if (!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0)
      return alert("Enter valid recipient and amount.");
    alert(`Sent ${sendAmount} BTC to ${sendAddress} (simulated).`);
    setSendAddress("");
    setSendAmount("");
  }

  function getRepayLink(amount) {
    const recipient = address || "0x0000000000000000000000000000000000000000";
    const base = window.location.origin + window.location.pathname; // preserve path
    const params = new URLSearchParams({ recipient, amount: String(amount) });
    return `${base}?${params.toString()}`;
  }

  const collateralRatioPercent =
    musdDebt > 0 ? Math.round((btcCollateral / musdDebt) * 100) : 0; 
  const collateralBarWidth = Math.min(collateralRatioPercent, 300) / 3; 

  return (
    <div className="app-root">
      {/* Header */}
      <header className="header">
        <div className="left">
          <h1 className="logo">SpendBTC</h1>
        </div>

        <div className="right">
          {isConnected ? (
            <>
              <span className="wallet">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button
                className="connect-btn"
                onClick={() => {
                  disconnect();
                  // keep vault state persisted in storage
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            // Show Connect buttons for available connectors
            connectors.map((c) => (
              <button
                key={c.id}
                className="connect-btn"
                onClick={() => connect({ connector: c })}
              >
                Connect Wallet
              </button>
            ))
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="menu">
        <button className={activePage === "home" ? "active" : ""} onClick={() => setActivePage("home")}>
          Dashboard
        </button>
        <button className={activePage === "borrow" ? "active" : ""} onClick={() => setActivePage("borrow")}>
          Borrow / Repay
        </button>
        <button className={activePage === "pay" ? "active" : ""} onClick={() => setActivePage("pay")}>
          Pay via QR
        </button>
        <button className={activePage === "send" ? "active" : ""} onClick={() => setActivePage("send")}>
          Send BTC
        </button>
      </nav>

      {/* Main */}
      <main className="main">
        {/* Dashboard */}
        {activePage === "home" && (
          <section className="card">
            <h2>Vault Overview</h2>

            <div className="row">
              <div>
                <p className="label">BTC Collateral</p>
                <p className="value">₿ {btcCollateral.toFixed(6)}</p>
              </div>

              <div>
                <p className="label">MUSD Debt</p>
                <p className="value">{musdDebt.toFixed(6)} MUSD</p>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <p className="label">Collateral Ratio</p>
              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{
                    width: `${collateralBarWidth}%`,
                    background: collateralRatioPercent >= 150 ? "#FFD700" : "#ff6b6b",
                  }}
                />
              </div>
              <p style={{ marginTop: 8, fontWeight: "600" }}>{collateralRatioPercent}%</p>
              <p style={{ marginTop: 6 }}>
                Health: {collateralRatioPercent >= 150 ? "Stable ✅" : "At Risk ⚠️"}
              </p>
            </div>
          </section>
        )}

        {/* Borrow / Repay */}
        {activePage === "borrow" && (
          <section className="card">
            <h2>Borrow MUSD using BTC</h2>

            <label className="input-label">Amount to borrow (MUSD)</label>
            <input
              className="input"
              type="number"
              placeholder="e.g. 100"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <button className="action-btn" onClick={depositAndBorrow}>
                Deposit BTC & Borrow
              </button>
            </div>

            <hr style={{ margin: "18px 0", borderColor: "#222" }} />

            <h3>Repay MUSD</h3>
            <label className="input-label">Amount to repay (MUSD)</label>
            <input
              className="input"
              type="number"
              placeholder="e.g. 50"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <button className="action-btn" onClick={repayAndFreeCollateral}>
                Repay & Free Collateral
              </button>
            </div>
          </section>
        )}

        {/* Pay via QR */}
        {activePage === "pay" && (
          <section className="card" style={{ textAlign: "center" }}>
            <h2>Pay via QR (MUSD)</h2>

            <label className="input-label">Amount to request (MUSD)</label>
            <input
              className="input"
              type="number"
              placeholder="Amount to request"
              value={qrRequestAmount}
              onChange={(e) => setQrRequestAmount(e.target.value)}
              style={{ margin: "0 auto", display: "block", maxWidth: 180 }}
            />

            <div style={{ marginTop: 14 }}>
              {isConnected ? (
                <>
                  <div className="qr-box">
                    <QRCode value={getRepayLink(qrRequestAmount || musdDebt || 0)} size={180} fgColor="#FFD700" bgColor="#000" />
                  </div>

                  <p style={{ marginTop: 8 }}>Scan this QR to open SpendBTC and prefill repayment.</p>

                  <div style={{ marginTop: 12 }}>
                    <a
                      className="link-btn"
                      href={getRepayLink(qrRequestAmount || musdDebt || 0)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open link (test)
                    </a>
                  </div>
                </>
              ) : (
                <p>Connect your wallet to generate a repayment QR.</p>
              )}
            </div>
          </section>
        )}

        {/* Send BTC */}
        {activePage === "send" && (
          <section className="card">
            <h2>Send BTC (mock)</h2>
            <label className="input-label">Recipient BTC Address</label>
            <input className="input" type="text" placeholder="Recipient address" value={sendAddress} onChange={(e) => setSendAddress(e.target.value)} />

            <label className="input-label">Amount (BTC)</label>
            <input className="input" type="number" placeholder="Amount" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />

            <div style={{ marginTop: 12 }}>
              <button className="action-btn" onClick={handleSendBTC}>Send BTC</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );

  function depositAndBorrow() {
    const borrow = parseFloat(borrowAmount);
    if (!isConnected) return alert("Please connect your wallet first.");
    if (!borrow || borrow <= 0) return alert("Enter a valid borrow amount.");
    const addedCollateral = borrow * 0.02;
    const newCollateral = +(btcCollateral + addedCollateral).toFixed(6);
    const newDebt = +(musdDebt + borrow).toFixed(6);
    writeVaultState({ btcCollateral: newCollateral, musdDebt: newDebt });
    fetchVaultData();
    setBorrowAmount("");
    alert(`Borrowed ${borrow} MUSD (simulated). Collateral +${addedCollateral.toFixed(6)} BTC.`);
  }

  async function repayAndFreeCollateral() {
    const repay = parseFloat(repayAmount);
    if (!isConnected) return alert("Please connect your wallet first.");
    if (!repay || repay <= 0) return alert("Enter a valid repay amount.");
    if (repay > musdDebt) return alert("Repay amount cannot exceed current debt.");
    const freedCollateral = repay * 0.02;
    const newDebt = +(musdDebt - repay).toFixed(6);
    const newCollateral = Math.max(0, +(btcCollateral - freedCollateral).toFixed(6));
    writeVaultState({ btcCollateral: newCollateral, musdDebt: newDebt });
    fetchVaultData();
    setRepayAmount("");
    alert(`Repaid ${repay} MUSD (simulated). Freed ${freedCollateral.toFixed(6)} BTC collateral.`);
  }

  function handleSendBTC() {
    if (!isConnected) return alert("Connect wallet first.");
    if (!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0) return alert("Enter valid recipient and amount.");
    alert(`Sent ${sendAmount} BTC to ${sendAddress} (simulated).`);
    setSendAddress("");
    setSendAmount("");
  }

  function getRepayLink(amount) {
    const recipient = address || "0x0000000000000000000000000000000000000000";
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({ recipient, amount: String(amount) });
    return `${base}?${params.toString()}`;
  }
}
