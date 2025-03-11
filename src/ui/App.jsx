import React, { lazy, Suspense, useState } from "react";
import "./App.css";
import SideBar from "./components/SideBar.jsx";

const Home = lazy(() => import("./components/views/Home.jsx"));
const Map = lazy(() => import("./components/views/Map.jsx"));
const Heatmap = lazy(() => import("./components/views/Heatmap.jsx"));
const Notifs = lazy(() => import("./components/views/Notifs.jsx"));
const Data = lazy(() => import("./components/views/Data.jsx"));

function App() {
  const [activeView, setActiveView] = useState("Home");
  const [theme, setTheme] = useState(false);

  const renderView = () => {
    const props = { theme };

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
    <div className="app-container">
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
