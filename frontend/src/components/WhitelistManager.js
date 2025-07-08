import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export default function WhitelistManager({ account, provider, presaleAddress, presaleABI }) {
  const [isOwner, setIsOwner] = useState(false);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  
  // 白名單管理狀態
  const [whitelistEntries, setWhitelistEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newAddresses, setNewAddresses] = useState('');
  const [csvData, setCsvData] = useState('');
  
  // 統計資訊
  const [stats, setStats] = useState({
    total: 0,
    whitelisted: 0,
    notWhitelisted: 0
  });

  // 顯示訊息
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // 載入基本資訊
  const loadBasicInfo = useCallback(async () => {
    if (!account || !provider || !presaleAddress) return;
    
    try {
      setLoading(true);
      const contract = new ethers.Contract(presaleAddress, presaleABI, provider);
      
      const [enabled, owner] = await Promise.all([
        contract.whitelistEnabled(),
        contract.owner()
      ]);
      
      setWhitelistEnabled(enabled);
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
      
      // 載入模擬白名單資料（實際應用中需要從事件日誌獲取）
      loadMockWhitelistData();
      
    } catch (error) {
      console.error('Error loading basic info:', error);
      showMessage('載入基本資訊失敗', 'error');
    } finally {
      setLoading(false);
    }
  }, [account, provider, presaleAddress, presaleABI]);

  // 載入模擬白名單資料
  const loadMockWhitelistData = () => {
    const mockData = [
      { address: '0x1234567890123456789012345678901234567890', status: true, addedAt: Date.now() - 86400000 },
      { address: '0x2345678901234567890123456789012345678901', status: true, addedAt: Date.now() - 172800000 },
      { address: '0x3456789012345678901234567890123456789012', status: false, addedAt: Date.now() - 259200000 },
      { address: '0x4567890123456789012345678901234567890123', status: true, addedAt: Date.now() - 345600000 },
      { address: '0x5678901234567890123456789012345678901234', status: false, addedAt: Date.now() - 432000000 },
    ];
    
    setWhitelistEntries(mockData);
    updateStats(mockData);
  };

  // 更新統計資訊
  const updateStats = (entries) => {
    const whitelisted = entries.filter(entry => entry.status).length;
    setStats({
      total: entries.length,
      whitelisted,
      notWhitelisted: entries.length - whitelisted
    });
  };

  // 切換白名單啟用狀態
  const toggleWhitelist = async () => {
    if (!isOwner) return;
    
    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(presaleAddress, presaleABI, signer);
      
      const tx = await contract.setWhitelistEnabled(!whitelistEnabled);
      await tx.wait();
      
      setWhitelistEnabled(!whitelistEnabled);
      showMessage(`白名單已${!whitelistEnabled ? '啟用' : '停用'}`, 'success');
    } catch (error) {
      console.error('Error toggling whitelist:', error);
      showMessage('切換白名單狀態失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 新增白名單地址
  const addToWhitelist = async (addresses) => {
    if (!isOwner) return;
    
    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(presaleAddress, presaleABI, signer);
      
      const validAddresses = addresses.filter(addr => ethers.utils.isAddress(addr));
      const statuses = new Array(validAddresses.length).fill(true);
      
      const tx = await contract.setWhitelist(validAddresses, statuses);
      await tx.wait();
      
      // 更新本地狀態
      const newEntries = validAddresses.map(addr => ({
        address: addr,
        status: true,
        addedAt: Date.now()
      }));
      
      setWhitelistEntries(prev => [...prev, ...newEntries]);
      updateStats([...whitelistEntries, ...newEntries]);
      showMessage(`已新增 ${validAddresses.length} 個地址到白名單`, 'success');
      setShowAddModal(false);
      setNewAddresses('');
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      showMessage('新增白名單失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 移除白名單地址
  const removeFromWhitelist = async (addresses) => {
    if (!isOwner) return;
    
    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(presaleAddress, presaleABI, signer);
      
      const statuses = new Array(addresses.length).fill(false);
      
      const tx = await contract.setWhitelist(addresses, statuses);
      await tx.wait();
      
      // 更新本地狀態
      setWhitelistEntries(prev => 
        prev.map(entry => 
          addresses.includes(entry.address) 
            ? { ...entry, status: false }
            : entry
        )
      );
      
      showMessage(`已從白名單移除 ${addresses.length} 個地址`, 'success');
      setSelectedEntries(new Set());
    } catch (error) {
      console.error('Error removing from whitelist:', error);
      showMessage('移除白名單失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 批次操作
  const handleBatchOperation = async (operation) => {
    if (selectedEntries.size === 0) {
      showMessage('請選擇要操作的地址', 'error');
      return;
    }
    
    const addresses = Array.from(selectedEntries);
    if (operation === 'add') {
      await addToWhitelist(addresses);
    } else {
      await removeFromWhitelist(addresses);
    }
  };

  // CSV 匯入
  const handleCsvImport = () => {
    if (!csvData.trim()) {
      showMessage('請輸入 CSV 資料', 'error');
      return;
    }
    
    const lines = csvData.trim().split('\n');
    const addresses = [];
    
    for (const line of lines) {
      const address = line.trim().split(',')[0]; // 假設地址在第一列
      if (ethers.utils.isAddress(address)) {
        addresses.push(address);
      }
    }
    
    if (addresses.length === 0) {
      showMessage('未找到有效的地址', 'error');
      return;
    }
    
    addToWhitelist(addresses);
    setShowImportModal(false);
    setCsvData('');
  };

  // CSV 匯出
  const handleCsvExport = () => {
    const csvContent = whitelistEntries
      .filter(entry => entry.status)
      .map(entry => `${entry.address},${entry.status},${new Date(entry.addedAt).toISOString()}`)
      .join('\n');
    
    const blob = new Blob([`Address,Status,AddedAt\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whitelist_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showMessage('CSV 檔案已下載', 'success');
  };

  // 篩選白名單條目
  const filteredEntries = whitelistEntries.filter(entry =>
    entry.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 全選/取消全選
  const toggleSelectAll = () => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map(entry => entry.address)));
    }
  };

  // 切換單個選擇
  const toggleSelection = (address) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(address)) {
      newSelected.delete(address);
    } else {
      newSelected.add(address);
    }
    setSelectedEntries(newSelected);
  };

  useEffect(() => {
    loadBasicInfo();
  }, [loadBasicInfo]);

  if (!isOwner) {
    return (
      <div className="card mt-8">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">權限不足</h2>
          <p className="text-gray-600">只有合約擁有者才能管理白名單</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-8">
      {/* 標題與統計 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Whitelist Management</h2>
          <p className="text-gray-600">Manage presale whitelist addresses</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Whitelisted</div>
            <div className="text-2xl font-bold text-green-600">{stats.whitelisted}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Not Whitelisted</div>
            <div className="text-2xl font-bold text-red-600">{stats.notWhitelisted}</div>
          </div>
        </div>
      </div>

      {/* 白名單開關 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Whitelist Status</h3>
            <p className="text-sm text-gray-600">
              {whitelistEnabled ? 'Whitelist is enabled, only whitelisted addresses can purchase' : 'Whitelist is disabled, all addresses can purchase'}
            </p>
          </div>
          <button
            onClick={toggleWhitelist}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              whitelistEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                whitelistEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="btn-primary"
        >
          ➕ Add Address
        </button>
        <button
          onClick={() => setShowImportModal(true)}
          disabled={loading}
          className="btn-secondary"
        >
          📥 Import CSV
        </button>
        <button
          onClick={handleCsvExport}
          disabled={loading}
          className="btn-secondary"
        >
          📤 Export CSV
        </button>
        <button
          onClick={() => handleBatchOperation('add')}
          disabled={loading || selectedEntries.size === 0}
          className="btn-success"
        >
          ✅ Batch Add ({selectedEntries.size})
        </button>
        <button
          onClick={() => handleBatchOperation('remove')}
          disabled={loading || selectedEntries.size === 0}
          className="btn-danger"
        >
          ❌ Batch Remove ({selectedEntries.size})
        </button>
      </div>

      {/* 搜尋 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* 白名單列表 */}
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEntries.size === filteredEntries.length && filteredEntries.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  加入時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.address} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEntries.has(entry.address)}
                      onChange={() => toggleSelection(entry.address)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.status ? '✅ Whitelisted' : '❌ Not Whitelisted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.addedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        if (entry.status) {
                          removeFromWhitelist([entry.address]);
                        } else {
                          addToWhitelist([entry.address]);
                        }
                      }}
                      disabled={loading}
                      className={`text-sm px-3 py-1 rounded-md ${
                        entry.status
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {entry.status ? '移除' : '加入'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            沒有找到符合條件的白名單記錄
          </div>
        )}
      </div>

      {/* 新增地址 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Whitelist Address</h3>
            <textarea
              value={newAddresses}
              onChange={(e) => setNewAddresses(e.target.value)}
              placeholder="Enter addresses, one per line..."
              className="input-field w-full h-32"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const addresses = newAddresses.split('\n').map(addr => addr.trim()).filter(addr => addr);
                  addToWhitelist(addresses);
                }}
                disabled={loading || !newAddresses.trim()}
                className="btn-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 匯入 CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Import CSV</h3>
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste CSV data, addresses should be in the first column..."
              className="input-field w-full h-32"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvImport}
                disabled={loading || !csvData.trim()}
                className="btn-primary"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 訊息顯示 */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          messageType === 'success' ? 'bg-green-100 text-green-800' :
          messageType === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* 載入狀態 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 