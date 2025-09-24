import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Download, Edit, Trash2, Camera } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store';
import { CATEGORIES } from '@/types';
import { ReceiptScanner } from '@/components/ReceiptScanner';

export const Transactions = () => {
  const { transactions, accounts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
      const matchesAccount = !selectedAccount || transaction.accountId === selectedAccount;
      
      return matchesSearch && matchesCategory && matchesAccount;
    });
  }, [transactions, searchTerm, selectedCategory, selectedAccount]);

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? `${account.name} ****${account.last4}` : 'Unknown Account';
  };

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
            <h1 className="text-3xl font-bold gradient-text">Transactions</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your financial activity
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="text-sm">
                <span className="text-gray-500">Total Transactions: </span>
                <span className="font-semibold text-primary">{transactions.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">This Month: </span>
                <span className="font-semibold text-primary">{transactions.filter(t => {
                  const date = parseISO(t.createdAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => setShowReceiptScanner(true)}
              className="bg-secondary hover:bg-secondary/90 text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              Scan Receipt
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">All Accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ****{account.last4}
                </option>
              ))}
            </select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Account</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(parseISO(transaction.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-gray-500">{transaction.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getAccountName(transaction.accountId)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-medium ${
                        transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Scanner */}
      <ReceiptScanner
        isOpen={showReceiptScanner}
        onClose={() => setShowReceiptScanner(false)}
      />
    </div>
  );
};
