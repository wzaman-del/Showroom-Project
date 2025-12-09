import React, { useState } from 'react';
import { Car, Seller, Buyer, CarStatus } from '../types';
import { Sparkles, DollarSign, Tag, Trash2, Plus, X, Pencil } from 'lucide-react';
import { generateMarketingCopy } from '../services/geminiService';

interface InventoryProps {
  cars: Car[];
  sellers: Seller[];
  buyers: Buyer[];
  onSellCar: (carId: string, buyerId: string) => void;
  onUpdateDescription: (carId: string, desc: string) => void;
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onRemoveCar: (carId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ cars, sellers, buyers, onSellCar, onUpdateDescription, onAddCar, onUpdateCar, onRemoveCar }) => {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '', model: '', year: new Date().getFullYear(), price: 0, imageUrl: ''
  });

  const handleGenerateAI = async (car: Car) => {
    setGeneratingId(car.id);
    const description = await generateMarketingCopy(car.make, car.model, car.year);
    onUpdateDescription(car.id, description);
    setGeneratingId(null);
  };

  const handleSellClick = (carId: string) => {
    setSelectedCarId(carId);
    setSelectedBuyerId('');
  };

  const confirmSale = () => {
    if (selectedCarId && selectedBuyerId) {
      onSellCar(selectedCarId, selectedBuyerId);
      setSelectedCarId(null);
    }
  };

  const openAddModal = () => {
    setFormData({ make: '', model: '', year: new Date().getFullYear(), price: 0, imageUrl: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setFormData({ ...car });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const submitCarForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.make && formData.model && formData.price && formData.sellerId) {
      if (isEditing && formData.id) {
        // Update existing car
        onUpdateCar(formData as Car);
      } else {
        // Add new car
        const carToAdd: Car = {
          id: Date.now().toString(),
          make: formData.make,
          model: formData.model,
          year: formData.year || new Date().getFullYear(),
          price: Number(formData.price),
          status: CarStatus.AVAILABLE,
          imageUrl: formData.imageUrl || `https://source.unsplash.com/random/800x600/?luxury,car,${formData.make}`,
          sellerId: formData.sellerId,
          description: ''
        };
        onAddCar(carToAdd);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <p className="text-neutral-400">Total Vehicles: <span className="text-white">{cars.length}</span></p>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded hover:bg-amber-400 transition-colors font-medium"
        >
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cars.map(car => {
          const seller = sellers.find(s => s.id === car.sellerId);
          const buyer = buyers.find(b => b.id === car.buyerId);
          const isSold = car.status === CarStatus.SOLD;

          return (
            <div key={car.id} className={`group relative bg-neutral-900 rounded-xl overflow-hidden border transition-all duration-300 ${isSold ? 'border-neutral-800 opacity-80' : 'border-amber-500/20 hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]'}`}>
              
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={car.imageUrl} 
                  alt={`${car.make} ${car.model}`} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800';
                  }}
                  className={`w-full h-full object-cover transition-transform duration-700 ${!isSold && 'group-hover:scale-105'} ${isSold ? 'grayscale-[50%]' : ''}`}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${isSold ? 'bg-neutral-800/90 text-neutral-400' : 'bg-amber-500/90 text-black'}`}>
                    {car.status}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => openEditModal(car)}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-amber-500 hover:text-black transition-colors backdrop-blur-md"
                    title="Edit Vehicle"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => onRemoveCar(car.id)}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                    title="Remove Vehicle"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12">
                   <p className="text-2xl font-serif text-white">${car.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-serif text-neutral-200">{car.year} {car.make} {car.model}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500 uppercase tracking-wider">
                     <Tag size={12} />
                     <span>Sourced from {seller?.name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="min-h-[60px]">
                  <p className="text-sm text-neutral-400 italic leading-relaxed border-l-2 border-amber-500/30 pl-3">
                    {car.description || "No description available."}
                  </p>
                </div>

                {/* Info Grid */}
                {isSold && buyer ? (
                  <div className="bg-neutral-950 p-3 rounded border border-neutral-800 flex items-center gap-3">
                    <img src={buyer.image} className="w-8 h-8 rounded-full" alt="Buyer" />
                    <div>
                      <p className="text-xs text-neutral-500 uppercase">Acquired By</p>
                      <p className="text-sm text-amber-500">{buyer.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleSellClick(car.id)}
                      className="flex-1 bg-white text-black py-2 rounded font-medium hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <DollarSign size={16} /> Sell Vehicle
                    </button>
                    <button 
                      onClick={() => handleGenerateAI(car)}
                      disabled={generatingId === car.id}
                      className="px-3 py-2 border border-neutral-700 rounded text-neutral-400 hover:text-amber-400 hover:border-amber-400 transition-colors disabled:opacity-50"
                      title="Generate AI Description"
                    >
                      <Sparkles size={18} className={generatingId === car.id ? 'animate-spin' : ''} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Car Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/30 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-serif text-amber-400 mb-6">{isEditing ? 'Edit Vehicle Details' : 'Acquire New Vehicle'}</h3>
            <form onSubmit={submitCarForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Make</label>
                  <input required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} placeholder="e.g. Ferrari" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Model</label>
                  <input required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. 488 GTB" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Year</label>
                  <input type="number" required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Price ($)</label>
                  <input type="number" required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Sourced From (Seller)</label>
                <select required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none"
                  value={formData.sellerId || ''} onChange={e => setFormData({...formData, sellerId: e.target.value})}
                >
                  <option value="">Select Partner...</option>
                  {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Image URL (Optional)</label>
                <input className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                  value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors mt-2">
                {isEditing ? 'Save Changes' : 'Add to Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sell Modal Overlay */}
      {selectedCarId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/30 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setSelectedCarId(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-serif text-amber-400 mb-2">Finalize Transaction</h3>
            <p className="text-neutral-400 text-sm mb-6">Select a distinguished client to acquire the {cars.find(c => c.id === selectedCarId)?.make} {cars.find(c => c.id === selectedCarId)?.model}.</p>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-300">Select Buyer</label>
              <select 
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value)}
                className="w-full bg-black border border-neutral-700 text-white p-3 rounded focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">-- Choose Client --</option>
                {buyers.map(b => (
                   <option key={b.id} value={b.id}>{b.name} (Budget: ${b.budget.toLocaleString()})</option>
                ))}
              </select>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setSelectedCarId(null)}
                  className="flex-1 py-3 rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSale}
                  disabled={!selectedBuyerId}
                  className="flex-1 py-3 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;