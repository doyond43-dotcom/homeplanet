import React, { useState } from "react";
import AutoRepairLiveBoard from "../pages/AutoRepairLiveBoard";
import BoardLockGate from "../components/BoardLockGate";

export default function AutoRepairProtected() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <BoardLockGate onUnlock={() => setUnlocked(true)} />;
  }

  return <AutoRepairLiveBoard />;
}
