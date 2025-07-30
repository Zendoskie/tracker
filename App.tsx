import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

// Store
import { store, useAppDispatch, useAppSelector } from './src/store';
import { loadStoredAuth } from './src/store/slices/authSlice';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
// import RegisterScreen from './src/screens/auth/RegisterScreen';
// import StudentDashboard from './src/screens/student/StudentDashboard';
// import ParentDashboard from './src/screens/parent/ParentDashboard';
// import InstructorDashboard from './src/screens/instructor/InstructorDashboard';

// Theme
import { colors, typography } from './src/utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary placeholder screens
const PlaceholderScreen = ({ title }: { title: string }) => (
  <LinearGradient colors={colors.gradient.dark} style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>{title}</Text>
    <Text style={styles.placeholderSubtext}>Coming soon...</Text>
  </LinearGradient>
);

// Student Tab Navigator
const StudentTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.surfaceVariant,
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.onSurfaceVariant,
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={() => <PlaceholderScreen title="Student Dashboard" />}
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="QRScanner" 
      component={() => <PlaceholderScreen title="QR Scanner" />}
      options={{ title: 'Scan' }}
    />
    <Tab.Screen 
      name="Grades" 
      component={() => <PlaceholderScreen title="Grades" />}
    />
    <Tab.Screen 
      name="Assignments" 
      component={() => <PlaceholderScreen title="Assignments" />}
    />
  </Tab.Navigator>
);

// Parent Tab Navigator
const ParentTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.surfaceVariant,
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      tabBarActiveTintColor: colors.warning,
      tabBarInactiveTintColor: colors.onSurfaceVariant,
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={() => <PlaceholderScreen title="Parent Dashboard" />}
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="Children" 
      component={() => <PlaceholderScreen title="Children Performance" />}
    />
    <Tab.Screen 
      name="Attendance" 
      component={() => <PlaceholderScreen title="Attendance Tracking" />}
    />
    <Tab.Screen 
      name="Reports" 
      component={() => <PlaceholderScreen title="Performance Reports" />}
    />
  </Tab.Navigator>
);

// Instructor Tab Navigator
const InstructorTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.surfaceVariant,
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      tabBarActiveTintColor: colors.error,
      tabBarInactiveTintColor: colors.onSurfaceVariant,
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={() => <PlaceholderScreen title="Instructor Dashboard" />}
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="QRGenerator" 
      component={() => <PlaceholderScreen title="QR Generator" />}
      options={{ title: 'QR Code' }}
    />
    <Tab.Screen 
      name="Students" 
      component={() => <PlaceholderScreen title="Manage Students" />}
    />
    <Tab.Screen 
      name="Grades" 
      component={() => <PlaceholderScreen title="Grade Management" />}
    />
  </Tab.Navigator>
);

// Main App Content
const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  // Loading screen
  if (isLoading) {
    return (
      <LinearGradient colors={colors.gradient.dark} style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={colors.gradient.primary}
            style={styles.logo}
          >
            <Text style={styles.logoText}>T</Text>
          </LinearGradient>
          <Text style={styles.titleText}>TRACKADEMIC</Text>
        </View>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </LinearGradient>
    );
  }

  // Determine which navigator to show based on user type
  const getMainNavigator = () => {
    if (!isAuthenticated || !user) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* Add RegisterScreen when created */}
        </Stack.Navigator>
      );
    }

    switch (user.userType) {
      case 'student':
        return <StudentTabs />;
      case 'parent':
        return <ParentTabs />;
      case 'instructor':
        return <InstructorTabs />;
      default:
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        );
    }
  };

  return (
    <NavigationContainer>
      {getMainNavigator()}
    </NavigationContainer>
  );
};

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        <AppContent />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.onPrimary,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.onBackground,
    letterSpacing: 2,
  },
  loader: {
    marginVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: typography.fontSize.md,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default App;