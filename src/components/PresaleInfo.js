import React from 'react';

function PresaleInfo({ presaleInfo }) {
  if (!presaleInfo) {
    return null;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Presale Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Token Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Token Name:</span>
              <span className="font-medium">MyToken (MTK)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Token Price:</span>
              <span className="font-medium">${parseFloat(presaleInfo.tokenPrice).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Supply:</span>
              <span className="font-medium">1,000,000 MTK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Presale Allocation:</span>
              <span className="font-medium">500,000 MTK (50%)</span>
            </div>
          </div>
        </div>

        {/* Presale Schedule */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Presale Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">
                {formatDate(presaleInfo.presaleStart)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium">
                {formatDate(presaleInfo.presaleEnd)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">30 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                presaleInfo.presaleFinalized 
                  ? 'text-red-600' 
                  : Date.now() >= presaleInfo.presaleStart * 1000 && Date.now() <= presaleInfo.presaleEnd * 1000
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}>
                {presaleInfo.presaleFinalized 
                  ? 'Finalized' 
                  : Date.now() >= presaleInfo.presaleStart * 1000 && Date.now() <= presaleInfo.presaleEnd * 1000
                  ? 'Active'
                  : 'Upcoming'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Limits */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {parseFloat(presaleInfo.minPurchase).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Minimum Purchase</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {parseFloat(presaleInfo.maxPurchase).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Maximum Purchase</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {presaleInfo.whitelistEnabled ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Whitelist Required</div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Tokens will be distributed immediately after purchase</li>
            <li>• All purchases are final and non-refundable</li>
            <li>• Make sure you have sufficient USDT balance before purchasing</li>
            <li>• Gas fees are not included in the token price</li>
            <li>• Unsold tokens will be returned to the project team after presale ends</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PresaleInfo; 