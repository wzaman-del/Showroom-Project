import { Car, CarStatus, Seller, Buyer } from './types';
import { LayoutDashboard, CarFront, Users, BadgeDollarSign } from 'lucide-react';

export const SELLERS: Seller[] = [
  { id: 's1', name: 'Prestige Imports Ltd', contact: 'contact@prestige.com', reputation: 5, image: 'https://picsum.photos/id/1005/100/100' },
  { id: 's2', name: 'Baron Von Auto', contact: 'baron@luxury.de', reputation: 4.8, image: 'https://picsum.photos/id/1012/100/100' },
  { id: 's3', name: 'Oceanic Exotics', contact: 'sales@oceanic.com', reputation: 4.5, image: 'https://picsum.photos/id/1025/100/100' },
];

export const BUYERS: Buyer[] = [
  { id: 'b1', name: 'James Sterling', contact: 'j.sterling@fund.com', preferences: ['Ferrari', 'Red'], budget: 500000, image: 'https://picsum.photos/id/100/100/100' },
  { id: 'b2', name: 'Elena Vossen', contact: 'elena.v@tech.io', preferences: ['Porsche', 'Electric'], budget: 250000, image: 'https://picsum.photos/id/200/100/100' },
  { id: 'b3', name: 'Sheikh Al-Rahman', contact: 'office@dubai.invest', preferences: ['Hypercar', 'Gold'], budget: 2000000, image: 'https://picsum.photos/id/300/100/100' },
];

export const INITIAL_CARS: Car[] = [
  {
    id: 'c1',
    make: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2023,
    price: 650000,
    status: CarStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/id/111/800/600',
    sellerId: 's1',
    description: 'A masterpiece of hybrid engineering, delivering 986 horsepower in a sculptured red body.'
  },
  {
    id: 'c2',
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    price: 320000,
    status: CarStatus.SOLD,
    imageUrl: 'https://picsum.photos/id/133/800/600',
    sellerId: 's2',
    buyerId: 'b2',
    soldDate: '2024-05-15',
    description: 'Track-focused precision tool. Aerodynamics derived directly from Formula 1.'
  },
  {
    id: 'c3',
    make: 'Lamborghini',
    model: 'Revuelto',
    year: 2024,
    price: 890000,
    status: CarStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/id/20/800/600',
    sellerId: 's3',
    description: 'The first HPEV (High Performance Electrified Vehicle) hybrid super sports car.'
  },
  {
    id: 'c4',
    make: 'Rolls-Royce',
    model: 'Spectre',
    year: 2024,
    price: 450000,
    status: CarStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/id/18/800/600',
    sellerId: 's1',
    description: 'The world\'s first ultra-luxury electric super coupé.'
  },
  {
    id: 'c5',
    make: 'Bugatti',
    model: 'Chiron',
    year: 2022,
    price: 3200000,
    status: CarStatus.SOLD,
    imageUrl: 'https://picsum.photos/id/119/800/600',
    sellerId: 's2',
    buyerId: 'b3',
    soldDate: '2024-02-10',
    description: 'The fastest, most powerful, and exclusive production super sports car.'
  }
];

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'inventory', label: 'Inventory', icon: <CarFront size={20} /> },
  { id: 'network', label: 'Network', icon: <Users size={20} /> },
];
