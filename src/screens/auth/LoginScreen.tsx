import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { LoginCredentials } from '../../types';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const credentials: LoginCredentials = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (error) {
      Alert.alert('Login Failed', error as string);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient
      colors={colors.gradient.dark}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Title Section */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>T</Text>
            </LinearGradient>
            <Text style={styles.titleText}>TRACKADEMIC</Text>
            <Text style={styles.subtitleText}>Academic Performance Tracking</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.instructionText}>Sign in to access your dashboard</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                emailFocused && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.loginButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.onPrimary} size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>SIGN IN</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign up here</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.divider} />
            <Text style={styles.footerText}>Choose your role to continue</Text>
            <View style={styles.roleContainer}>
              <View style={styles.roleItem}>
                <View style={[styles.roleIcon, { backgroundColor: colors.success }]} />
                <Text style={styles.roleText}>Student</Text>
              </View>
              <View style={styles.roleItem}>
                <View style={[styles.roleIcon, { backgroundColor: colors.warning }]} />
                <Text style={styles.roleText}>Parent</Text>
              </View>
              <View style={styles.roleItem}>
                <View style={[styles.roleIcon, { backgroundColor: colors.error }]} />
                <Text style={styles.roleText}>Instructor</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.primaryGlow,
  },
  logoText: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onPrimary,
  },
  titleText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    ...shadows.lg,
    shadowColor: colors.primary,
  },
  welcomeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  instructionText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSurface,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputWrapper: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray600,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    ...shadows.primaryGlow,
  },
  input: {
    height: 56,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.onSurface,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.primaryGlow,
  },
  loginButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.onPrimary,
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
  },
  registerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.md,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  roleItem: {
    alignItems: 'center',
  },
  roleIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    color: colors.onSurfaceVariant,
  },
});

export default LoginScreen;