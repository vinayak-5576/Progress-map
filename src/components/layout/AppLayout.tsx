import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { PictureInPictureManager } from '../timer/PictureInPictureManager';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout: React.FC = () => {
  const { init, isLoading } = useAppStore();

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-cream-100 text-navy-900 dark:bg-navy-950 dark:text-cream-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-coral-200 border-t-coral-500"></div>
          <p className="font-serif text-lg font-medium text-navy-800 dark:text-cream-200">
            Loading your preparation engine...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-navy-900 dark:bg-navy-950 dark:text-cream-100 transition-colors duration-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:py-8 lg:px-8 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <PictureInPictureManager />
      <MobileNav />
    </div>
  );
};
