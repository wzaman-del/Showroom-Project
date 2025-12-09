import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Car, CarStatus } from '../types';

interface DashboardProps {
  cars: Car[];
}

const Dashboard: React.FC<DashboardProps> = ({ cars }) => {
  const soldCars = cars.filter(c => c.status === CarStatus.SOLD);
  const totalRevenue = soldCars.reduce((acc, car) => acc + car.price, 0);
  const activeInventoryValue = cars.filter(c => c.status === CarStatus.AVAILABLE).reduce((acc, car) => acc + car.price, 0);

  // Data for Charts
  const makeData = cars.reduce((acc: any, car) => {
    const existing = acc.find((i: any) => i.name === car.make);
    if (existing) {
      existing.count += 1;
      existing.value += car.price;
    } else {
      acc.push({ name: car.make, count: 1, value: car.price });
    }
    return acc;
  }, []);

  const statusData = [
    { name: 'Available', value: cars.filter(c => c.status === CarStatus.AVAILABLE).length },
    { name: 'Sold', value: cars.filter(c => c.status === CarStatus.SOLD).length },
    { name: 'Reserved', value: cars.filter(c => c.status === CarStatus.RESERVED).length },
  ];

  const COLORS = ['#D4AF37', '#525252', '#8c7326']; // Gold, Grey, Dark Gold

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-amber-500/20 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-xl transition-all group-hover:bg-amber-500/20"></div>
          <h3 className="text-neutral-400 text-sm font-medium tracking-widest uppercase">Total Revenue</h3>
          <p className="text-3xl font-serif text-amber-400 mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-amber-500/20 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-xl transition-all group-hover:bg-amber-500/20"></div>
          <h3 className="text-neutral-400 text-sm font-medium tracking-widest uppercase">Inventory Value</h3>
          <p className="text-3xl font-serif text-white mt-2">${activeInventoryValue.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-amber-500/20 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-xl transition-all group-hover:bg-amber-500/20"></div>
          <h3 className="text-neutral-400 text-sm font-medium tracking-widest uppercase">Total Vehicles</h3>
          <p className="text-3xl font-serif text-white mt-2">{cars.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900/50 border border-amber-500/10 p-6 rounded-lg">
          <h3 className="text-amber-100 text-lg mb-6 font-serif">Portfolio Composition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={makeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888' }} />
                <YAxis stroke="#666" tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#D4AF37', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]}>
                  {makeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D4AF37' : '#B8860B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-amber-500/10 p-6 rounded-lg">
          <h3 className="text-amber-100 text-lg mb-6 font-serif">Inventory Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#D4AF37', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;