import { useState } from "react";

export default async function IsIngcognito() {
  const [IsPrivate, setPrivate] = useState(false);
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();
    const quotaInMib = Math.round(quota / (1024 * 1024));
    console.log(`Using ${usage} out of ${quota} bytes.`);
    if (quotaInMib <= 5000) {
      setPrivate(true);
    } else {
      setPrivate(false);
    }
  }
  try {
    window.openDatabase(null, null, null, null);
  } catch (_) {
    setPrivate(true);
  }
  return IsPrivate;
}
