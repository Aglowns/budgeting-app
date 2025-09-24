import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CreditCard, 
  StickyNote, 
  PiggyBank, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Cards', href: '/transactions', icon: CreditCard },
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'Save', href: '/savings', icon: PiggyBank },
  { name: 'More', href: '/settings', icon: Settings },
];

export const Layout = () => {
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Bottom Navigation - Always visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600'
                }`}
              >
                <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                <span className="text-xs font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar - Only visible on desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">UB</span>
              </div>
              <div className="ml-3">
                <span className="block text-lg font-bold text-primary">
                  UNCP Budgeting
                </span>
                <span className="block text-xs text-gray-500 font-medium">
                  Student Finance Hub
                </span>
              </div>
            </div>
          </div>

          <nav className="mt-8 px-4 flex-1">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                      }`}
                    />
                    {item.name === 'Home' ? 'Dashboard' : 
                     item.name === 'Cards' ? 'Transactions' : 
                     item.name === 'Save' ? 'Savings' : 
                     item.name === 'More' ? 'Settings' : item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Profile */}
            {user && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex items-center px-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Sign out
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 pb-16 md:pb-0">
        {/* Mobile User Menu - Only visible on mobile when on settings page */}
        {location.pathname === '/settings' && (
          <div className="md:hidden bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};