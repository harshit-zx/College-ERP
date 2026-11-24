import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking backend...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");

        setStatus(response.data.message);
        setConnected(response.data.success);
      } catch (error) {
        setStatus("Backend connection failed");
        setConnected(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="container">
      <div className="card">
        <h1>College ERP SaaS</h1>

        <p>
          Multi-College Management Platform
        </p>

        <div className={connected ? "success" : "error"}>
          <span className="dot" />
          {status}
        </div>

        <p className="subtitle">
          React frontend + Go backend
        </p>
      </div>
    </main>
  );
}

export default App;