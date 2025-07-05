import React from 'react';

function PresaleStats({ presaleInfo }) {
  if (!presaleInfo) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const progress = (parseFloat(presaleInfo.tokensSold) / parseFloat(presaleInfo.totalTokensForSale)) * 100;
  const isActive = !presaleInfo.presaleFinalized && 
    Date.now() >= presaleInfo.presaleStart * 1000 && 
    Date.now() <= presaleInfo.presaleEnd * 1000;

  const formatTimeRemaining = () => {
    const now = Date.now();
    const end = presaleInfo.presaleEnd * 1000;
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <div className="card fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Presale Statistics</h2>
      
      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : presaleInfo.presaleFinalized 
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isActive ? 'Active' : presaleInfo.presaleFinalized ? 'Finalized' : 'Upcoming'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress.toFixed(2)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tokens Sold</h3>
          <p className="text-3xl font-bold text-blue-600">
            {parseFloat(presaleInfo.tokensSold).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            of {parseFloat(presaleInfo.totalTokensForSale).toLocaleString()} total
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Raised</h3>
          <p className="text-3xl font-bold text-green-600">
            ${parseFloat(presaleInfo.totalRaised).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">USDT</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Token Price</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${parseFloat(presaleInfo.tokenPrice).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">per token</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Remaining</h3>
          <p className="text-3xl font-bold text-orange-600">
            {formatTimeRemaining()}
          </p>
          <p className="text-sm text-gray-500">
            {isActive ? 'until presale ends' : 'presale period'}
          </p>
        </div>
      </div>

      {/* Purchase Limits */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Purchase Limits</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Minimum Purchase</p>
            <p className="text-lg font-semibold text-gray-900">
              {parseFloat(presaleInfo.minPurchase).toLocaleString()} tokens
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Maximum Purchase</p>
            <p className="text-lg font-semibold text-gray-900">
              {parseFloat(presaleInfo.maxPurchase).toLocaleString()} tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresaleStats; 