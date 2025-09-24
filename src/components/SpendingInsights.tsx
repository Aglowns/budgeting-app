import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store';
import { CATEGORIES } from '@/types';

interface SpendingInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpendingInsights = ({ isOpen, onClose }: SpendingInsightsProps) => {
  const { transactions } = useStore();

  const insights = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(t => 
      t.type === 'debit' && parseISO(t.createdAt) >= thirtyDaysAgo
    );

    // Category analysis
    const categorySpending = CATEGORIES.map(category => {
      const categoryTransactions = recentTransactions.filter(t => t.category === category);
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      const count = categoryTransactions.length;
      const avgPerTransaction = count > 0 ? total / count : 0;
      
      return {
        category,
        total,
        count,
        avgPerTransaction,
        percentage: recentTransactions.length > 0 ? (count / recentTransactions.length) * 100 : 0
      };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    // Day of week analysis
    const dayOfWeekSpending = Array.from({ length: 7 }, (_, i) => {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
      const dayTransactions = recentTransactions.filter(t => getDay(parseISO(t.createdAt)) === i);
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        day: dayName,
        dayShort: dayName.slice(0, 3),
        total,
        count: dayTransactions.length,
        avg: dayTransactions.length > 0 ? total / dayTransactions.length : 0
      };
    });

    // Weekly trend (last 4 weeks)
    const weeklyTrend = Array.from({ length: 4 }, (_, i) => {
      const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = endOfWeek(weekStart);
      const weekTransactions = recentTransactions.filter(t => {
        const date = parseISO(t.createdAt);
        return date >= weekStart && date <= weekEnd;
      });
      
      return {
        week: `Week ${4 - i}`,
        weekLabel: format(weekStart, 'MMM d'),
        total: weekTransactions.reduce((sum, t) => sum + t.amount, 0),
        count: weekTransactions.length
      };
    }).reverse();

    // Generate insights
    const totalSpent = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgDailySpend = totalSpent / 30;
    const topCategory = categorySpending[0];
    const mostExpensiveDay = dayOfWeekSpending.reduce((max, day) => day.total > max.total ? day : max);
    const leastExpensiveDay = dayOfWeekSpending.reduce((min, day) => day.total < min.total ? day : min);
    
    // Trend analysis
    const lastTwoWeeks = weeklyTrend.slice(-2);
    const spendingTrend = lastTwoWeeks.length === 2 
      ? lastTwoWeeks[1].total - lastTwoWeeks[0].total 
      : 0;

    const recommendations = [];
    
    if (topCategory && topCategory.percentage > 40) {
      recommendations.push({
        type: 'warning',
        title: `High ${topCategory.category} Spending`,
        description: `${topCategory.percentage.toFixed(1)}% of your transactions are ${topCategory.category.toLowerCase()}. Consider setting a specific budget for this category.`
      });
    }
    
    if (spendingTrend > 0) {
      recommendations.push({
        type: 'alert',
        title: 'Increasing Spending Trend',
        description: `Your spending increased by $${spendingTrend.toFixed(2)} this week. Review your recent purchases to stay on track.`
      });
    } else if (spendingTrend < -10) {
      recommendations.push({
        type: 'success',
        title: 'Great Spending Control!',
        description: `You reduced spending by $${Math.abs(spendingTrend).toFixed(2)} this week. Keep up the good work!`
      });
    }
    
    if (mostExpensiveDay.total > avgDailySpend * 2) {
      recommendations.push({
        type: 'info',
        title: `${mostExpensiveDay.day} Spending Pattern`,
        description: `You tend to spend more on ${mostExpensiveDay.day}s ($${mostExpensiveDay.avg.toFixed(2)} avg). Plan ahead to avoid overspending.`
      });
    }

    return {
      totalSpent,
      avgDailySpend,
      topCategory,
      mostExpensiveDay,
      leastExpensiveDay,
      categorySpending,
      dayOfWeekSpending,
      weeklyTrend,
      spendingTrend,
      recommendations,
      transactionCount: recentTransactions.length
    };
  }, [transactions]);

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
        className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-primary" />
              Spending Insights
            </h3>
            <p className="text-gray-600 mt-1">Your financial patterns over the last 30 days</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${insights.totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Average</p>
                  <p className="text-2xl font-bold text-gray-900">${insights.avgDailySpend.toFixed(2)}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.transactionCount}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Category</p>
                  <p className="text-lg font-bold text-gray-900">
                    {insights.topCategory?.category || 'N/A'}
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">💡 Personalized Insights</h4>
              <div className="grid gap-4">
                {insights.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      rec.type === 'success' ? 'border-green-200 bg-green-50' :
                      rec.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      rec.type === 'alert' ? 'border-red-200 bg-red-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {rec.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                      {rec.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                      {rec.type === 'alert' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                      {rec.type === 'info' && <Clock className="w-5 h-5 text-blue-600 mt-0.5" />}
                      <div>
                        <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Spending */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.categorySpending.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Bar dataKey="total" fill="#990000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Weekly Spending Trend
                  {insights.spendingTrend > 0 ? (
                    <TrendingUp className="w-4 h-4 ml-2 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 ml-2 text-green-600" />
                  )}
                </CardTitle>
                <CardDescription>Last 4 weeks comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={insights.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="weekLabel" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Area type="monotone" dataKey="total" stroke="#FFCC00" fill="#FFCC00" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Day of Week Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Day of Week</CardTitle>
                <CardDescription>Your weekly spending pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.dayOfWeekSpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dayShort" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Bar dataKey="total" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Frequency */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Frequency</CardTitle>
                <CardDescription>How often you spend by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.categorySpending.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, 'Transactions']} />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
