export type UserRole = 'donor' | 'admin' | 'driver';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type PickupStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

export interface PickupRequest {
  id: string;
  donorId: string;
  address: string;
  itemsDescription: string;
  image?: string;
  quantity: string;
  category?: 'reusable' | 'recyclable' | 'donate';
  status: PickupStatus;
  scheduledTime?: string;
  driverId?: string;
  weight?: number;
  createdAt: string;
}

export interface ImpactData {
  userId: string;
  weightRecycled: number; // in kg
  waterSaved: number; // in liters
  co2Reduced: number; // in kg
}
