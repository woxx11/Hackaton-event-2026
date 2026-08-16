export interface SellerAuthContext {
  role: "SELLER";
  sellerId: string;
}

export interface ClientAuthContext {
  role: "CLIENT";
  clientId: string;
}

declare global {
  namespace Express {
    interface Request {
      seller?: SellerAuthContext;
      client?: ClientAuthContext;
    }
  }
}

export {};
