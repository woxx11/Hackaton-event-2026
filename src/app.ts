import express from "express";
import cors from "cors";
import sellerRoutes from "./routes/seller.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Hisobim API ishlayapti",
  });
});
app.use("/seller", sellerRoutes);
export default app;