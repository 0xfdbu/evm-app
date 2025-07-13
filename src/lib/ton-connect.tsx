import { TonConnectUIProvider } from "@tonconnect/ui-react";
import React from "react";

export function withTonConnect(children: React.ReactNode) {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-social.vercel.app/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}
