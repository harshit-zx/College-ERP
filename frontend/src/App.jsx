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
          this is complete one stop solution for all your college management needs. It is a multi-college management platform that allows you to manage multiple colleges from a single platform. It is built using React for the frontend and Go for the backend. It is a SaaS application that can be deployed on any cloud platform.
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