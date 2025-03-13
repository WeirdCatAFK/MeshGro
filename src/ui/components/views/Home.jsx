import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home({ theme, apiAddress }) {
  const [serverMessage, setServerMessage] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [logs, setLogs] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchServerStatus = () => {
    axios
      .get(`${apiAddress}`)
      .then((response) => {
        setServerMessage(response);
        setIsServerRunning(true);
      })
      .catch((error) => {
        setServerMessage(error.response || { status: 500 });
        setIsServerRunning(false);
      });
  };

  const fetchLogs = () => {
    setIsLoading(true);
    axios
      .get(`${apiAddress}/logs`)
      .then((response) => {
        setLogs(decodeURI(response.data));
        setIsLoading(false);
      })
      .catch((error) => {
        setServerMessage(error.response || { status: 500 });
        setIsLoading(false);
      });
  };

  // Initial data fetch
  useEffect(() => {
    fetchServerStatus();
    fetchLogs();
  }, [apiAddress]);

  // Set up auto-refresh every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLogs();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [apiAddress]);

  return (
    <div className={`view-container ${theme ? "dark" : "light"}`}>
      <div className="server-status-container">
        <div className="status-header">
          <div
            className={`status-dot ${isServerRunning ? "green" : "yellow"}`}
          />
          <h1 className="status-title">
            {isServerRunning
              ? "Successful Server Deployment!"
              : "Server Deployment Failed"}
          </h1>
        </div>
        <div className="server-details">
          {isServerRunning ? (
            <>
              <p className="status-message">Your mesh managing server is running at:</p>
              <p className="server-address">{apiAddress}</p>
            </>
          ) : (
            <p className="status-message">
              Failed to launch server at {apiAddress}
            </p>
          )}
        </div>
        
        <div className="logs-container">
          <div className="logs-header">
            <h2 className="logs-title">Server Logs</h2>
            <div className="logs-status">
              <div className={`refresh-indicator ${isLoading ? "loading" : ""}`}></div>
              <span className="refresh-text">Auto-refreshing every 30s</span>
            </div>
          </div>
          <div className="logs-content">
            {logs ? logs.split('\n').map((line, index) => (
              <div key={index} className="log-line">
                {line}
              </div>
            )) : "No logs available"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;