import morgan from "morgan";
import express from "express";
import cors from "./config/Cors.js";
import os from "os";
import fs from "fs";
import path from "path";
import { app } from "electron";
class api {
  constructor(options = {}) {
    this.app = express();

    // Default options
    this.port = options.port || process.env.PORT || 50500;
    this.logFormat = options.logFormat || "combined";

    // Options for IP binding
    this.host = options.host || "localhost"; // Default to localhost
    this.isLocalhost = options.isLocalhost ?? true;

    // If isLocalhost is false, find an available network interface
    if (!this.isLocalhost && this.host === "localhost") {
      this.host = this.findAvailableInterface();
      if (!this.host) {
        console.warn(
          "No available network interface found. Binding to all interfaces (0.0.0.0)."
        );
        this.host = "0.0.0.0";
      }
    }

    // Create a log file path
    this.logFilePath = decodeURI(
      path.join(app.getPath("userData"), "data", "api.log")
    );

    // Ensure the directory exists
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Create the log file if it doesn't exist
    try {
      if (!fs.existsSync(this.logFilePath)) {
        console.log("Log file doesn't exist, creating one");
        fs.writeFileSync(this.logFilePath, ""); // Create an empty file
      }
    } catch (error) {
      console.error("Failed to create log file:", error);
    }

    // Create a write stream (in append mode)
    this.logStream = fs.createWriteStream(this.logFilePath, {
      flags: "a",
      encoding: "utf8",
    });

    // Initialize middleware
    this.initializeMiddleware();
  }

  findAvailableInterface() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // Skip internal (i.e., 127.0.0.1) and non-IPv4 addresses
        if (iface.internal || iface.family !== "IPv4") continue;
        return iface.address;
      }
    }
    return null;
  }

  initializeMiddleware() {
    this.app.use(cors);
    this.app.use(morgan(this.logFormat, { stream: this.logStream })); // Use the custom logger instance
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  async initializeRoutes() {
    // Ejemplo de como importar apropiadamente los routers para que se acoplen bien al proceso main de electron
    // const { default: configRouter } = await import("./routes/config.js");

    this.app.get("/", (req, res) => {
      res.status(200).send("Hello MeshGro");
    });

    // Add a route to retrieve the log file
    this.app.get("/logs", (req, res) => {
      fs.readFile(this.logFilePath, "utf8", (err, data) => {
        if (err) {
          res.status(500).send("Unable to read log file");
        } else {
          res.status(200).send(data);
        }
      });
    });

    // Ejemplo de como cargar los routers (en este proyecto aun no hacemos ninguno)
    // this.app.use("/config", configRouter);

    this.app.use((req, res) => {
      res.status(404).json({ code: 404, message: "Url no encontrada" });
    });
  }

  async start() {
    await this.initializeRoutes();

    return new Promise((resolve, reject) => {
      this.server = this.app
        .listen(this.port, this.host, () => {
          console.log(`Server is running on http://${this.host}:${this.port}`);
          resolve(this.server);
        })
        .on("error", (err) => {
          console.error("Failed to start server:", err);
          reject(err);
        });
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            console.error("Error closing server:", err);
            reject(err);
          } else {
            console.log("Server stopped");
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  async getAddress() {
    return `http://${this.host}:${this.port}`;
  }
}

export default api;
