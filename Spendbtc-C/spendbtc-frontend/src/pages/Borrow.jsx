import React from "react";
import BorrowCard from "../components/BorrowCard";

export default function Borrow() {
  return (
    <div>
      <h2>Borrow</h2>
      <p>Deposit WBTC, then borrow MUSD against collateral.</p>
      <BorrowCard />
    </div>
  );
}
