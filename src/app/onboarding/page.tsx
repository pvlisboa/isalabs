'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Baby, Calendar, ArrowRight, Heart, Star } from 'lucide-react';

interface ChildProfile {
  name: string;
  birthDate: string;
  interests: string[];
  specialNeeds: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ChildProfile>({
    name: '',
    birthDate: '',
    interests: [],
    specialNeeds: ''
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return ageInMonths;
  };

  const getAgeGroup = (ageInMonths: number) => {
    if (ageInMonths < 18) return '1-1.5 anos';
    if (ageInMonths < 24) return '1.5-2 anos';
    if (ageInMonths < 36) return '2-3 anos';
    if (ageInMonths < 48) return '3-4 anos';
    return '4-5 anos';
  };

  const interestOptions = [
    { id: 'music', label: 'Música e Sons', icon: '🎵' },
    { id: 'art', label: 'Arte e Desenho', icon: '🎨' },
    { id: 'movement', label: 'Movimento e Dança', icon: '💃' },
    { id: 'books', label: 'Livros e Histórias', icon: '📚' },
    { id: 'nature', label: 'Natureza e Animais', icon: '🌿' },
    { id: 'building', label: 'Construção e Montagem', icon: '🧱' },
    { id: 'cooking', label: 'Culinária e Comida', icon: '👩‍🍳' },
    { id: 'water', label: 'Brincadeiras com Água', icon: '💧' }
  ];

  const handleInterestToggle = (interestId: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleComplete = () => {
    const ageInMonths = calculateAge(profile.birthDate);
    const ageGroup = getAgeGroup(ageInMonths);
    
    const childData = {
      ...profile,
      ageInMonths,
      ageGroup,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('childProfile', JSON.stringify(childData));
    localStorage.setItem('onboardingCompleted', 'true');
    
    router.push('/');
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    return date >= fiveYearsAgo && date <= oneYearAgo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Guia Parental</h1>
          </div>
          <p className="text-gray-600">
            Vamos conhecer seu pequeno para personalizar as atividades!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Passo {step} de 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Step 1: Nome da criança */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <Baby className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Como podemos chamar seu pequeno?
                </h2>
                <p className="text-gray-600">
                  Isso nos ajudará a personalizar a experiência
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da criança
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!profile.name.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Data de nascimento */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quando {profile.name} nasceu?
                </h2>
                <p className="text-gray-600">
                  Isso nos permite sugerir atividades adequadas para a idade
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    min={new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {profile.birthDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-800">
                        {profile.name} tem {Math.floor(calculateAge(profile.birthDate) / 12)} anos e {calculateAge(profile.birthDate) % 12} meses
                      </div>
                      <div className="text-sm text-blue-600 mt-1">
                        Grupo de idade: {getAgeGroup(calculateAge(profile.birthDate))}
                      </div>
                    </div>
                  </div>
                )}

                {profile.birthDate && !isValidDate(profile.birthDate) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm text-center">
                      Este app é destinado a crianças de 1 a 5 anos. Verifique a data informada.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!profile.birthDate || !isValidDate(profile.birthDate)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interesses */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  O que {profile.name} mais gosta?
                </h2>
                <p className="text-gray-600">
                  Selecione os interesses para personalizar as atividades
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        profile.interests.includes(interest.id)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                    >
                      <div className="text-2xl mb-2">{interest.icon}</div>
                      <div className="font-medium text-sm">{interest.label}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alguma necessidade especial ou observação? (opcional)
                  </label>
                  <textarea
                    value={profile.specialNeeds}
                    onChange={(e) => setProfile(prev => ({ ...prev, specialNeeds: e.target.value }))}
                    placeholder="Ex: dificuldades motoras, preferências específicas, alergias..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Começar Jornada! 🚀
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Seus dados ficam salvos apenas no seu dispositivo</p>
        </div>
      </div>
    </div>
  );
}