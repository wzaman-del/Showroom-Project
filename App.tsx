import React, { useState } from 'react';
import { MENU_ITEMS, INITIAL_CARS, SELLERS, BUYERS } from './constants';
import { Car, CarStatus, Seller, Buyer } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import NetworkList from './components/NetworkList';
import { Gem, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [sellers, setSellers] = useState<Seller[]>(SELLERS);
  const [buyers, setBuyers] = useState<Buyer[]>(BUYERS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logic to sell a car
  const handleSellCar = (carId: string, buyerId: string) => {
    setCars(prev => prev.map(car => {
      if (car.id === carId) {
        return {
          ...car,
          status: CarStatus.SOLD,
          buyerId: buyerId,
          soldDate: new Date().toISOString().split('T')[0]
        };
      }
      return car;
    }));
  };

  // Logic to update description from AI
  const handleUpdateDescription = (carId: string, desc: string) => {
    setCars(prev => prev.map(car => {
      if (car.id === carId) {
        return { ...car, description: desc };
      }
      return car;
    }));
  };

  // CRUD Handlers
  const handleAddCar = (car: Car) => setCars([...cars, car]);
  const handleUpdateCar = (updatedCar: Car) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
  };
  const handleRemoveCar = (id: string) => setCars(cars.filter(c => c.id !== id));

  const handleAddSeller = (seller: Seller) => setSellers([...sellers, seller]);
  const handleUpdateSeller = (updatedSeller: Seller) => {
    setSellers(prev => prev.map(s => s.id === updatedSeller.id ? updatedSeller : s));
  };
  const handleRemoveSeller = (id: string) => setSellers(sellers.filter(s => s.id !== id));

  const handleAddBuyer = (buyer: Buyer) => setBuyers([...buyers, buyer]);
  const handleUpdateBuyer = (updatedBuyer: Buyer) => {
    setBuyers(prev => prev.map(b => b.id === updatedBuyer.id ? updatedBuyer : b));
  };
  const handleRemoveBuyer = (id: string) => setBuyers(buyers.filter(b => b.id !== id));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard cars={cars} />;
      case 'inventory':
        return (
          <Inventory 
            cars={cars} 
            sellers={sellers} 
            buyers={buyers} 
            onSellCar={handleSellCar}
            onUpdateDescription={handleUpdateDescription}
            onAddCar={handleAddCar}
            onUpdateCar={handleUpdateCar}
            onRemoveCar={handleRemoveCar}
          />
        );
      case 'network':
        return (
          <NetworkList 
            sellers={sellers} 
            buyers={buyers} 
            cars={cars}
            onAddSeller={handleAddSeller}
            onUpdateSeller={handleUpdateSeller}
            onRemoveSeller={handleRemoveSeller}
            onAddBuyer={handleAddBuyer}
            onUpdateBuyer={handleUpdateBuyer}
            onRemoveBuyer={handleRemoveBuyer}
          />
        );
      default:
        return <Dashboard cars={cars} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-neutral-900 bg-[#050505] hidden md:flex flex-col z-10">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            <Gem className="text-amber-500" size={24} />
          </div>
          <div>
            <h1 className="font-serif text-xl text-white tracking-wide">CROWN</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-600">Classic Motors</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-neutral-900 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]' 
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <span className={`transition-colors ${activeTab === item.id ? 'text-amber-500' : 'group-hover:text-amber-500/70'}`}>
                {item.icon}
              </span>
              <span className="font-medium tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#d4af37]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-neutral-900">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700"></div>
            <div>
              <p className="text-xs font-bold text-white">Admin Console</p>
              <p className="text-[10px] text-green-500">● Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800 bg-black/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <Gem className="text-amber-500" size={20} />
           <span className="font-serif text-lg text-white">CROWN CLASSIC</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-300">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black z-40 p-4">
          <nav className="space-y-4">
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg border ${
                   activeTab === item.id ? 'bg-neutral-900 border-amber-500/30 text-amber-500' : 'border-transparent text-neutral-400'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen p-6 lg:p-12 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="mb-10 relative z-10">
           <h2 className="text-3xl font-serif text-white mb-2">{MENU_ITEMS.find(i => i.id === activeTab)?.label}</h2>
           <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
        </header>

        <div className="relative z-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;