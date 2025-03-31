import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir archivos estáticos
app.use(express.static(path.resolve(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const port = 5000;
const ip = "localhost";
app.listen(port, ip, () => {
  console.log(`Servidor corriendo en http://${ip}:${port}`);
});
