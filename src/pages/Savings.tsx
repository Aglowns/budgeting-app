import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Vault, 
  Lock, 
  Unlock, 
  Plus, 
  Target, 
  Calendar,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
}

export function Savings() {
  const [savingsBalance, setSavingsBalance] = useState(2850.00);
  const [lockSavings, setLockSavings] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [allocateAmount, setAllocateAmount] = useState('');
  const [selectedGoalForAllocation, setSelectedGoalForAllocation] = useState('');

  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2850,
      priority: 'high',
    },
    {
      id: '2',
      name: 'Spring Break Trip',
      targetAmount: 1200,
      currentAmount: 450,
      deadline: '2024-03-15',
      priority: 'medium',
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 1500,
      currentAmount: 300,
      deadline: '2024-08-01',
      priority: 'low',
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    priority: 'medium' as const,
  });

  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalProgress = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleAddGoal = () => {
    if (!newGoal.name.trim() || !newGoal.targetAmount) return;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline || undefined,
      priority: newGoal.priority,
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', targetAmount: '', deadline: '', priority: 'medium' });
    setShowAddGoal(false);
  };

  const handleTransferToSavings = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0) {
      setSavingsBalance(prev => prev + amount);
      setTransferAmount('');
      setShowTransferModal(false);
      // In a real app, this would also deduct from checking account
    }
  };

  const handleAllocateToGoal = () => {
    const amount = parseFloat(allocateAmount);
    if (amount > 0 && selectedGoalForAllocation && amount <= savingsBalance) {
      setGoals(prev => prev.map(goal => 
        goal.id === selectedGoalForAllocation 
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      ));
      setSavingsBalance(prev => prev - amount);
      setAllocateAmount('');
      setSelectedGoalForAllocation('');
      setShowAllocateModal(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-[#FFCC00]';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Savings</h1>
        <Button
          onClick={() => setShowAddGoal(true)}
          className="bg-[#990000] hover:bg-[#800000] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Savings Insights Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#990000] to-[#FFCC00] rounded-xl p-6 text-white"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold mb-2">💰 Total Savings</h2>
            <p className="text-3xl font-bold">${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm opacity-90">Available for allocation</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">🎯 Goals Progress</h2>
            <p className="text-3xl font-bold">{goals.length}</p>
            <p className="text-sm opacity-90">Active savings goals</p>
          </div>
          <div className="text-center md:text-right">
            <h2 className="text-lg font-semibold mb-2">📈 This Month</h2>
            <p className="text-3xl font-bold">+$425</p>
            <p className="text-sm opacity-90">Saved this month</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-sm">
            <strong>💡 Savings Tip:</strong> You're {((totalGoalProgress / totalGoalTarget) * 100).toFixed(1)}% towards your total goals! 
            Consider setting up automatic transfers to reach your targets faster.
          </p>
        </div>
      </motion.div>

      {/* Savings Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Savings Balance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Vault className="h-8 w-8 text-[#990000] mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Savings Vault</h3>
                <p className="text-sm text-gray-600">Total Balance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLockSavings(!lockSavings)}
              className={`${lockSavings ? 'text-[#990000]' : 'text-gray-400'}`}
            >
              {lockSavings ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-[#990000]">
              ${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${lockSavings ? 'text-[#990000]' : 'text-gray-600'}`}>
                {lockSavings ? 'Locked' : 'Unlocked'}
              </span>
              {lockSavings && (
                <span className="ml-2 text-xs text-gray-500">
                  Spending from savings disabled
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Goals Progress */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Target className="h-8 w-8 text-[#FFCC00] mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Goals Progress</h3>
              <p className="text-sm text-gray-600">All active goals</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">
              ${totalGoalProgress.toLocaleString()} / ${totalGoalTarget.toLocaleString()}
            </p>
            <Progress 
              value={(totalGoalProgress / totalGoalTarget) * 100} 
              className="h-2"
            />
            <p className="text-sm text-gray-600">
              {((totalGoalProgress / totalGoalTarget) * 100).toFixed(1)}% complete
            </p>
          </div>
        </Card>

        {/* Quick Transfer */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <ArrowUpRight className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Move money</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => setShowTransferModal(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Transfer to Savings
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAllocateModal(true)}
            >
              Allocate to Goal
            </Button>
          </div>
        </Card>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Add New Savings Goal</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Emergency fund, vacation, etc."
              />
            </div>
            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={newGoal.priority}
                onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#990000] focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddGoal} className="bg-[#990000] hover:bg-[#800000]">
              Add Goal
            </Button>
            <Button variant="outline" onClick={() => setShowAddGoal(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Goals List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Savings Goals</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)} text-white`}>
                        {goal.priority}
                      </span>
                      {goal.deadline && (
                        <div className="flex items-center ml-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  
                  <Progress 
                    value={(goal.currentAmount / goal.targetAmount) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${getPriorityTextColor(goal.priority)}`}>
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete
                    </span>
                    <span className="text-gray-500">
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => setShowTransferModal(true)}
                >
                  Add Money
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No savings goals yet. Add one to get started!</p>
        </div>
      )}

      {/* Transfer to Savings Modal */}
      {showTransferModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowTransferModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Transfer to Savings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Move money from your checking account to your savings vault.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="transferAmount">Amount to Transfer</Label>
                <Input
                  id="transferAmount"
                  type="number"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleTransferToSavings}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                >
                  Transfer ${transferAmount || '0.00'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Allocate to Goal Modal */}
      {showAllocateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAllocateModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Allocate to Goal</h3>
            <p className="text-sm text-gray-600 mb-4">
              Allocate money from your savings vault to a specific goal. Available: ${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalSelect">Select Goal</Label>
                <select
                  id="goalSelect"
                  value={selectedGoalForAllocation}
                  onChange={(e) => setSelectedGoalForAllocation(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#990000]"
                >
                  <option value="">Choose a goal...</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name} (${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="allocateAmount">Amount to Allocate</Label>
                <Input
                  id="allocateAmount"
                  type="number"
                  placeholder="0.00"
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(e.target.value)}
                  max={savingsBalance}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleAllocateToGoal}
                  className="flex-1 bg-[#990000] hover:bg-[#800000]"
                  disabled={!allocateAmount || !selectedGoalForAllocation || parseFloat(allocateAmount) <= 0 || parseFloat(allocateAmount) > savingsBalance}
                >
                  Allocate ${allocateAmount || '0.00'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}