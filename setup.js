const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dirsToCreate = [
  'config',
  'controllers',
  'services',
  'routes',
  'middleware',
  'data',
  'types'
];

dirsToCreate.forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Remove unused directories
['utils', 'validations'].forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

const files = {
  'config/env.ts': `import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
};
`,
  'types/seller.types.ts': `export interface Seller {
  id: string;
  phone: string;
  name: string;
  password: string;
  createdAt: string;
}
`,
  'types/client.types.ts': `export interface Client {
  id: string;
  sellerId: string;
  name: string;
  phone: string;
  createdAt: string;
}
`,
  'types/product.types.ts': `export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}
`,
  'types/sale.types.ts': `export interface Sale {
  id: string;
  sellerId: string;
  clientId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}
`,
  'types/debt.types.ts': `export interface Debt {
  id: string;
  sellerId: string;
  clientId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  createdAt: string;
}
`,
  'data/sellers.ts': `import { Seller } from '../types/seller.types';

export const sellers: Seller[] = [
  {
    id: "seller_001",
    phone: "+998901234567",
    name: "Abdulla",
    password: "123456",
    createdAt: "2026-08-10T10:00:00.000Z",
  }
];
`,
  'data/clients.ts': `import { Client } from '../types/client.types';
export const clients: Client[] = [];
`,
  'data/products.ts': `import { Product } from '../types/product.types';
export const products: Product[] = [];
`,
  'data/sales.ts': `import { Sale } from '../types/sale.types';
export const sales: Sale[] = [];
`,
  'data/debts.ts': `import { Debt } from '../types/debt.types';
export const debts: Debt[] = [];
`,
  'services/seller.service.ts': `import { sellers } from '../data/sellers';
import { Seller } from '../types/seller.types';

export const registerSellerService = (data: Partial<Seller>): Seller => {
  const newSeller: Seller = {
    id: \`seller_\${Date.now()}\`,
    phone: data.phone!,
    name: data.name!,
    password: data.password!,
    createdAt: new Date().toISOString(),
  };
  sellers.push(newSeller);
  return newSeller;
};

export const loginSellerService = (phone: string, password: string): Seller | undefined => {
  return sellers.find(s => s.phone === phone && s.password === password);
};

export const getSellerByIdService = (id: string): Seller | undefined => {
  return sellers.find(s => s.id === id);
};
`,
  'controllers/seller.controller.ts': `import { Request, Response, NextFunction } from 'express';
import { registerSellerService, loginSellerService, getSellerByIdService } from '../services/seller.service';

export const registerSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = registerSellerService(req.body);
    const { password, ...sellerWithoutPassword } = seller;
    res.status(201).json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const loginSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password } = req.body;
    const seller = loginSellerService(phone, password);
    if (!seller) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { password: _, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = getSellerByIdService(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const { password, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getSellerProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = getSellerByIdService(req.params.id); // For now, passing ID
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const { password, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};
`,
  'routes/seller.routes.ts': `import { Router } from 'express';
import { registerSeller, loginSeller, getSeller, getSellerProfile } from '../controllers/seller.controller';

const router = Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/:id', getSeller);
router.get('/:id/profile', getSellerProfile);

export default router;
`,
  'services/client.service.ts': `import { clients } from '../data/clients';
import { Client } from '../types/client.types';

export const createClientService = (data: Partial<Client>): Client => {
  const newClient: Client = {
    id: \`client_\${Date.now()}\`,
    sellerId: data.sellerId!,
    name: data.name!,
    phone: data.phone!,
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  return newClient;
};

export const getClientsService = (sellerId: string): Client[] => {
  return clients.filter(c => c.sellerId === sellerId);
};

export const getClientByIdService = (id: string, sellerId: string): Client | undefined => {
  return clients.find(c => c.id === id && c.sellerId === sellerId);
};

export const updateClientService = (id: string, sellerId: string, data: Partial<Client>): Client | undefined => {
  const index = clients.findIndex(c => c.id === id && c.sellerId === sellerId);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...data };
    return clients[index];
  }
  return undefined;
};

export const deleteClientService = (id: string, sellerId: string): boolean => {
  const index = clients.findIndex(c => c.id === id && c.sellerId === sellerId);
  if (index !== -1) {
    clients.splice(index, 1);
    return true;
  }
  return false;
};
`,
  'controllers/client.controller.ts': `import { Request, Response, NextFunction } from 'express';
import { createClientService, getClientsService, getClientByIdService, updateClientService, deleteClientService } from '../services/client.service';

export const createClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = createClientService(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

export const getClients = (req: Request, res: Response, next: NextFunction) => {
  try {
    // In future, get sellerId from req.user
    const sellerId = req.query.sellerId as string;
    const result = getClientsService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const client = getClientByIdService(req.params.id, sellerId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const client = updateClientService(req.params.id, sellerId, req.body);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const success = deleteClientService(req.params.id, sellerId);
    if (!success) return res.status(404).json({ message: 'Client not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
`,
  'routes/client.routes.ts': `import { Router } from 'express';
import { createClient, getClients, getClient, updateClient, deleteClient } from '../controllers/client.controller';

const router = Router();

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
`,
  'services/product.service.ts': `import { products } from '../data/products';
import { Product } from '../types/product.types';

export const createProductService = (data: Partial<Product>): Product => {
  const newProduct: Product = {
    id: \`prod_\${Date.now()}\`,
    sellerId: data.sellerId!,
    name: data.name!,
    price: data.price!,
    stock: data.stock!,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return newProduct;
};

export const getProductsService = (sellerId: string): Product[] => {
  return products.filter(p => p.sellerId === sellerId);
};

export const getProductByIdService = (id: string, sellerId: string): Product | undefined => {
  return products.find(p => p.id === id && p.sellerId === sellerId);
};

export const updateProductService = (id: string, sellerId: string, data: Partial<Product>): Product | undefined => {
  const index = products.findIndex(p => p.id === id && p.sellerId === sellerId);
  if (index !== -1) {
    products[index] = { ...products[index], ...data };
    return products[index];
  }
  return undefined;
};

export const deleteProductService = (id: string, sellerId: string): boolean => {
  const index = products.findIndex(p => p.id === id && p.sellerId === sellerId);
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
};
`,
  'controllers/product.controller.ts': `import { Request, Response, NextFunction } from 'express';
import { createProductService, getProductsService, getProductByIdService, updateProductService, deleteProductService } from '../services/product.service';

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const result = getProductsService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const product = getProductByIdService(req.params.id, sellerId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const product = updateProductService(req.params.id, sellerId, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const success = deleteProductService(req.params.id, sellerId);
    if (!success) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
`,
  'routes/product.routes.ts': `import { Router } from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
`,
  'services/sale.service.ts': `import { sales } from '../data/sales';
import { Sale } from '../types/sale.types';

export const createSaleService = (data: Partial<Sale>): Sale => {
  const newSale: Sale = {
    id: \`sale_\${Date.now()}\`,
    sellerId: data.sellerId!,
    clientId: data.clientId!,
    productId: data.productId!,
    quantity: data.quantity!,
    totalPrice: data.totalPrice!,
    createdAt: new Date().toISOString(),
  };
  sales.push(newSale);
  // Optional: Add logic to update product stock and handle debt if not fully paid
  return newSale;
};

export const getSalesService = (sellerId: string): Sale[] => {
  return sales.filter(s => s.sellerId === sellerId);
};

export const getSaleByIdService = (id: string, sellerId: string): Sale | undefined => {
  return sales.find(s => s.id === id && s.sellerId === sellerId);
};
`,
  'controllers/sale.controller.ts': `import { Request, Response, NextFunction } from 'express';
import { createSaleService, getSalesService, getSaleByIdService } from '../services/sale.service';

export const createSale = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = createSaleService(req.body);
    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};

export const getSales = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const result = getSalesService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getSale = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const sale = getSaleByIdService(req.params.id, sellerId);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    next(error);
  }
};
`,
  'routes/sale.routes.ts': `import { Router } from 'express';
import { createSale, getSales, getSale } from '../controllers/sale.controller';

const router = Router();

router.post('/', createSale);
router.get('/', getSales);
router.get('/:id', getSale);

export default router;
`,
  'services/debt.service.ts': `import { debts } from '../data/debts';
import { Debt } from '../types/debt.types';

export const createDebtService = (data: Partial<Debt>): Debt => {
  const newDebt: Debt = {
    id: \`debt_\${Date.now()}\`,
    sellerId: data.sellerId!,
    clientId: data.clientId!,
    amount: data.amount!,
    dueDate: data.dueDate!,
    isPaid: data.isPaid || false,
    createdAt: new Date().toISOString(),
  };
  debts.push(newDebt);
  return newDebt;
};

export const getDebtsService = (sellerId: string): Debt[] => {
  return debts.filter(d => d.sellerId === sellerId);
};

export const getDebtByIdService = (id: string, sellerId: string): Debt | undefined => {
  return debts.find(d => d.id === id && d.sellerId === sellerId);
};

export const updateDebtService = (id: string, sellerId: string, data: Partial<Debt>): Debt | undefined => {
  const index = debts.findIndex(d => d.id === id && d.sellerId === sellerId);
  if (index !== -1) {
    debts[index] = { ...debts[index], ...data };
    return debts[index];
  }
  return undefined;
};

export const deleteDebtService = (id: string, sellerId: string): boolean => {
  const index = debts.findIndex(d => d.id === id && d.sellerId === sellerId);
  if (index !== -1) {
    debts.splice(index, 1);
    return true;
  }
  return false;
};
`,
  'controllers/debt.controller.ts': `import { Request, Response, NextFunction } from 'express';
import { createDebtService, getDebtsService, getDebtByIdService, updateDebtService, deleteDebtService } from '../services/debt.service';

export const createDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const debt = createDebtService(req.body);
    res.status(201).json(debt);
  } catch (error) {
    next(error);
  }
};

export const getDebts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const result = getDebtsService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const debt = getDebtByIdService(req.params.id, sellerId);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (error) {
    next(error);
  }
};

export const updateDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const debt = updateDebtService(req.params.id, sellerId, req.body);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (error) {
    next(error);
  }
};

export const deleteDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const success = deleteDebtService(req.params.id, sellerId);
    if (!success) return res.status(404).json({ message: 'Debt not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
`,
  'routes/debt.routes.ts': `import { Router } from 'express';
import { createDebt, getDebts, getDebt, updateDebt, deleteDebt } from '../controllers/debt.controller';

const router = Router();

router.post('/', createDebt);
router.get('/', getDebts);
router.get('/:id', getDebt);
router.put('/:id', updateDebt);
router.delete('/:id', deleteDebt);

export default router;
`,
  'middleware/auth.middleware.ts': `import { Request, Response, NextFunction } from 'express';

// For future JWT implementation
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // if (!token) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) return res.status(401).json({ message: 'Invalid token' });
  //   req.user = decoded;
  //   next();
  // });
  
  // For now, allow all
  next();
};
`,
  'middleware/error.middleware.ts': `import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
`,
  'app.ts': `import express from 'express';
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
`,
  'server.ts': `import app from './app';
import { env } from './config/env';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(srcDir, file), content);
});

console.log('Setup complete.');
