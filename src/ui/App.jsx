import React, { lazy, Suspense, useState, useEffect } from "react";
import "./App.css";
import SideBar from "./components/SideBar.jsx";
import axios from "axios";
const { ipcRenderer } = window.require("electron");

const Home = lazy(() => import("./components/views/Home.jsx"));
const Map = lazy(() => import("./components/views/Map.jsx"));
const Heatmap = lazy(() => import("./components/views/Heatmap.jsx"));
const Notifs = lazy(() => import("./components/views/Notifs.jsx"));
const Data = lazy(() => import("./components/views/Data.jsx"));

function App() {
  //View and theme options
  const [activeView, setActiveView] = useState("Home");
  const [theme, setTheme] = useState(false);
  const [apiAddress, setApiAddress] = useState("");

  useEffect(() => {
    ipcRenderer.on("api-address", (event, address) => {
      setApiAddress(address);
    });


    // Clean up the listener when the component unmounts
    return () => {
      ipcRenderer.removeAllListeners("api-address");
    };
  }, []);

  const renderView = () => {
    const props = { theme, apiAddress };

    switch (activeView) {
      case "Home":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Home {...props} />
          </Suspense>
        );
      case "Map":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Map {...props} />
          </Suspense>
        );
      case "Heatmap":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Heatmap {...props} />
          </Suspense>
        );
      case "Notifs":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Notifs {...props} />
          </Suspense>
        );
      case "Data":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Data {...props} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`app-container ${theme ? "dark" : "light"}`}>
      <div className="header"></div>
      <div className="content">
        <SideBar
          setActiveView={setActiveView}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="content">{renderView()}</div>
      </div>
    </div>
  );
}

export default App;
