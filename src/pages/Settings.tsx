import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  DollarSign, 
  Shield, 
  Bell, 
  Palette,
  RefreshCw,
  Save,
  Camera,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function Settings() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@uncp.edu',
    avatar: '',
  });

  const [budgets, setBudgets] = useState({
    weekly: 150,
    monthly: 600,
  });

  const [preferences, setPreferences] = useState({
    lockSavings: false,
    preventSavingsForCard: true,
    notifications: true,
    currency: 'USD',
  });

  const [categories] = useState([
    'Rent',
    'Groceries', 
    'Dining',
    'Transport',
    'School/Books',
    'Subscriptions',
    'Health',
    'Entertainment',
    'Other'
  ]);

  const [activeSection, setActiveSection] = useState('profile');

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', profile);
  };

  const handleSaveBudgets = () => {
    // In a real app, this would save to backend
    console.log('Saving budgets:', budgets);
  };

  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to reset all demo data? This cannot be undone.')) {
      // In a real app, this would reset all user data
      console.log('Resetting demo data...');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'budgets', label: 'Budgets', icon: DollarSign },
    { id: 'categories', label: 'Categories', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl p-6 border border-primary/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account, budgets, and app preferences
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="text-sm">
                <span className="text-gray-500">Account: </span>
                <span className="font-semibold text-primary">{profile.email}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Weekly Budget: </span>
                <span className="font-semibold text-primary">${budgets.weekly}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#990000] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="h-4 w-4 mr-3" />
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'profile' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-[#990000] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">UNCP Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-[#990000] hover:bg-[#800000]">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeSection === 'budgets' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="weeklyBudget">Weekly Budget</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="weeklyBudget"
                          type="number"
                          value={budgets.weekly}
                          onChange={(e) => setBudgets(prev => ({ ...prev, weekly: parseInt(e.target.value) }))}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Recommended: $100-200 for students
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="monthlyBudget">Monthly Budget</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="monthlyBudget"
                          type="number"
                          value={budgets.monthly}
                          onChange={(e) => setBudgets(prev => ({ ...prev, monthly: parseInt(e.target.value) }))}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Recommended: $400-800 for students
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleSaveBudgets} className="bg-[#990000] hover:bg-[#800000]">
                    <Save className="h-4 w-4 mr-2" />
                    Save Budget Settings
                  </Button>
                </div>
              </Card>
            )}

            {activeSection === 'categories' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending Categories</h2>
                
                <div className="space-y-4">
                  <p className="text-gray-600">
                    These are the categories used to organize your transactions.
                  </p>
                  
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <span className="font-medium">{category}</span>
                        <div className="w-4 h-4 bg-[#990000] rounded"></div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline">
                    <Palette className="h-4 w-4 mr-2" />
                    Customize Categories
                  </Button>
                </div>
              </Card>
            )}

            {activeSection === 'security' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security & Privacy</h2>
                
                <div className="space-y-6">
                  {/* Savings Lock */}
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      {preferences.lockSavings ? (
                        <Lock className="h-5 w-5 text-[#990000] mr-3" />
                      ) : (
                        <Unlock className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <div>
                        <h3 className="font-medium">Lock Savings</h3>
                        <p className="text-sm text-gray-600">
                          Prevent spending from savings account
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.lockSavings ? "default" : "outline"}
                      onClick={() => setPreferences(prev => ({ 
                        ...prev, 
                        lockSavings: !prev.lockSavings 
                      }))}
                      className={preferences.lockSavings ? "bg-[#990000] hover:bg-[#800000]" : ""}
                    >
                      {preferences.lockSavings ? 'Locked' : 'Unlocked'}
                    </Button>
                  </div>

                  {/* Card Savings Protection */}
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h3 className="font-medium">Card Savings Protection</h3>
                        <p className="text-sm text-gray-600">
                          Prevent card purchases from using savings
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={preferences.preventSavingsForCard ? "default" : "outline"}
                      onClick={() => setPreferences(prev => ({ 
                        ...prev, 
                        preventSavingsForCard: !prev.preventSavingsForCard 
                      }))}
                      className={preferences.preventSavingsForCard ? "bg-[#990000] hover:bg-[#800000]" : ""}
                    >
                      {preferences.preventSavingsForCard ? 'Protected' : 'Unprotected'}
                    </Button>
                  </div>

                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>
              </Card>
            )}

            {activeSection === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Budget Alerts</h3>
                      <p className="text-sm text-gray-600">
                        Get notified when approaching budget limits
                      </p>
                    </div>
                    <Button
                      variant={preferences.notifications ? "default" : "outline"}
                      onClick={() => setPreferences(prev => ({ 
                        ...prev, 
                        notifications: !prev.notifications 
                      }))}
                      className={preferences.notifications ? "bg-[#990000] hover:bg-[#800000]" : ""}
                    >
                      {preferences.notifications ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'data' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
                
                <div className="space-y-6">
                  <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <h3 className="font-medium text-red-800 mb-2">Reset Demo Data</h3>
                    <p className="text-sm text-red-600 mb-4">
                      This will delete all your demo transactions, notes, and goals. 
                      This action cannot be undone.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={handleResetDemoData}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset All Data
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Export Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download your transaction history and notes as CSV files.
                    </p>
                    <Button variant="outline">
                      Export Transactions
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}