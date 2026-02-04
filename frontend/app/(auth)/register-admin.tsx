import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const ADMIN_CODE = '20025';

export default function RegisterAdminScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<'code' | 'form'>('code');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%', '90%'], []);

  const handleCodeSubmit = () => {
    if (code.trim() !== ADMIN_CODE) {
      Alert.alert('Code incorrect', 'Le code d’administration est invalide.');
      return;
    }
    setStep('form');
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleRegisterAdmin = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Mot de passe trop court');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.registerAdmin({
        code: ADMIN_CODE,
        ...formData,
        email: formData.email.toLowerCase(),
      });

      await login(
        String(data.accessToken),
        String(data.refreshToken),
        data.user
      );

      Alert.alert('Succès', 'Compte administrateur créé', [
        { text: 'OK', onPress: () => router.replace('/(admin)/dashboard') },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/fond.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableContentPanningGesture={true}
        keyboardBehavior="interactive"   
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          style={{ flex: 1 }}                    // ← important
          contentContainerStyle={[styles.sheetContent, { flexGrow: 1 }]}
        >
          {/* IMPORTANT: wrapper flex */}
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
              style={{ flex: 1 }}
            >
              <Text style={styles.title}>Compte administrateur</Text>
              <Text style={styles.subtitle}>
                {step === 'code'
                  ? 'Entrez le code sécurisé'
                  : 'Informations administrateur'}
              </Text>

              {step === 'code' ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Code d’administration"
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                    autoFocus
                  />

                  <TouchableOpacity style={styles.button} onPress={handleCodeSubmit}>
                    <Text style={styles.buttonText}>Valider</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.nameRow}>
                    <TextInput
                      style={[styles.input, styles.inputHalf]}
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChangeText={(t) =>
                        setFormData((p) => ({ ...p, firstName: t }))
                      }
                    />
                    <TextInput
                      style={[styles.input, styles.inputHalf]}
                      placeholder="Nom"
                      value={formData.lastName}
                      onChangeText={(t) =>
                        setFormData((p) => ({ ...p, lastName: t }))
                      }
                    />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, email: t }))
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Téléphone"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, phone: t }))
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, password: t }))
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, confirmPassword: t }))
                    }
                  />

                  <TouchableOpacity
                    style={[styles.button, loading && styles.disabled]}
                    onPress={handleRegisterAdmin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Créer le compte</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => router.back()}
              >
                <Text style={styles.link}>Retour</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  indicator: {
    width: 60,
    backgroundColor: '#ccc',
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: '#f4f4f5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    fontSize: 15,
  },
  inputHalf: {
    flex: 1,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#6366f1',
  },
});
