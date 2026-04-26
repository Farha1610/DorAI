import { useState } from 'react';
import { PickupRequest } from '../../types';
import { aiService } from '../../services/aiService';
import { MapPin, TrendingUp, Zap, Truck, Navigation, User, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminDashboard({ pickups }: { pickups: PickupRequest[] }) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const pendingPickups = pickups.filter(p => p.status === 'pending');

  const runRouteOptimization = async () => {
    setIsOptimizing(true);
    const result = await aiService.optimizeRoutes(pendingPickups);
    setAiReport(result);
    setIsOptimizing(false);
  };

  const handleAssign = async (pickupId: string) => {
      const ref = doc(db, 'pickups', pickupId);
      await updateDoc(ref, {
          status: 'scheduled',
      });
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending Requests", value: pendingPickups.length, icon: Truck, color: "blue" },
          { label: "Optimal Efficiency", value: aiReport ? `${aiReport.totalEfficiency}` : "88%", icon: Zap, color: "emerald" },
          { label: "Active Routes", value: pickups.filter(p => p.status === 'scheduled').length, icon: Navigation, color: "purple" },
          { label: "Total Recycled", value: "2.4t", icon: TrendingUp, color: "amber" }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-100 transition-all hover:scale-[1.02]">
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
            <p className="mt-1 text-2xl font-black text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-neutral-100">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Fleet Command</h2>
                        <p className="text-xs text-neutral-500 font-mono">Manage all pending collections</p>
                    </div>
                    <button 
                        onClick={runRouteOptimization}
                        disabled={isOptimizing || pendingPickups.length === 0}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-xl shadow-neutral-200"
                    >
                        <Zap className={cn("h-4 w-4", isOptimizing && "animate-pulse")} />
                        AI Route Optimization
                    </button>
                </div>

                <div className="space-y-4">
                    {pendingPickups.length === 0 ? (
                        <div className="py-20 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                           <p className="text-neutral-400 font-medium">All cleared. No pending requests.</p>
                        </div>
                    ) : (
                        pendingPickups.map(pickup => (
                            <div key={pickup.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-neutral-50 p-4 hover:border-emerald-200 transition-all bg-white relative overflow-hidden group">
                                <div className="z-10 flex gap-4 items-center">
                                    <div className="h-12 w-12 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
                                        <Truck className="h-6 w-6 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                           <h4 className="font-bold text-neutral-900 text-sm">{pickup.address}</h4>
                                           <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded italic">
                                              {pickup.category}
                                           </span>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 font-mono mt-1">{pickup.quantity} • {pickup.itemsDescription}</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6 sm:pl-4">
                                    <div className="text-right">
                                       <p className="text-[10px] font-bold text-neutral-400 uppercase">Suggested</p>
                                       <p className="text-xs font-bold text-neutral-900">{pickup.scheduledTime}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleAssign(pickup.id)}
                                        className="h-10 px-4 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        Assign Route
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* AI report sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-8">
                       <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <Zap className="h-6 w-6 text-neutral-900" />
                       </div>
                       <h3 className="font-serif italic text-2xl">Loom Intelligence</h3>
                   </div>
                   
                   {aiReport ? (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Route Summary</p>
                               <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                                   {aiReport.routeSummary}
                               </p>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                   <p className="text-3xl font-black text-emerald-400">{aiReport.totalEfficiency}</p>
                                   <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mt-1">Efficiency Gain</p>
                               </div>
                               <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                   <p className="text-3xl font-black text-blue-400">Low</p>
                                   <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60 mt-1">Carbon Impact</p>
                               </div>
                           </div>
                       </div>
                   ) : (
                       <div className="py-20 text-center space-y-6">
                           <div className="h-20 w-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                              <Navigation className="h-10 w-10 text-white/20" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-neutral-400">Awaiting Batch Input</p>
                              <p className="text-[10px] text-neutral-600 mt-2 line-clamp-2">Optimize 3+ pending requests to unlock smart clustering.</p>
                           </div>
                       </div>
                   )}
                </div>
                <div className="absolute -top-12 -right-12 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <div className="rounded-3xl bg-white p-8 border border-neutral-100 shadow-sm">
                <h4 className="text-sm font-bold text-neutral-900 uppercase mb-4 tracking-wider">Demand Prediction</h4>
                <div className="space-y-4">
                    {["Bandra East Cluster", "Sion Industrial Area"].map((zone, i) => (
                        <div key={i} className="group p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs flex items-center justify-between hover:bg-white hover:border-emerald-200 transition-all">
                            <span className="text-neutral-600 font-bold">{zone}</span>
                            <span className="text-emerald-700 font-black italic">HIGH</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
