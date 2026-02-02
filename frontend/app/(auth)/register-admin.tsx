import React, { useState } from 'react';
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
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

const ADMIN_CODE = '20025';

export default function RegisterAdminScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'code' | 'form'>('code');
  const [code, setCode] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCodeSubmit = () => {
    if (code.trim() !== ADMIN_CODE) {
      Alert.alert('Code incorrect', 'Le code d\'administration est invalide.');
      return;
    }
    setStep('form');
  };

  const handleRegisterAdmin = async () => {
    if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim() || !formData.phone?.trim() || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://loving-backend.onrender.com/api';
      const response = await fetch(`${apiUrl}/auth/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: ADMIN_CODE,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        Alert.alert('Erreur', data.message || 'Impossible de créer le compte administrateur');
        setLoading(false);
        return;
      }

      const { token, refreshToken, user } = data.data;
      await login(token, refreshToken, user);
      Alert.alert('Compte créé', 'Compte administrateur créé avec succès.', [
        { text: 'OK', onPress: () => router.replace('/(admin)/dashboard') },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('@/assets/fond.jpg')} style={styles.images} resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Créer un compte administrateur</Text>
            <Text style={styles.subtitle}>
              {step === 'code' ? 'Entrez le code d\'administration' : 'Renseignez vos informations'}
            </Text>

            {step === 'code' ? (
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Code d'administration"
                  placeholderTextColor="#999"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={10}
                  autoFocus
                />
                <TouchableOpacity style={styles.button} onPress={handleCodeSubmit}>
                  <Text style={styles.buttonText}>Valider le code</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.nameRow}>
                  <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="Prénom"
                    placeholderTextColor="#999"
                    value={formData.firstName}
                    onChangeText={(t) => setFormData((p) => ({ ...p, firstName: t }))}
                  />
                  <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="Nom"
                    placeholderTextColor="#999"
                    value={formData.lastName}
                    onChangeText={(t) => setFormData((p) => ({ ...p, lastName: t }))}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={formData.email}
                  onChangeText={(t) => setFormData((p) => ({ ...p, email: t }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  placeholderTextColor="#999"
                  value={formData.phone}
                  onChangeText={(t) => setFormData((p) => ({ ...p, phone: t }))}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(t) => setFormData((p) => ({ ...p, password: t }))}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(t) => setFormData((p) => ({ ...p, confirmPassword: t }))}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleRegisterAdmin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Créer le compte administrateur</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
              <Text style={styles.backLinkText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  images: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  content: { paddingVertical: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1f2937', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  form: { width: '100%' },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  inputHalf: { flex: 1 },
  nameRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backLink: { marginTop: 24, alignItems: 'center' },
  backLinkText: { color: '#6366f1', fontSize: 14 },
});
