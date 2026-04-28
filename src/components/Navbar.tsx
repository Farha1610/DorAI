import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Recycle, LogIn, LogOut, LayoutDashboard, ChevronDown, Shield, Truck, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Navbar() {
  const { user, profile, signInWithGoogle, signOut, error } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleRoleChange = async (newRole: 'donor' | 'admin' | 'driver') => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: newRole
      });
      setIsDropdownOpen(false);
      // Wait a moment for Firestore listener to sync
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      {error && (
        <div className="bg-red-50 py-2 px-4 text-center text-xs font-medium text-red-600 border-b border-red-100">
          {error}
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-emerald-600" />
          <span className="font-serif text-2xl font-semibold tracking-tight italic">DOR AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Role Switcher Debug Menu */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-white transition-all shadow-sm"
                >
                  <span className="opacity-50">Role:</span>
                  <span className="capitalize text-neutral-900">{profile?.role || '...'}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-[60]">
                    <button 
                      onClick={() => handleRoleChange('donor')}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Heart className="h-4 w-4" /> Donor View
                    </button>
                    <button 
                      onClick={() => handleRoleChange('driver')}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Truck className="h-4 w-4" /> Driver View
                    </button>
                    <button 
                      onClick={() => handleRoleChange('admin')}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Shield className="h-4 w-4" /> Admin View
                    </button>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-neutral-100 mx-1" />

              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition-all active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
