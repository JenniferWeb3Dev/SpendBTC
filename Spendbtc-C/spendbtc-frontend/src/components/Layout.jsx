import React from "react";
import WalletConnectButton from "./WalletConnectButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-black/80 to-slate-900/60 border-b border-white/5">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-400 shadow-inner">
              <strong className="text-black">₿</strong>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-btc-orange">SpendBTC</h1>
              <div className="text-xs small-muted">Bitcoin-backed spending — MVP</div>
            </div>
          </div>

          <WalletConnectButton />
        </div>
      </header>

      <main className="container py-8">{children}</main>
    </div>
  );
}
