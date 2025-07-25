import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FigmaHomePage from './components/FigmaHomePage';
import PresalePage from './components/PresalePage';
import TestConnection from './components/TestConnection';
import SimpleTest from './components/SimpleTest';
import './App.css';

function Roadmap() {
  const milestones = [
    { quarter: '2025 Q3', milestone: 'Complete Sepolia testnet presale and finalize tokenomics' },
    { quarter: '2025 Q4', milestone: 'Deploy to Mainnet and establish initial liquidity' },
    { quarter: '2026 Q1', milestone: 'Launch DAO governance module for community proposals and voting' },
    { quarter: '2026 Q2', milestone: 'Introduce cross-chain bridge functionality' },
    { quarter: '2026 Q3', milestone: 'Release mobile wallet and integrated NFT platform' },
  ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg tracking-wide">Project Roadmap</h1>
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-lg text-cyan-700">Quarter</th>
              <th className="py-2 px-4 text-lg text-cyan-700">Milestone</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((item, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">{item.quarter}</td>
                <td className="py-3 px-4 text-gray-800">{item.milestone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* The Link component was removed from imports, so this line is commented out or removed if not needed */}
      {/* <Link to="/" className="mt-8 inline-block px-6 py-2 bg-cyan-600 text-white rounded-full shadow hover:bg-cyan-700 transition">Back to Home</Link> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FigmaHomePage />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/presale" element={<PresalePage />} />
        <Route path="/test" element={<TestConnection />} />
        <Route path="/simple" element={<SimpleTest />} />
      </Routes>
    </Router>
  );
}

export default App; 