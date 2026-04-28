import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PickupRequest } from '../../types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { aiService } from '../../services/aiService';
import { MapPin, Package, Clock, CheckCircle2, Sparkles, Tag, Navigation } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DonorDashboard({ pickups }: { pickups: PickupRequest[] }) {
  const { profile } = useAuth();
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Feature: AI Category Classification
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (description.length > 5) {
        setIsClassifying(true);
        const result = await aiService.classifyClothing(description);
        setCategory(result);
        setIsClassifying(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [description]);

  // Feature: Smart Pickup Scheduling - Suggest slots when address/quantity provided
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (address.length > 5 && quantity) {
        const result = await aiService.suggestPickupSlot(address, quantity);
        setSlots(result.slots || []);
        // Reset selected slot if options change
        setSelectedSlot(null);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address, quantity]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedSlot) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'pickups'), {
        donorId: profile.uid,
        address,
        itemsDescription: description,
        image: imagePreview || null,
        quantity,
        category: category?.category || 'donate',
        status: 'pending',
        scheduledTime: selectedSlot.time,
        createdAt: new Date().toISOString(),
      });
      setAddress('');
      setDescription('');
      setQuantity('');
      setCategory(null);
      setSlots([]);
      setSelectedSlot(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Schedule Form */}
      <div className="lg:col-span-1">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900 border-b pb-4 mb-6 uppercase tracking-tight">New Collection</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                1. Pickup Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Zip"
                  className="w-full rounded-2xl border border-neutral-200 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                     2. Quantity
                  </label>
                  <select 
                     required
                     value={quantity}
                     onChange={(e) => setQuantity(e.target.value)}
                     className="w-full rounded-2xl border border-neutral-200 py-3 px-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium bg-white"
                  >
                     <option value="">Select...</option>
                     <option value="Small Bag">Small Bag</option>
                     <option value="Medium Box">Medium Box</option>
                     <option value="Large Bin">Large Bin</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                     3. AI Category
                  </label>
                  <div className="flex h-[46px] items-center px-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm font-bold text-neutral-600 truncate">
                     {isClassifying ? (
                        <Sparkles className="h-4 w-4 animate-pulse mr-2 text-emerald-500" />
                     ) : (
                        <Tag className="h-4 w-4 mr-2 text-emerald-500" />
                     )}
                     {category ? category.category.toUpperCase() : "Analyzing..."}
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                4. Items & Photo
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your items..."
                rows={2}
                className="w-full rounded-2xl border border-neutral-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none font-medium mb-3"
              />
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center justify-center border-2 border-dashed border-neutral-100 rounded-2xl p-4 group-hover:border-emerald-500 transition-all bg-neutral-50/50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg shadow-sm" />
                  ) : (
                    <div className="text-center">
                      <p className="text-xs font-bold text-neutral-400 uppercase">Upload Image</p>
                      <p className="text-[10px] text-neutral-300 mt-1">(Support sorting AI)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
               <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  5. Smart Slot Selection
               </label>
               <div className="space-y-2">
                  {slots.length > 0 ? (
                     slots.map((slot, i) => (
                        <button
                           key={i}
                           type="button"
                           onClick={() => setSelectedSlot(slot)}
                           className={cn(
                              "w-full text-left p-3 rounded-2xl border transition-all text-sm group",
                              selectedSlot?.time === slot.time 
                                 ? "bg-emerald-600 border-emerald-600 text-white" 
                                 : "border-neutral-100 bg-neutral-50 hover:border-emerald-200"
                           )}
                        >
                           <p className="font-bold">{slot.time}</p>
                           <p className={cn("text-[10px] mt-1 line-clamp-1", selectedSlot?.time === slot.time ? "text-emerald-100" : "text-neutral-500")}>
                               {slot.reason}
                           </p>
                        </button>
                     ))
                  ) : (
                     <p className="text-xs text-neutral-400 italic py-2">Fill steps 1 & 2 for suggestions...</p>
                  )}
               </div>
            </div>

            {selectedSlot && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-blue-50 border border-blue-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="h-3 w-3 text-blue-600" />
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Route Insight</p>
                </div>
                <p className="text-xs font-medium text-blue-800 leading-relaxed italic">
                  "{selectedSlot.reason}"
                </p>
              </motion.div>
            )}

            <button
              disabled={isSubmitting || !selectedSlot}
              className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white shadow-xl hover:bg-neutral-800 disabled:opacity-50 transition-all active:scale-95"
            >
              {isSubmitting ? "Syncing with AI..." : "Confirm Smart Pickup"}
            </button>
          </form>
        </div>
      </div>

      {/* Pickup History */}
      <div className="lg:col-span-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-neutral-100">
           <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Your Contributions</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total: {pickups.length}</span>
           </div>
          
          <div className="space-y-4">
            {pickups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-neutral-200 mb-4" />
                <p className="text-neutral-500">No pickups yet. Start your circular journey!</p>
              </div>
            ) : (
              pickups.map((pickup) => (
                <div
                  key={pickup.id}
                  className="group flex flex-col gap-4 items-start md:flex-row md:items-center justify-between rounded-2xl border border-neutral-50 p-4 hover:bg-neutral-50 transition-all"
                >
                  <div className="flex gap-4 items-center">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      pickup.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                      pickup.status === 'scheduled' ? "bg-blue-50 text-blue-600" :
                      "bg-amber-50 text-amber-600"
                    )}>
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-neutral-900">{pickup.address}</h4>
                        <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-500 uppercase">{pickup.category}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{pickup.scheduledTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                    <span className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                      pickup.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                      pickup.status === 'scheduled' ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {pickup.status}
                    </span>
                    <button className="text-neutral-300 hover:text-neutral-900 transition-colors">
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
