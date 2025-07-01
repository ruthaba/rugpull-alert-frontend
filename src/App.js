import React, { useState } from "react";
import "./App.css";

function App() {
  const [contract, setContract] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      //const res = await fetch("http://127.0.0.1:5003/analyze", {
      const res = await fetch("https://rugpull-backend.onrender.com/analyze", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Error fetching data. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>🛡️ Rug Pull Early Warning System</h1>

      <input
        type="text"
        placeholder="Enter Token Contract Address"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
      />
      <button onClick={handleCheck} disabled={loading || !contract}>
        {loading ? "Scanning..." : "Check Risk Score"}
      </button>

      {result && (
        <div className="result">
          <h2 className="risk-score">
            🔴 CRITICAL RISK: <strong>{result.risk_score}%</strong>
          </h2>

          <div className="warnings">
            {Object.entries(result.reasons).map(([key, val]) => (
              <div key={key} className="warning-box">
                <span role="img" aria-label="warning">⚠️</span> {val}
              </div>
            ))}
          </div>

          <div className="action-box">
            <h3>🛑 What to Do</h3>
            <ul>
              {result.actionable.map((action, i) => (
                <li key={i}>
                  {action.includes("https://") ? (
                    <a href={action} target="_blank" rel="noopener noreferrer">
                      {action}
                    </a>
                  ) : (
                    action
                  )}
                </li>
              ))}
            </ul>
            <div className="buttons">
              <a
                href={`https://etherscan.io/address/${result.contract}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                🔍 View on Etherscan
              </a>
              <a
                href="https://chainabuse.com/submit"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-danger"
              >
                🚨 Report Scam
              </a>
            </div>
          </div>

          {result.similar_scams && result.similar_scams.length > 0 && (
            <div className="similar-scams">
              <h3>📊 Similar Past Scams</h3>
              <ul>
                {result.similar_scams.map((scam, i) => (
                  <li key={i}>{scam}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
