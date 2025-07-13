import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header>
      <div className="app-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h3 className="">Marketplace</h3>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
