import express from 'express';
import cors from 'cors';
import sellerRoutes from './routes/seller.routes';
import clientRoutes from './routes/client.routes';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';
import debtRoutes from './routes/debt.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes
app.use('/api/sellers', sellerRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/debts', debtRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
