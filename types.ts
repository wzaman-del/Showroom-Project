export enum CarStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold',
  RESERVED = 'Reserved'
}

export interface Seller {
  id: string;
  name: string;
  contact: string;
  reputation: number; // 1-5 stars
  image: string;
}

export interface Buyer {
  id: string;
  name: string;
  contact: string;
  preferences: string[];
  budget: number;
  image: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: CarStatus;
  imageUrl: string;
  description?: string;
  sellerId: string; // The source of the car
  buyerId?: string; // The destination (if sold)
  soldDate?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  carsSold: number;
  inventoryCount: number;
}