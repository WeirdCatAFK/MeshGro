import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import APIinstance from "../api/api.js";

let apiAddress;
// Start the backend process (node.js)
const api = new APIinstance({
  host: "",
  port: 50500,
  logFormat: "common",
  isLocalhost: false,
});

try {
  await api.start();
  console.log("Backend process started successfully");
  apiAddress = await api.getAddress();
} catch (error) {
  console.error("Failed to start backend process:", error);
  app.quit();
}

// Initialize the frontend process (chromium)
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    titleBarOverlay: {
      color: "#333",
      symbolColor: "#ffff",
      height: 33,
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required to use `ipcRenderer` in the renderer process
      enableRemoteModule: true, // Required to use `remote` in the renderer process
    },
  });

  // Clear cache
  mainWindow.webContents.session.clearCache().then(() => {
    console.log("Cache cleared");
  });
  //Ensure always a single instance
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }

  if (isDev()) {
    mainWindow.loadURL("http://localhost:51234");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }

  // Send the API address to the frontend once the window is ready
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("api-address", apiAddress);
  });
});

// Recreate window on activate (macOS specific)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const mainWindow = new BrowserWindow({});
    if (isDev()) {
      console.log("Activating");
      mainWindow.loadURL("http://localhost:51234");
    } else {
      mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
    }
  }
});

// Handle all windows closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    api.stop();
    app.quit();
  }
});
