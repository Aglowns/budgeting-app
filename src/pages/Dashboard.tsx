import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell,
  BarChart3,
  Plus
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { BillReminders } from '@/components/BillReminders';
import { SpendingInsights } from '@/components/SpendingInsights';

export const Dashboard = () => {
  const { user, accounts, transactions, notes, savingsGoals } = useStore();
  const navigate = useNavigate();
  const [showBillReminders, setShowBillReminders] = useState(false);
  const [showSpendingInsights, setShowSpendingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // Track active tab (1-4)

  // Debug logging
  console.log('Dashboard render:', { user, accounts, transactions, notes, savingsGoals });

  // Early return if critical data is missing
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  const stats = useMemo(() => {
    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const monthlyBudget = user?.settings?.monthlyBudget || 0;

      const monthlyTransactions = (transactions || []).filter(t => {
        if (!t || !t.createdAt) return false;
        const date = parseISO(t.createdAt);
        return date >= monthStart && date <= monthEnd && t.type === 'debit';
      });

      const monthlySpend = monthlyTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

      return {
        monthlySpend,
        monthlyRemaining: monthlyBudget - monthlySpend,
        monthlyBudget,
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        monthlySpend: 0,
        monthlyRemaining: 0,
        monthlyBudget: 0,
      };
    }
  }, [transactions, user]);

  const recentTransactions = (transactions || []).slice(0, 5);
  const checkingAccount = (accounts || []).find(a => a && a.type === 'checking');
  const savingsAccount = (accounts || []).find(a => a && a.type === 'savings');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Hello, {user?.name && typeof user.name === 'string' ? user.name.split(' ')[0] : 'Student'} 👋
              </h1>
              <p className="text-gray-600">
                Here's your financial overview
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowSpendingInsights(true)}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </Button>
              <Button
                onClick={() => setShowBillReminders(true)}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="hidden md:flex items-center space-x-4 mb-8">
            <button 
              onClick={() => setActiveTab(1)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeTab === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeTab === 1 ? 'text-gray-900' : 'text-gray-500'
              }`}>Accounts</span>
            </button>
            <div className="flex-1 h-px bg-gray-200"></div>
            <button 
              onClick={() => setActiveTab(2)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeTab === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeTab === 2 ? 'text-gray-900' : 'text-gray-500'
              }`}>Activity</span>
            </button>
            <div className="flex-1 h-px bg-gray-200"></div>
            <button 
              onClick={() => setActiveTab(3)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeTab === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeTab === 3 ? 'text-gray-900' : 'text-gray-500'
              }`}>Goals</span>
            </button>
            <div className="flex-1 h-px bg-gray-200"></div>
            <button 
              onClick={() => setActiveTab(4)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeTab === 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                4
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeTab === 4 ? 'text-gray-900' : 'text-gray-500'
              }`}>Insights</span>
            </button>
          </div>
          
          {/* Mobile Step Indicators */}
          <div className="flex md:hidden justify-center space-x-2 mb-8">
            <button 
              onClick={() => setActiveTab(1)}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                activeTab === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              1
            </button>
            <button 
              onClick={() => setActiveTab(2)}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                activeTab === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              2
            </button>
            <button 
              onClick={() => setActiveTab(3)}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                activeTab === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </button>
            <button 
              onClick={() => setActiveTab(4)}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                activeTab === 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              4
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Tab 1: Accounts */}
          {activeTab === 1 && (
            <>
              {/* Account Cards */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {checkingAccount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏦</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Available</p>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    ${checkingAccount.balance.toFixed(2)}
                  </p>
                  <p className="text-gray-600 font-medium">{checkingAccount.name}</p>
                  <p className="text-sm text-gray-500">****{checkingAccount.last4}</p>
                </div>
              </motion.div>
            )}
            
            {savingsAccount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🐷</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Saved</p>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    ${savingsAccount.balance.toFixed(2)}
                  </p>
                  <p className="text-gray-600 font-medium">{savingsAccount.name}</p>
                  <p className="text-sm text-gray-500">****{savingsAccount.last4}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
            <p className="text-sm text-gray-500">{format(new Date(), 'MMMM yyyy')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="text-xl font-bold text-gray-900">${stats.monthlySpend.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className={`text-xl font-bold ${stats.monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(stats.monthlyRemaining).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
            <Button 
              onClick={() => navigate('/transactions')}
              variant="ghost"
              size="sm"
              className="text-primary"
            >
              See all
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {recentTransactions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No recent transactions</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'debit' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {transaction.type === 'debit' ? (
                          <span className="text-lg">↗️</span>
                        ) : (
                          <span className="text-lg">↘️</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category} • {format(parseISO(transaction.createdAt), 'MMM d')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'debit' ? 'text-gray-900' : 'text-green-600'
                      }`}>
                        {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
            <Button 
              onClick={() => navigate('/savings')}
              variant="ghost"
              size="sm"
              className="text-primary"
            >
              See all
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            {(savingsGoals || []).length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-gray-500 mb-4">No savings goals yet</p>
                <Button 
                  onClick={() => navigate('/savings')}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {(savingsGoals || []).slice(0, 2).map((goal, index) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{goal.name}</p>
                        <p className="text-sm font-semibold text-green-600">
                          ${goal.currentAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{progress.toFixed(1)}% complete</span>
                        <span>Goal: ${goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Notes */}
        {(notes || []).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
              <Button 
                onClick={() => navigate('/notes')}
                variant="ghost"
                size="sm"
                className="text-primary"
              >
                See all
              </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-3">
                {(notes || []).slice(0, 2).map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{note.title}</p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(note.createdAt), 'MMM d')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
            </>
          )}

          {/* Tab 2: Activity */}
          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                
                {/* Monthly Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">This Month</p>
                        <p className="text-xl font-bold text-gray-900">${stats.monthlySpend.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className={`text-xl font-bold ${stats.monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(stats.monthlyRemaining).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
                    <Button 
                      onClick={() => navigate('/transactions')}
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                    >
                      View All
                    </Button>
                  </div>
                  
                  {transactions.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                      {transactions.slice(0, 10).map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'debit' ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                              {transaction.type === 'debit' ? (
                                <span className="text-lg">↗️</span>
                              ) : (
                                <span className="text-lg">↘️</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.category} • {format(parseISO(transaction.createdAt), 'MMM d, yyyy')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'debit' ? 'text-gray-900' : 'text-green-600'
                            }`}>
                              {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Goals */}
          {activeTab === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Savings Goals</h2>
                  <Button 
                    onClick={() => navigate('/savings')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Goal
                  </Button>
                </div>
                
                {savingsGoals.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No savings goals yet</h3>
                    <p className="text-gray-600 mb-6">Start planning for your future by setting your first savings goal</p>
                    <Button 
                      onClick={() => navigate('/savings')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Goal
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savingsGoals.map((goal, index) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                                <p className="text-sm text-gray-500">Target: {goal.deadline ? format(parseISO(goal.deadline), 'MMM yyyy') : 'No deadline'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Progress</span>
                              <span className="text-sm font-semibold text-green-600">{progress.toFixed(1)}%</span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Current</span>
                              <span className="text-sm text-gray-500">Target</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">
                                ${goal.currentAmount.toLocaleString()}
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                ${goal.targetAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 4: Insights */}
          {activeTab === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Financial Insights</h2>
                  <Button 
                    onClick={() => setShowSpendingInsights(true)}
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
                
                {/* Budget Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">💰</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Monthly Budget</h3>
                        <p className="text-sm text-gray-500">Your spending limit</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ${stats.monthlyBudget.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">📊</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Spent This Month</h3>
                        <p className="text-sm text-gray-500">Total expenses</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      ${stats.monthlySpend.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Budget Health</h3>
                        <p className="text-sm text-gray-500">How you're doing</p>
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${
                      stats.monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.monthlyRemaining >= 0 ? '✅ Good' : '⚠️ Over'}
                    </p>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Smart Tips</h3>
                  <div className="space-y-3">
                    {stats.monthlyRemaining < 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Budget Alert:</strong> You've exceeded your monthly budget by ${Math.abs(stats.monthlyRemaining).toFixed(2)}. Consider reviewing your spending habits.
                        </p>
                      </div>
                    )}
                    
                    {savingsGoals.length === 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Savings Tip:</strong> Set up a savings goal to start building your emergency fund or save for something special!
                        </p>
                      </div>
                    )}
                    
                    {transactions.length < 5 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Get Started:</strong> Track your spending by adding more transactions to get better insights into your financial habits.
                        </p>
                      </div>
                    )}
                    
                    {stats.monthlyRemaining > stats.monthlyBudget * 0.5 && stats.monthlyBudget > 0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Great Job:</strong> You're doing well with your budget! Consider putting some of your remaining budget into savings.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Notes for Insights */}
                {notes.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">📝 Your Financial Notes</h3>
                      <Button 
                        onClick={() => navigate('/notes')}
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {notes.slice(0, 3).map((note) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900">{note.title}</p>
                            <p className="text-xs text-gray-500">
                              {format(parseISO(note.createdAt), 'MMM d')}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BillReminders
        isOpen={showBillReminders}
        onClose={() => setShowBillReminders(false)}
      />

      <SpendingInsights
        isOpen={showSpendingInsights}
        onClose={() => setShowSpendingInsights(false)}
      />
    </div>
  );
};