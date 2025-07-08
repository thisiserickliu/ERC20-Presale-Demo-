import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ presaleInfo }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [status, setStatus] = useState(''); // 'waiting', 'active', 'ended'

  useEffect(() => {
    if (!presaleInfo) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const startTime = presaleInfo.presaleStart;
      const endTime = presaleInfo.presaleEnd;

      if (now < startTime) {
        // 等待開始
        setStatus('waiting');
        const diff = startTime - now;
        setTimeLeft({
          days: Math.floor(diff / 86400),
          hours: Math.floor((diff % 86400) / 3600),
          minutes: Math.floor((diff % 3600) / 60),
          seconds: diff % 60
        });
      } else if (now >= startTime && now <= endTime && !presaleInfo.presaleFinalized) {
        // 預售進行中
        setStatus('active');
        const diff = endTime - now;
        setTimeLeft({
          days: Math.floor(diff / 86400),
          hours: Math.floor((diff % 86400) / 3600),
          minutes: Math.floor((diff % 3600) / 60),
          seconds: diff % 60
        });
      } else {
        // 預售結束
        setStatus('ended');
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [presaleInfo]);

  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return 'Presale is about to start';
      case 'active':
        return 'Presale is active';
      case 'ended':
        return 'Presale has ended';
      default:
        return 'Loading...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600';
      case 'active':
        return 'text-green-600';
      case 'ended':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!presaleInfo) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading countdown...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Presale Countdown</h3>
      
      <div className="text-center mb-4">
        <p className={`text-lg font-bold ${getStatusColor()}`}>
          {getStatusText()}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
            <div className="text-sm text-gray-600">天</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{timeLeft.hours}</div>
            <div className="text-sm text-gray-600">時</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-600">分</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-600">秒</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>開始時間: {new Date(presaleInfo.presaleStart * 1000).toLocaleString()}</p>
        <p>結束時間: {new Date(presaleInfo.presaleEnd * 1000).toLocaleString()}</p>
      </div>
    </div>
  );
} 