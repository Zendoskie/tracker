import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';
import { qrAPI } from '../../services/api';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
  onClose: () => void;
  visible: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onClose,
  visible,
}) => {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanning(true);
    }
  }, [visible]);

  const handleBarCodeRead = async (event: any) => {
    if (!scanning || loading) return;

    const qrCode = event.data;
    
    if (!qrCode) {
      Alert.alert('Error', 'Invalid QR code');
      return;
    }

    setScanning(false);
    setLoading(true);
    
    // Haptic feedback
    Vibration.vibrate(100);

    try {
      const response = await qrAPI.scan(qrCode);
      
      Alert.alert(
        'Success!', 
        'Attendance marked successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              onScanSuccess(response.attendance);
              onClose();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Scan Failed',
        error.response?.data?.message || 'Failed to mark attendance',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setScanning(true);
              setLoading(false);
            },
          },
          {
            text: 'Cancel',
            onPress: onClose,
            style: 'cancel',
          },
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={flashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        onBarCodeRead={handleBarCodeRead}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        captureAudio={false}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          <LinearGradient
            colors={[colors.surfaceOverlay, 'transparent']}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <Text style={styles.headerSubtitle}>
              Position the QR code within the frame
            </Text>
          </LinearGradient>

          {/* Scanner Frame */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scanning line animation would go here */}
              {scanning && !loading && (
                <View style={styles.scanningLine} />
              )}
              
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Processing...</Text>
                </View>
              )}
            </View>
            
            {/* Status text */}
            <Text style={styles.statusText}>
              {loading 
                ? 'Marking attendance...' 
                : scanning 
                  ? 'Align QR code within the frame'
                  : 'Scan completed'
              }
            </Text>
          </View>

          {/* Controls */}
          <LinearGradient
            colors={['transparent', colors.surfaceOverlay]}
            style={styles.controls}
          >
            <View style={styles.controlsRow}>
              {/* Flash Toggle */}
              <TouchableOpacity
                style={[styles.controlButton, flashOn && styles.controlButtonActive]}
                onPress={toggleFlash}
                disabled={loading}
              >
                <Text style={styles.controlButtonText}>
                  {flashOn ? 'Flash Off' : 'Flash On'}
                </Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                disabled={loading}
              >
                <LinearGradient
                  colors={colors.gradient.secondary}
                  style={styles.closeButtonGradient}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                • Make sure you're in the correct classroom
              </Text>
              <Text style={styles.instructionText}>
                • Hold your device steady
              </Text>
              <Text style={styles.instructionText}>
                • Ensure good lighting for better scanning
              </Text>
            </View>
          </LinearGradient>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanningLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: colors.primary,
    top: '50%',
    ...shadows.primaryGlow,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    paddingTop: spacing.xl,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  controlButton: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray600,
  },
  controlButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.glowOverlay,
  },
  controlButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurface,
    fontWeight: typography.fontWeight.medium,
  },
  closeButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  closeButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSecondary,
  },
  instructions: {
    backgroundColor: colors.surfaceContainer,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  instructionText: {
    fontSize: typography.fontSize.xs,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
});

export default QRScanner;