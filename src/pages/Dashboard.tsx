import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PickupRequest } from '../types';
import DonorDashboard from '../components/Dashboard/DonorDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import DriverDashboard from '../components/Dashboard/DriverDashboard';

export default function Dashboard() {
  const { profile } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    let q;
    if (profile.role === 'admin') {
      q = query(collection(db, 'pickups'), orderBy('createdAt', 'desc'));
    } else if (profile.role === 'driver') {
      q = query(collection(db, 'pickups'), where('driverId', '==', profile.uid), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'pickups'), where('donorId', '==', profile.uid), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PickupRequest));
      setPickups(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 italic font-serif">
            Welcome back, {profile.displayName.split(' ')[0]}
          </h1>
          <p className="mt-2 text-neutral-500">
            {profile.role === 'donor' && "Your circular fashion journey continues."}
            {profile.role === 'admin' && "DOR AI Logistics Control Center."}
            {profile.role === 'driver' && "Your routes for today."}
          </p>
        </header>

        {profile.role === 'donor' && <DonorDashboard pickups={pickups} />}
        {profile.role === 'admin' && <AdminDashboard pickups={pickups} />}
        {profile.role === 'driver' && <DriverDashboard pickups={pickups} />}
      </div>
    </div>
  );
}
