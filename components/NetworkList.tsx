import React, { useState } from 'react';
import { Buyer, Seller, Car } from '../types';
import { Plus, Trash2, X, Pencil } from 'lucide-react';

interface NetworkListProps {
  sellers: Seller[];
  buyers: Buyer[];
  cars: Car[];
  onAddSeller: (seller: Seller) => void;
  onUpdateSeller: (seller: Seller) => void;
  onRemoveSeller: (id: string) => void;
  onAddBuyer: (buyer: Buyer) => void;
  onUpdateBuyer: (buyer: Buyer) => void;
  onRemoveBuyer: (id: string) => void;
}

const NetworkList: React.FC<NetworkListProps> = ({ 
  sellers, buyers, cars, 
  onAddSeller, onUpdateSeller, onRemoveSeller, onAddBuyer, onUpdateBuyer, onRemoveBuyer 
}) => {
  const [modalConfig, setModalConfig] = useState<{ type: 'seller' | 'buyer', mode: 'add' | 'edit' } | null>(null);
  
  const [sellerForm, setSellerForm] = useState<Partial<Seller>>({ name: '', contact: '', reputation: 5, image: '' });
  const [buyerForm, setBuyerForm] = useState<Partial<Buyer>>({ name: '', contact: '', budget: 0, preferences: [], image: '' });
  const [prefInput, setPrefInput] = useState('');

  const openAddSeller = () => {
    setSellerForm({ name: '', contact: '', reputation: 5, image: '' });
    setModalConfig({ type: 'seller', mode: 'add' });
  };

  const openEditSeller = (seller: Seller) => {
    setSellerForm({ ...seller });
    setModalConfig({ type: 'seller', mode: 'edit' });
  };

  const openAddBuyer = () => {
    setBuyerForm({ name: '', contact: '', budget: 0, preferences: [], image: '' });
    setPrefInput('');
    setModalConfig({ type: 'buyer', mode: 'add' });
  };

  const openEditBuyer = (buyer: Buyer) => {
    setBuyerForm({ ...buyer });
    setPrefInput('');
    setModalConfig({ type: 'buyer', mode: 'edit' });
  };

  const submitSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellerForm.name) {
      if (modalConfig?.mode === 'edit' && sellerForm.id) {
        onUpdateSeller(sellerForm as Seller);
      } else {
        onAddSeller({
          id: `s-${Date.now()}`,
          name: sellerForm.name!,
          contact: sellerForm.contact || 'No Contact',
          reputation: Number(sellerForm.reputation) || 5,
          image: sellerForm.image || `https://source.unsplash.com/random/200x200/?portrait,business,${sellerForm.name}`
        });
      }
      setModalConfig(null);
    }
  };

  const submitBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerForm.name) {
      if (modalConfig?.mode === 'edit' && buyerForm.id) {
        onUpdateBuyer(buyerForm as Buyer);
      } else {
         onAddBuyer({
          id: `b-${Date.now()}`,
          name: buyerForm.name!,
          contact: buyerForm.contact || 'No Contact',
          budget: Number(buyerForm.budget) || 0,
          preferences: buyerForm.preferences || [],
          image: buyerForm.image || `https://source.unsplash.com/random/200x200/?rich,portrait,${buyerForm.name}`
        });
      }
      setModalConfig(null);
      setPrefInput('');
    }
  };

  const addPreference = () => {
    if (prefInput) {
      setBuyerForm({ ...buyerForm, preferences: [...(buyerForm.preferences || []), prefInput] });
      setPrefInput('');
    }
  };

  const removePreference = (pref: string) => {
    setBuyerForm({ ...buyerForm, preferences: (buyerForm.preferences || []).filter(p => p !== pref) });
  };

  return (
    <div className="space-y-12">
      {/* Sellers Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-amber-400 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Trusted Partners (Sellers)
          </h2>
          <button 
            onClick={openAddSeller}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-500 transition-colors border border-neutral-800 hover:border-amber-500 px-3 py-1.5 rounded"
          >
            <Plus size={16} /> Add Partner
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map(seller => {
            const inventory = cars.filter(c => c.sellerId === seller.id);
            return (
              <div key={seller.id} className="group relative bg-neutral-900 border border-neutral-800 p-6 rounded-lg hover:border-amber-500/50 transition-colors">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => openEditSeller(seller)}
                    className="text-neutral-600 hover:text-amber-500"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => onRemoveSeller(seller.id)}
                    className="text-neutral-600 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <img src={seller.image} alt={seller.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/20" />
                  <div>
                    <h3 className="text-lg font-medium text-white">{seller.name}</h3>
                    <div className="text-amber-500 text-sm">{'★'.repeat(Math.round(seller.reputation))}</div>
                  </div>
                </div>
                <div className="text-sm text-neutral-400 space-y-2">
                  <p>Contact: <span className="text-neutral-300">{seller.contact}</span></p>
                  <p>Cars Supplied: <span className="text-neutral-300">{inventory.length}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Buyers Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-amber-400 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Elite Clientele (Buyers)
          </h2>
          <button 
            onClick={openAddBuyer}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-500 transition-colors border border-neutral-800 hover:border-amber-500 px-3 py-1.5 rounded"
          >
            <Plus size={16} /> Add Client
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyers.map(buyer => {
            const purchased = cars.filter(c => c.buyerId === buyer.id);
            return (
              <div key={buyer.id} className="group relative bg-neutral-900 border border-neutral-800 p-6 rounded-lg hover:border-amber-500/50 transition-colors">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => openEditBuyer(buyer)}
                    className="text-neutral-600 hover:text-amber-500"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => onRemoveBuyer(buyer.id)}
                    className="text-neutral-600 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <img src={buyer.image} alt={buyer.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/20" />
                  <div>
                    <h3 className="text-lg font-medium text-white">{buyer.name}</h3>
                    <div className="text-emerald-500 text-sm">${buyer.budget.toLocaleString()} Budget</div>
                  </div>
                </div>
                <div className="text-sm text-neutral-400 space-y-2">
                   <p>Contact: <span className="text-neutral-300">{buyer.contact}</span></p>
                   <p>Interests: <span className="text-amber-200/60">{buyer.preferences.join(', ')}</span></p>
                   <div className="mt-4 pt-4 border-t border-neutral-800">
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Collection</p>
                      {purchased.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {purchased.map(c => (
                            <span key={c.id} className="text-xs bg-amber-950/30 text-amber-500 px-2 py-1 rounded border border-amber-500/20">
                              {c.make} {c.model}
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-xs italic text-neutral-600">No purchases yet</span>}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/30 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setModalConfig(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-serif text-amber-400 mb-6">
              {modalConfig.type === 'seller' 
                ? (modalConfig.mode === 'edit' ? 'Edit Partner Details' : 'New Partnership Agreement')
                : (modalConfig.mode === 'edit' ? 'Edit Client Details' : 'New Client Registration')
              }
            </h3>

            {modalConfig.type === 'seller' ? (
              <form onSubmit={submitSeller} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Company / Name</label>
                  <input required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={sellerForm.name} onChange={e => setSellerForm({...sellerForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Contact Email/Phone</label>
                  <input required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={sellerForm.contact} onChange={e => setSellerForm({...sellerForm, contact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Reputation (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={sellerForm.reputation} onChange={e => setSellerForm({...sellerForm, reputation: Number(e.target.value)})} />
                </div>
                 <div>
                  <label className="block text-xs text-neutral-400 mb-1">Image URL (Optional)</label>
                  <input className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={sellerForm.image} onChange={e => setSellerForm({...sellerForm, image: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors mt-2">
                  {modalConfig.mode === 'edit' ? 'Save Changes' : 'Add Partner'}
                </button>
              </form>
            ) : (
              <form onSubmit={submitBuyer} className="space-y-4">
                 <div>
                  <label className="block text-xs text-neutral-400 mb-1">Client Name</label>
                  <input required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={buyerForm.name} onChange={e => setBuyerForm({...buyerForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Contact Info</label>
                  <input required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={buyerForm.contact} onChange={e => setBuyerForm({...buyerForm, contact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Budget ($)</label>
                  <input type="number" required className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={buyerForm.budget} onChange={e => setBuyerForm({...buyerForm, budget: Number(e.target.value)})} />
                </div>
                 <div>
                  <label className="block text-xs text-neutral-400 mb-1">Image URL (Optional)</label>
                  <input className="w-full bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                    value={buyerForm.image} onChange={e => setBuyerForm({...buyerForm, image: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs text-neutral-400 mb-1">Preferences</label>
                   <div className="flex gap-2">
                     <input className="flex-1 bg-black border border-neutral-700 p-2 rounded text-white focus:border-amber-500 outline-none" 
                        value={prefInput} onChange={e => setPrefInput(e.target.value)} placeholder="e.g. Vintage, Porsche..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPreference())} />
                     <button type="button" onClick={addPreference} className="bg-neutral-800 text-white px-3 rounded hover:bg-neutral-700">+</button>
                   </div>
                   <div className="flex flex-wrap gap-2 mt-2">
                     {buyerForm.preferences?.map(p => (
                       <span key={p} className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
                         {p} 
                         <button type="button" onClick={() => removePreference(p)} className="hover:text-white"><X size={10}/></button>
                       </span>
                     ))}
                   </div>
                </div>
                <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors mt-2">
                  {modalConfig.mode === 'edit' ? 'Save Changes' : 'Register Client'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkList;