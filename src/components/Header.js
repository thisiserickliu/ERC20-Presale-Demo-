import React from 'react';

function Header({ account, onConnect }) {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">ERC20 Presale</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Connected</span>
                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">
                  {formatAddress(account)}
                </span>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 