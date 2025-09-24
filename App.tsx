import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from './src/store';

// Simple icon component
const Icon = ({ name, color = '#666' }: { name: string; color?: string }) => (
  <Text style={{ color, fontSize: 24 }}>{name}</Text>
);

// Login Screen
const LoginScreen = ({ navigation }: any) => {
  const { login } = useStore();

  const handleLogin = () => {
    // Mock login - in real app you'd validate credentials
    login({
      id: '1',
      name: 'Prince Student',
      email: 'prince@bravemail.uncp.edu',
      hasLinked: true,
      settings: {
        weeklyBudget: 200,
        monthlyBudget: 800,
        lockSavings: false,
        preventSavingsForCard: false,
        currency: 'USD'
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>UB</Text>
          </View>
          <Text style={styles.title}>UNCP Budgeting</Text>
          <Text style={styles.subtitle}>Student Finance Hub</Text>
        </View>
        
        <View style={styles.form}>
          <Text style={styles.welcome}>Welcome back! 👋</Text>
          <Text style={styles.description}>
            Sign in to manage your finances like a Brave
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In (Demo)</Text>
          </TouchableOpacity>
          
          <Text style={styles.hint}>
            This is a demo version. Tap "Sign In" to explore the app!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Dashboard Screen
const DashboardScreen = () => {
  const { user, accounts, transactions, savingsGoals } = useStore();
  
  const checkingAccount = accounts.find(a => a.type === 'checking');
  const savingsAccount = accounts.find(a => a.type === 'savings');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </Text>
          <Text style={styles.subGreeting}>
            Here's your financial overview
          </Text>
        </View>

        {/* Account Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          
          {checkingAccount && (
            <View style={[styles.card, styles.accountCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🏦</Text>
                <Text style={styles.cardLabel}>Available</Text>
              </View>
              <Text style={styles.accountBalance}>
                ${checkingAccount.balance.toFixed(2)}
              </Text>
              <Text style={styles.accountName}>{checkingAccount.name}</Text>
              <Text style={styles.accountNumber}>****{checkingAccount.last4}</Text>
            </View>
          )}

          {savingsAccount && (
            <View style={[styles.card, styles.accountCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🐷</Text>
                <Text style={styles.cardLabel}>Saved</Text>
              </View>
              <Text style={[styles.accountBalance, { color: '#16a34a' }]}>
                ${savingsAccount.balance.toFixed(2)}
              </Text>
              <Text style={styles.accountName}>{savingsAccount.name}</Text>
              <Text style={styles.accountNumber}>****{savingsAccount.last4}</Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.card, styles.statCard]}>
              <Text style={styles.statIcon}>💸</Text>
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={styles.statValue}>$0.00</Text>
            </View>
            
            <View style={[styles.card, styles.statCard]}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={styles.statValue}>$800.00</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.card}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Start tracking your spending to see insights
                </Text>
              </View>
            ) : (
              transactions.slice(0, 5).map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Text>{transaction.type === 'debit' ? '↗️' : '↘️'}</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                  </View>
                  <Text style={styles.transactionAmount}>
                    {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Savings Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Goals</Text>
          <View style={styles.card}>
            {savingsGoals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.goalIcon}>🎯</Text>
                <Text style={styles.emptyStateText}>No savings goals yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Create your first goal to start saving!
                </Text>
              </View>
            ) : (
              savingsGoals.slice(0, 2).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <View key={goal.id} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalAmount}>
                        ${goal.currentAmount.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} 
                      />
                    </View>
                    <View style={styles.goalFooter}>
                      <Text style={styles.goalProgress}>{progress.toFixed(1)}% complete</Text>
                      <Text style={styles.goalTarget}>
                        Goal: ${goal.targetAmount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Simple placeholder screens
const TransactionsScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.placeholderIcon}>💳</Text>
      <Text style={styles.placeholderTitle}>Transactions</Text>
      <Text style={styles.placeholderText}>Track all your financial activity</Text>
    </View>
  </SafeAreaView>
);

const NotesScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.placeholderIcon}>📝</Text>
      <Text style={styles.placeholderTitle}>Notes</Text>
      <Text style={styles.placeholderText}>Keep track of your financial thoughts</Text>
    </View>
  </SafeAreaView>
);

const SavingsScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.placeholderIcon}>🐷</Text>
      <Text style={styles.placeholderTitle}>Savings</Text>
      <Text style={styles.placeholderText}>Manage your savings goals</Text>
    </View>
  </SafeAreaView>
);

const SettingsScreen = () => {
  const { user, logout } = useStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <View style={styles.profileItem}>
              <Text style={styles.profileIcon}>👤</Text>
              <View>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Settings</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Weekly Budget</Text>
              <Text style={styles.settingValue}>${user?.settings.weeklyBudget}</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Monthly Budget</Text>
              <Text style={styles.settingValue}>${user?.settings.monthlyBudget}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Navigation setup
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#990000',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#e5e5e5',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="🏠" color={color} />,
      }}
    />
    <Tab.Screen
      name="Cards"
      component={TransactionsScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="💳" color={color} />,
      }}
    />
    <Tab.Screen
      name="Notes"
      component={NotesScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="📝" color={color} />,
      }}
    />
    <Tab.Screen
      name="Save"
      component={SavingsScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="🐷" color={color} />,
      }}
    />
    <Tab.Screen
      name="More"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="⚙️" color={color} />,
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  const { isAuthenticated } = useStore();

  // Add some demo data when the app loads
  React.useEffect(() => {
    const { setAccounts, setTransactions } = useStore.getState();
    
    // Demo accounts
    setAccounts([
      {
        id: '1',
        name: 'UNCP Student Checking',
        type: 'checking',
        last4: '1234',
        balance: 1250.50,
      },
      {
        id: '2',
        name: 'UNCP Student Savings',
        type: 'savings',
        last4: '5678',
        balance: 500.00,
      },
    ]);

    // Demo transactions
    setTransactions([
      {
        id: '1',
        accountId: '1',
        type: 'debit',
        amount: 15.99,
        category: 'Dining',
        description: 'Campus Cafeteria',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        accountId: '1',
        type: 'debit',
        amount: 89.99,
        category: 'School/Books',
        description: 'Textbook Store',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#fff" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={TabNavigator} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#990000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#990000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#990000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  accountBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  goalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalProgress: {
    fontSize: 12,
    color: '#666',
  },
  goalTarget: {
    fontSize: 12,
    color: '#666',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLabel: {
    fontSize: 16,
    color: '#111',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#990000',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
});



