import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { Feather } from '@expo/vector-icons';

interface LibraryCameraViewProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photoUri: string) => void;
}

export default function LibraryCameraView({ visible, onClose, onCapture }: LibraryCameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!visible) return null;

  // 1. Handle Initial Permission Loading State
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.statusText}>Initializing Camera...</Text>
        </View>
      </Modal>
    );
  }

  // 2. Handle Permission Denied State
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={styles.permissionIconBg}>
              <Feather name="camera" size={48} color="#0ea5e9" />
            </View>
            <Text style={styles.titleText}>Camera Access Required</Text>
            <Text style={styles.descText}>
              To take professional patient profile photos, we need permission to access your device's camera.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
              <Text style={styles.primaryBtnText}>GRANT ACCESS</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  // 3. Helper: Toggle Facing Direction
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // 4. Capture Action
  const handleTakePicture = async () => {
    if (cameraRef.current && !isTakingPicture) {
      try {
        setIsTakingPicture(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: false,
        });
        if (photo && photo.uri) {
          onCapture(photo.uri);
        }
      } catch (error: any) {
        Alert.alert('Capture Failed', error.message || 'Failed to capture photo.');
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.cameraOuter}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        >
          {/* Close / Flip Toolbar */}
          <SafeAreaView style={styles.safeOverlay}>
            <View style={styles.topToolbar}>
              <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
                <Feather name="arrow-left" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconCircle}>
                <Feather name="refresh-cw" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Frame / Grid Guideline Box */}
            <View style={styles.viewfinder}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>

            {/* Bottom Control Bar */}
            <View style={styles.bottomToolbar}>
              <View style={styles.flexSpacer} />

              {/* Shutter Button */}
              <TouchableOpacity
                style={styles.shutterOuter}
                onPress={handleTakePicture}
                disabled={isTakingPicture}
              >
                {isTakingPicture ? (
                  <ActivityIndicator size="small" color="#0ea5e9" />
                ) : (
                  <View style={styles.shutterInner} />
                )}
              </TouchableOpacity>

              <View style={styles.flexSpacer} />
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  statusText: {
    marginTop: '4%',
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
  },
  header: {
    padding: '4%',
    alignItems: 'flex-start',
  },
  closeBtn: {
    width: '10%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '8%',
    paddingBottom: '15%',
  },
  permissionIconBg: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 25,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '2%',
  },
  descText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: '8%',
  },
  primaryBtn: {
    backgroundColor: '#0ea5e9',
    width: '100%',
    paddingVertical: '3.5%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  cameraOuter: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  safeOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '4%',
    paddingTop: '2%',
  },
  iconCircle: {
    width: '12%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewfinder: {
    flex: 1,
    marginVertical: '10%',
    marginHorizontal: '15%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#0ea5e9',
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0ea5e9',
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#0ea5e9',
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0ea5e9',
    borderBottomRightRadius: 12,
  },

  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '8%',
    paddingTop: '4%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  flexSpacer: {
    flex: 1,
  },
  shutterOuter: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    padding: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    flex: 1,
    width: '100%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#0f172a',
    backgroundColor: '#ffffff',
  },
});
