import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
//import { Menu as MenuIcon } from 'lucide-react';

function Home() {
  const [activeTab, setActiveTab] = useState('board');

  const tabs = [
    { id: 'board', label: 'Board', icon: 'layout-dashboard' },
    { id: 'list', label: 'List View', icon: 'list' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  ];

  // Initialize icons as React components
  const LogoIcon = getIcon('check-circle');
  const MenuIcon = getIcon('menu');
  //<MenuIcon className="h-6 w-6" />
  const UserIcon = getIcon('user');
  
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-primary">TaskFlow</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                aria-label="Open menu"
              >
                <MenuIcon className="h-6 w-6 text-surface-600 dark:text-surface-300" />
              </button>
              
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-100">My Tasks</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">
            Manage and organize your tasks efficiently
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-surface-200 dark:border-surface-700">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const TabIcon = getIcon(tab.icon);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary text-primary dark:text-primary-light'
                      : 'border-transparent text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }
                  `}
                >
                  <TabIcon className="mr-2 h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Main Feature Component */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <MainFeature activeTab={activeTab} />
        </motion.div>
      </main>
    </div>
  );
}

export default Home;