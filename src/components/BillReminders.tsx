import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Plus, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Check, 
  Edit, 
  Trash2,
  Clock,
  X
} from 'lucide-react';
import { format, addDays, differenceInDays, parseISO, isAfter, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store';
import { CATEGORIES } from '@/types';
import type { Bill } from '@/types';

interface BillRemindersProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillReminders = ({ isOpen, onClose }: BillRemindersProps) => {
  const { bills, addBill, updateBill, deleteBill, markBillAsPaid } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [, setEditingBill] = useState<string | null>(null);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    category: 'Rent' as any,
    dueDate: '',
    frequency: 'monthly' as const,
    reminderDays: '3'
  });

  const upcomingBills = useMemo(() => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    
    return bills
      .filter(bill => {
        const dueDate = parseISO(bill.nextDueDate);
        return !bill.isPaid && isAfter(dueDate, today) && isBefore(dueDate, next30Days);
      })
      .sort((a, b) => parseISO(a.nextDueDate).getTime() - parseISO(b.nextDueDate).getTime());
  }, [bills]);

  const overdueBills = useMemo(() => {
    const today = new Date();
    return bills.filter(bill => {
      const dueDate = parseISO(bill.nextDueDate);
      return !bill.isPaid && isBefore(dueDate, today);
    });
  }, [bills]);

  const urgentBills = useMemo(() => {
    const today = new Date();
    return bills.filter(bill => {
      const dueDate = parseISO(bill.nextDueDate);
      const daysUntilDue = differenceInDays(dueDate, today);
      return !bill.isPaid && daysUntilDue >= 0 && daysUntilDue <= bill.reminderDays;
    });
  }, [bills]);

  const handleAddBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      const bill: Bill = {
        id: Date.now().toString(),
        name: newBill.name,
        amount: parseFloat(newBill.amount),
        category: newBill.category,
        dueDate: newBill.dueDate,
        frequency: newBill.frequency,
        isRecurring: newBill.frequency === 'monthly' || newBill.frequency === 'weekly' || newBill.frequency === 'yearly',
        reminderDays: parseInt(newBill.reminderDays),
        isPaid: false,
        nextDueDate: newBill.dueDate,
        createdAt: new Date().toISOString()
      };
      
      addBill(bill);
      setNewBill({
        name: '',
        amount: '',
        category: 'Rent',
        dueDate: '',
        frequency: 'monthly',
        reminderDays: '3'
      });
      setShowAddForm(false);
    }
  };

  const handleMarkAsPaid = (billId: string) => {
    markBillAsPaid(billId);
    const bill = bills.find(b => b.id === billId);
    if (bill && bill.isRecurring) {
      // Calculate next due date based on frequency
      const currentDue = parseISO(bill.nextDueDate);
      let nextDue: Date;
      
      switch (bill.frequency) {
        case 'weekly':
          nextDue = addDays(currentDue, 7);
          break;
        case 'monthly':
          nextDue = new Date(currentDue);
          nextDue.setMonth(nextDue.getMonth() + 1);
          break;
        case 'yearly':
          nextDue = new Date(currentDue);
          nextDue.setFullYear(nextDue.getFullYear() + 1);
          break;
        default:
          return; // one-time bills don't recur
      }
      
      updateBill(billId, { 
        isPaid: false, 
        nextDueDate: nextDue.toISOString() 
      });
    }
  };

  const getBillUrgency = (bill: Bill) => {
    const today = new Date();
    const dueDate = parseISO(bill.nextDueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= bill.reminderDays) return 'urgent';
    return 'normal';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'border-red-500 bg-red-50';
      case 'urgent': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Bill Reminders</h3>
            <p className="text-gray-600 mt-1">Never miss a payment again</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bill
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Overdue</p>
                  <p className="text-2xl font-bold text-red-900">{overdueBills.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
            
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Due Soon</p>
                  <p className="text-2xl font-bold text-yellow-900">{urgentBills.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
            
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-900">{upcomingBills.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          </div>

          {/* Add Bill Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-6 mb-6"
            >
              <h4 className="text-lg font-semibold mb-4">Add New Bill</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billName">Bill Name</Label>
                  <Input
                    id="billName"
                    value={newBill.name}
                    onChange={(e) => setNewBill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Electric Bill, Rent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="billAmount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="billAmount"
                      type="number"
                      step="0.01"
                      value={newBill.amount}
                      onChange={(e) => setNewBill(prev => ({ ...prev, amount: e.target.value }))}
                      className="pl-10"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="billCategory">Category</Label>
                  <select
                    id="billCategory"
                    value={newBill.category}
                    onChange={(e) => setNewBill(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="billDueDate">Due Date</Label>
                  <Input
                    id="billDueDate"
                    type="date"
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="billFrequency">Frequency</Label>
                  <select
                    id="billFrequency"
                    value={newBill.frequency}
                    onChange={(e) => setNewBill(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="reminderDays">Remind me (days before)</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    value={newBill.reminderDays}
                    onChange={(e) => setNewBill(prev => ({ ...prev, reminderDays: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button onClick={handleAddBill} className="bg-primary hover:bg-primary/90">
                  Add Bill
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Bills List */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">All Bills</h4>
            
            {bills.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No bills added yet. Add your first bill to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bills.map((bill) => {
                  const urgency = getBillUrgency(bill);
                  const daysUntilDue = differenceInDays(parseISO(bill.nextDueDate), new Date());
                  
                  return (
                    <motion.div
                      key={bill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-4 ${getUrgencyColor(urgency)} ${bill.isPaid ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h5 className="font-semibold text-gray-900">{bill.name}</h5>
                            <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                              {bill.category}
                            </span>
                            {bill.isRecurring && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                {bill.frequency}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${bill.amount.toFixed(2)}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(parseISO(bill.nextDueDate), 'MMM d, yyyy')}
                            </div>
                            <div className={`flex items-center font-medium ${
                              urgency === 'overdue' ? 'text-red-600' :
                              urgency === 'urgent' ? 'text-yellow-600' : 'text-gray-600'
                            }`}>
                              <Clock className="w-4 h-4 mr-1" />
                              {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                               daysUntilDue === 0 ? 'Due today' :
                               `${daysUntilDue} days left`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!bill.isPaid && (
                            <Button
                              onClick={() => handleMarkAsPaid(bill.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBill(bill.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBill(bill.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
