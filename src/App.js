import React, { useState } from 'react';
import './App.css';

function App() {
  const [contract, setContract] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('normal'); // 'normal' or 'roulette'

  const backendUrl = 'https://rugpull-backend.onrender.com/analyze';

  const handleCheck = async (target) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract: target }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      alert("Failed to fetch — backend might be sleeping or down.");
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (contract) {
      setMode('normal');
      handleCheck(contract);
    }
  };

  const handleRoulette = () => {
    const rugTokens = [
      "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", // Shiba
      "0x63d2d1ca2d3bb8da2d477db0f0e6555d65bf89c5", // ScamX
      "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", // Fake Rug
    ];
    const randomToken = rugTokens[Math.floor(Math.random() * rugTokens.length)];
    setContract(randomToken);
    setMode('roulette');
    handleCheck(randomToken);
  };

  return (
    <div className="app dark">
      <h1>🎰 Rug Pull Roulette</h1>

      <input
        type="text"
        value={contract}
        placeholder="Paste a contract address..."
        onChange={(e) => setContract(e.target.value)}
      />

      <div className="btn-group">
        <button onClick={handleSubmit}>Check Risk Score</button>
        <button onClick={handleRoulette}>Spin the Rug Wheel 🎯</button>
      </div>

      {loading && (
        <div className="loading">Spinning... 🌀</div>
      )}

      {response && (
        <div className="report">
          <h2 className="risk">
            {mode === 'roulette' ? '🎲 You Rolled:' : 'CRITICAL RISK:'} {response.risk_score}%
          </h2>
          <ul>
            {Object.values(response.reasons).map((reason, idx) => (
              <li key={idx}>⚠️ {reason}</li>
            ))}
          </ul>

          <div className="action-box">
            <h3>🛑 What to Do</h3>
            <p>{response.actionable[0]}</p>
          </div>

          <div className="footer-info">
            <p>📊 {response.similar_scams[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
