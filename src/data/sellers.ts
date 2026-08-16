export interface Seller {
    id: string;
    phone: string;
    name: string;
    password: string;
    createdAt: string;
  }
  
  export const sellers: Seller[] = [
    {
      id: "seller_001",
      phone: "+998901234567",
      name: "Abdulla",
      password: "123456",
      createdAt: "2026-08-10T10:00:00.000Z",
    },
    {
      id: "seller_002",
      phone: "+998909876543",
      name: "Aziz",
      password: "654321",
      createdAt: "2026-08-11T11:30:00.000Z",
    },
    {
      id: "seller_003",
      phone: "+998931112233",
      name: "Sardor",
      password: "111222",
      createdAt: "2026-08-12T09:15:00.000Z",
    },
  ];