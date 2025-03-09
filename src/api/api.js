import morgan from "morgan";
import express from "express";
import cors from "./config/Cors.js";

class api {
  constructor(options = {}) {
    this.app = express();

    // Default options
    this.port = options.port || process.env.PORT || 50500;
    this.logFormat = options.logFormat || "dev";

    //Options for IP binding
    this.host = options.host || "localhost"; // Default to localhost
    this.isLocalhost = options.isLocalhost ?? true; // Default to true

    // If isLocalhost is false, bind to the provided host (IP address)
    if (!this.isLocalhost && this.host === "localhost") {
      console.warn(
        "Warning: isLocalhost is false, but host is set to localhost. Binding to all interfaces (0.0.0.0)."
      );
      this.host = "0.0.0.0";
    }

    this.initializeMiddleware();
  }

  initializeMiddleware() {
    this.app.use(cors);
    this.app.use(morgan(this.logFormat));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  async initializeRoutes() {
    //Ejemplo de como importar apropiadamente los routers para que se acoplen bien al proceso main de electron
    // const { default: configRouter } = await import("./routes/config.js");

    this.app.get("/", (req, res) => {
      res.status(200).send("Hello MeshGro");
    });
    //Ejemplo de como cargar los routers (en este proyecto aun no hacemos ninguno)
    //this.app.use("/config", configRouter);

    this.app.use((req, res) => {
      res.status(404).json({ code: 404, message: "Url no encontrada" });
    });
  }

  async start() {
    await this.initializeRoutes();

    return new Promise((resolve, reject) => {
      this.server = this.app
        .listen(this.port, () => {
          console.log(`Server is running on port ${this.port}`);
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
}

export default api;
