import { PickupRequest } from '../../types';
import { MapPin, Navigation, CheckCircle2, Phone, MessageSquare, Map as MapIcon, List as ListIcon, Sparkles } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import RouteMap from './RouteMap';
import React, { useState } from 'react';

export default function DriverDashboard({ pickups }: { pickups: PickupRequest[] }) {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [routeInsight, setRouteInsight] = useState<string>('Analyzing your route for peak efficiency...');
  const activePickups = pickups.filter(p => p.status === 'scheduled');
  
  React.useEffect(() => {
    if (activePickups.length > 0) {
      // Mocking the AI reasoning for the current set of pickups
      const insights = [
        "Clustered pickup locations to minimize fuel consumption by 15%.",
        "Sequence optimized based on current traffic patterns and priority items.",
        "Northern cluster grouped first to avoid residential school zone peak times.",
        "Directional routing chosen to ensure all right-hand turns for safety and speed."
      ];
      setRouteInsight(insights[Math.floor(Math.random() * insights.length)]);
    }
  }, [activePickups.length]);

  const handleComplete = async (pickupId: string) => {
    const ref = doc(db, 'pickups', pickupId);
    await updateDoc(ref, {
      status: 'completed'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="rounded-3xl bg-white shadow-sm border border-neutral-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Today's Optimized Route</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-neutral-500 uppercase tracking-widest font-mono">
                {activePickups.length} {activePickups.length === 1 ? 'stop' : 'stops'} remaining
              </p>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Navigation className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-tighter">AI Optimized</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-neutral-100 p-1 rounded-2xl">
            <button 
              onClick={() => setView('list')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                view === 'list' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <ListIcon className="h-4 w-4" /> List
            </button>
            <button 
              onClick={() => setView('map')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                view === 'map' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <MapIcon className="h-4 w-4" /> Map
            </button>
          </div>
        </div>

        {/* AI Strategy Bar */}
        {activePickups.length > 0 && (
          <div className="bg-emerald-50/30 border-b border-neutral-100 p-4 px-8 flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
               <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI Route Strategy</p>
               <p className="text-sm text-neutral-700 font-medium italic">"{routeInsight}"</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-8">
          {activePickups.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
               <Navigation className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
               <p className="text-neutral-500 font-medium">No pickups assigned for this route.</p>
            </div>
          ) : view === 'map' ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <RouteMap pickups={activePickups} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePickups.map((pickup, idx) => (
                  <div key={pickup.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm truncate">{pickup.address}</h4>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">{pickup.itemsDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {activePickups.map((pickup, idx) => (
                <div key={pickup.id} className="relative pl-8 pb-8 last:pb-0">
                  {/* Timeline line */}
                  {idx !== activePickups.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-neutral-100" />
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-white bg-neutral-900 shadow-sm z-10 flex items-center justify-center text-[10px] text-white font-bold">
                      {idx + 1}
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 group hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/20 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-neutral-400 mt-1" />
                          <div>
                            <h4 className="font-bold text-neutral-900 text-lg leading-tight">{pickup.address}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-neutral-500 font-mono">EST: 10-15 MIN</span>
                              <span className="h-1 w-1 rounded-full bg-neutral-300" />
                              <span className="text-xs text-neutral-500 font-mono">2.4 KM</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-neutral-100 mt-4 flex justify-between items-center gap-4">
                          <div>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Items</p>
                            <p className="text-sm text-neutral-700">{pickup.itemsDescription}</p>
                          </div>
                          {pickup.image && (
                            <img src={pickup.image} alt="Package" className="h-16 w-16 object-cover rounded-lg border border-neutral-100 shadow-sm" />
                          )}
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                          <button className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-4 py-2.5 rounded-xl bg-white shadow-sm transition-colors">
                             <Phone className="h-3 w-3" /> Call
                          </button>
                          <button className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-4 py-2.5 rounded-xl bg-white shadow-sm transition-colors">
                             <MessageSquare className="h-3 w-3" /> Chat
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleComplete(pickup.id)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-5 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transition-all active:scale-95 group-hover:px-10"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Complete Stop
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
