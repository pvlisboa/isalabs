'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { missions, activityLines, getProgress, getChildProfile, getActivitiesForAge, getIndoorActivities, getRecommendedActivities, type Progress, type ChildProfile } from '@/lib/data';
import { Star, Trophy, Target, BookOpen, TrendingUp, Award, User, Cloud, Heart, Calendar, Settings, Sun, Menu, X, ShoppingBag, Lock, Clock, Zap } from 'lucide-react';
import { isTrialActive, getTrialDaysRemaining, canAccessActivity } from '@/lib/auth';
import PaymentModal from '@/components/PaymentModal';
import FeedbackModal from '@/components/FeedbackModal';

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>({ completedActivities: [], level: 1, badges: [], weeklyStats: {}, totalTimeSpent: 0, avatarAccessories: [] });
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showIndoorActivities, setShowIndoorActivities] = useState(false);
  const [showOutdoorActivities, setShowOutdoorActivities] = useState(false);
  const [showSegmentMenu, setShowSegmentMenu] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [isTrialActiveState, setIsTrialActiveState] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTrigger, setPaymentTrigger] = useState<'trial_ending' | 'activity_limit' | 'reports_blocked' | 'feedback_prompt'>('trial_ending');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [lastActivityCount, setLastActivityCount] = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window === 'undefined') return;
    
    const isAuthenticated = localStorage.getItem('userAuthenticated');
    const profile = getChildProfile();
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const plan = localStorage.getItem('userPlan') as 'free' | 'premium' || 'free';
    const trialEndDate = localStorage.getItem('trialEndDate');
    const lastActivity = localStorage.getItem('lastActivityDate');
    
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    
    if (!onboardingCompleted || !profile) {
      router.push('/onboarding');
      return;
    }
    
    // Verificar status do trial
    if (trialEndDate) {
      const daysRemaining = getTrialDaysRemaining(trialEndDate);
      const trialActive = daysRemaining > 0;
      setTrialDaysRemaining(daysRemaining);
      setIsTrialActiveState(trialActive);
    }
    
    setChildProfile(profile);
    const currentProgress = getProgress();
    setProgress(currentProgress);
    setUserPlan(plan);
    setLastActivityCount(currentProgress.completedActivities.length);
    setLastActivityDate(lastActivity);

    // Sistema de pop-ups inteligente
    const lastFeedbackDate = localStorage.getItem('lastFeedbackDate');
    const feedbackCount = parseInt(localStorage.getItem('feedbackCount') || '0');
    const today = new Date().toDateString();

    // Pop-up de feedback durante o trial (a cada 2 dias)
    if (trialEndDate && isTrialActive(trialEndDate) && lastFeedbackDate !== today) {
      const daysSinceStart = 7 - getTrialDaysRemaining(trialEndDate);
      if (daysSinceStart > 0 && daysSinceStart % 2 === 0 && feedbackCount < 3) {
        setTimeout(() => {
          setShowFeedbackModal(true);
        }, 3000); // Mostrar após 3 segundos
      }
    }

    // Pop-up de upgrade quando trial está acabando
    if (trialEndDate && getTrialDaysRemaining(trialEndDate) <= 1 && plan === 'free') {
      setTimeout(() => {
        setPaymentTrigger('trial_ending');
        setShowPaymentModal(true);
      }, 5000); // Mostrar após 5 segundos
    }

  }, [router]);

  // Verificar limite de atividades e mostrar modal
  useEffect(() => {
    const userCanAccess = canAccessActivity(userPlan, isTrialActiveState, progress.completedActivities.length, lastActivityDate);
    
    if (!userCanAccess && userPlan === 'free' && !isTrialActiveState) {
      // Mostrar modal apenas quando atingir o limite pela primeira vez
      if (progress.completedActivities.length > lastActivityCount) {
        setTimeout(() => {
          setPaymentTrigger('activity_limit');
          setShowPaymentModal(true);
        }, 2000);
      }
    }
  }, [progress.completedActivities.length, isTrialActiveState, userPlan, lastActivityCount, lastActivityDate]);

  if (!mounted || !childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calcular idade atual
  const today = new Date();
  const birth = new Date(childProfile.birthDate);
  const currentAgeInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  
  // Determinar grupo de idade atual
  const getCurrentAgeGroup = (ageInMonths: number) => {
    if (ageInMonths < 18) return '1-1.5 anos';
    if (ageInMonths < 24) return '1.5-2 anos';
    if (ageInMonths < 36) return '2-3 anos';
    if (ageInMonths < 48) return '3-4 anos';
    return '4-5 anos';
  };

  const currentAgeGroup = getCurrentAgeGroup(currentAgeInMonths);
  
  // Filtrar missões por idade
  const ageMissions = getActivitiesForAge(currentAgeGroup);
  const indoorActivities = getIndoorActivities();
  const recommendedActivities = getRecommendedActivities(childProfile.interests, currentAgeGroup);

  const totalActivities = ageMissions.reduce((acc, mission) => acc + mission.activities.length, 0);
  const completedCount = progress.completedActivities.length;
  const progressPercentage = totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0;

  // Verificar se pode acessar atividades
  const userCanAccessActivity = canAccessActivity(userPlan, isTrialActiveState, completedCount, lastActivityDate);

  // Verificar se pode acessar relatórios
  const canAccessReports = userPlan === 'premium' || isTrialActiveState;

  // Calcular progresso por linha de atividade
  const lineProgress = activityLines.map(line => {
    const lineActivities = ageMissions.flatMap(m => m.activities).filter(a => a.lineId === line.id);
    const completedInLine = lineActivities.filter(a => progress.completedActivities.includes(a.id)).length;
    return {
      ...line,
      total: lineActivities.length,
      completed: completedInLine,
      percentage: lineActivities.length > 0 ? (completedInLine / lineActivities.length) * 100 : 0
    };
  });

  const handleEditProfile = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingCompleted');
    }
    router.push('/onboarding');
  };

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    if (typeof window === 'undefined') return;
    
    // Simular processo de pagamento
    localStorage.setItem('userPlan', 'premium');
    localStorage.setItem('subscriptionPlan', plan);
    localStorage.setItem('subscriptionDate', new Date().toISOString());
    setUserPlan('premium');
    setShowPaymentModal(false);
    
    // Mostrar mensagem de sucesso
    alert('🎉 Parabéns! Seu plano Premium foi ativado com sucesso!');
  };

  const handleFeedbackSubmit = (feedback: { rating: number; comment: string; showUpgrade: boolean }) => {
    if (typeof window === 'undefined') return;
    
    // Salvar feedback
    const feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    feedbacks.push({
      ...feedback,
      date: new Date().toISOString(),
      trialDay: 7 - trialDaysRemaining
    });
    localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
    localStorage.setItem('lastFeedbackDate', new Date().toDateString());
    
    const feedbackCount = parseInt(localStorage.getItem('feedbackCount') || '0');
    localStorage.setItem('feedbackCount', (feedbackCount + 1).toString());

    // Se usuário quer upgrade, mostrar modal de pagamento
    if (feedback.showUpgrade) {
      setTimeout(() => {
        setPaymentTrigger('feedback_prompt');
        setShowPaymentModal(true);
      }, 1000);
    }
  };

  const handleReportsClick = () => {
    if (!canAccessReports) {
      setPaymentTrigger('reports_blocked');
      setShowPaymentModal(true);
    } else {
      router.push('/progress');
    }
  };

  // Calcular próxima atividade disponível para usuários gratuitos
  const getNextActivityAvailableDate = () => {
    if (!lastActivityDate) return null;
    const lastActivity = new Date(lastActivityDate);
    const nextAvailable = new Date(lastActivity);
    nextAvailable.setDate(nextAvailable.getDate() + 15);
    return nextAvailable;
  };

  const nextActivityDate = getNextActivityAvailableDate();
  const daysUntilNextActivity = nextActivityDate ? Math.ceil((nextActivityDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Atividades para dias ensolarados
  const outdoorActivities = [
    {
      id: 'outdoor-1',
      title: 'Caça ao Tesouro no Jardim',
      description: 'Procurar objetos naturais no quintal ou parque',
      time: 20,
      difficulty: 'easy'
    },
    {
      id: 'outdoor-2', 
      title: 'Pintura com Água',
      description: 'Pintar muros e calçadas com pincel e água',
      time: 15,
      difficulty: 'easy'
    },
    {
      id: 'outdoor-3',
      title: 'Jardim de Pedrinhas',
      description: 'Coletar e decorar pedras do jardim',
      time: 25,
      difficulty: 'medium'
    },
    {
      id: 'outdoor-4',
      title: 'Bolhas de Sabão Gigantes',
      description: 'Fazer bolhas grandes com receita caseira',
      time: 30,
      difficulty: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header Limpo - Mobile Otimizado */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9de3e442-281e-4f62-8b95-cd94a151e2b6.png" 
                alt="IsaLabs Logo" 
                className="h-8 sm:h-12 w-auto flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  IsaLabs
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Entre na sua conta para começar a jornada de desenvolvimento do(a) seu(sua) filho(a).
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/recommendations"
                className="flex items-center gap-1 sm:gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm touch-manipulation"
              >
                <ShoppingBag className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Produtos</span>
              </Link>
              
              <button
                onClick={() => setShowSegmentMenu(!showSegmentMenu)}
                className="flex items-center gap-1 sm:gap-2 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-2 rounded-lg transition-colors touch-manipulation"
              >
                <Menu className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Segmentos</span>
              </button>
              
              <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                userPlan === 'premium' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                  : isTrialActiveState
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {userPlan === 'premium' ? (
                  <Trophy className="w-3 sm:w-4 h-3 sm:h-4" />
                ) : isTrialActiveState ? (
                  <Zap className="w-3 sm:w-4 h-3 sm:h-4" />
                ) : (
                  <Trophy className="w-3 sm:w-4 h-3 sm:h-4" />
                )}
                <span className="font-semibold">
                  {userPlan === 'premium' 
                    ? 'Premium' 
                    : isTrialActiveState 
                    ? `Trial ${trialDaysRemaining}d`
                    : 'Gratuito'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aviso do Trial ou Plano Gratuito - Mobile Otimizado */}
      {isTrialActiveState && trialDaysRemaining <= 3 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">
                  Seu trial expira em {trialDaysRemaining} dias
                </span>
              </div>
              <button 
                onClick={() => {
                  setPaymentTrigger('trial_ending');
                  setShowPaymentModal(true);
                }}
                className="bg-white text-orange-600 px-3 sm:px-4 py-1 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors flex-shrink-0 touch-manipulation"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {!isTrialActiveState && userPlan === 'free' && !userCanAccessActivity && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Lock className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Limite atingido. 
                  {daysUntilNextActivity > 0 && ` Próxima em ${daysUntilNextActivity}d.`}
                </span>
              </div>
              <button 
                onClick={() => {
                  setPaymentTrigger('activity_limit');
                  setShowPaymentModal(true);
                }}
                className="bg-white text-purple-600 px-3 sm:px-4 py-1 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors flex-shrink-0 touch-manipulation"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu de Segmentos - Mobile Otimizado */}
      {showSegmentMenu && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Segmentos de Atividade</h3>
              <button
                onClick={() => setShowSegmentMenu(false)}
                className="text-gray-500 hover:text-gray-700 p-1 touch-manipulation"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {activityLines.map((line) => {
                const lineData = lineProgress.find(l => l.id === line.id);
                return (
                  <div
                    key={line.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-900 truncate">{line.name}</h4>
                      <span className="text-xs text-gray-600 flex-shrink-0">
                        {lineData?.completed || 0}/{lineData?.total || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          line.color === 'blue' ? 'bg-blue-500' :
                          line.color === 'green' ? 'bg-green-500' :
                          line.color === 'purple' ? 'bg-purple-500' :
                          line.color === 'pink' ? 'bg-pink-500' :
                          line.color === 'orange' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${lineData?.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Cards de Atividades por Clima - Mobile Otimizado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Atividades para Dias Chuvosos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Dias Chuvosos</h3>
              </div>
              <button
                onClick={() => setShowIndoorActivities(!showIndoorActivities)}
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium touch-manipulation"
              >
                {showIndoorActivities ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            
            {showIndoorActivities && (
              <div className="space-y-2">
                {indoorActivities.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="relative">
                    <Link
                      href={userCanAccessActivity ? `/activities/${activity.id}` : '#'}
                      className={`block bg-gray-50 rounded-lg p-3 transition-colors touch-manipulation ${
                        userCanAccessActivity
                          ? 'hover:bg-gray-100 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm text-gray-900 mb-1 truncate">{activity.title}</h4>
                          <p className="text-xs text-gray-600 mb-1 line-clamp-2">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{activity.time} min</span>
                            <span>•</span>
                            <span>{activity.difficulty === 'easy' ? 'Fácil' : activity.difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
                          </div>
                        </div>
                        {!userCanAccessActivity && (
                          <Lock className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atividades para Dias Ensolarados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Dias Ensolarados</h3>
              </div>
              <button
                onClick={() => setShowOutdoorActivities(!showOutdoorActivities)}
                className="text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm font-medium touch-manipulation"
              >
                {showOutdoorActivities ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            
            {showOutdoorActivities && (
              <div className="space-y-2">
                {outdoorActivities.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="relative">
                    <div
                      className={`block bg-gray-50 rounded-lg p-3 transition-colors touch-manipulation ${
                        userCanAccessActivity
                          ? 'hover:bg-gray-100 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm text-gray-900 mb-1 truncate">{activity.title}</h4>
                          <p className="text-xs text-gray-600 mb-1 line-clamp-2">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{activity.time} min</span>
                            <span>•</span>
                            <span>{activity.difficulty === 'easy' ? 'Fácil' : activity.difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
                            <span>•</span>
                            <span>☀️ Ar livre</span>
                          </div>
                        </div>
                        {!userCanAccessActivity && (
                          <Lock className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progresso Geral - Mobile Otimizado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Progresso Geral</h2>
            <div className="flex items-center gap-2 text-blue-600">
              <Target className="w-4 h-4" />
              <span className="font-medium text-xs sm:text-sm">{completedCount}/{totalActivities}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-xs text-gray-600">Atividades</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
              <div className="text-xs text-gray-600">Completo</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-purple-600">{progress.badges.length}</div>
              <div className="text-xs text-gray-600">Conquistas</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-orange-600">{progress.avatarAccessories?.length || 0}</div>
              <div className="text-xs text-gray-600">Acessórios</div>
            </div>
          </div>
        </div>

        {/* Avatar e Recompensas - Mobile Otimizado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Seu Avatar</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Avatar simples */}
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                👶
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{childProfile.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {progress.avatarAccessories?.length || 0} acessórios desbloqueados
                </p>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-600 mb-1">Próximo em:</p>
              <p className="font-semibold text-purple-600 text-xs sm:text-sm">
                {5 - (completedCount % 5)} atividades
              </p>
            </div>
          </div>
          
          {/* Acessórios desbloqueados */}
          {progress.avatarAccessories && progress.avatarAccessories.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Acessórios desbloqueados:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {progress.avatarAccessories.map((accessory, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {accessory}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Atividades Recomendadas - Mobile Otimizado */}
        {recommendedActivities.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recomendadas para {childProfile.name}</h2>
            </div>
            
            <div className="space-y-3">
              {recommendedActivities.slice(0, 2).map((activity, index) => (
                <div key={activity.id} className="relative">
                  <Link
                    href={userCanAccessActivity ? `/activities/${activity.id}` : '#'}
                    className={`block border border-gray-100 rounded-lg p-3 sm:p-4 transition-all touch-manipulation ${
                      userCanAccessActivity
                        ? 'hover:shadow-sm hover:border-yellow-200 cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">{activity.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                          <span>{activity.time} min</span>
                          <span>{activity.difficulty === 'easy' ? 'Fácil' : activity.difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
                          {activity.isIndoorActivity && <span>🏠 Casa</span>}
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4 flex items-center gap-2 flex-shrink-0">
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                          Recomendada
                        </div>
                        {!userCanAccessActivity && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missões Semanais - Mobile Otimizado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Missões para {currentAgeGroup}</h2>
            </div>
            <Link 
              href="/missions" 
              className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm touch-manipulation"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-3">
            {ageMissions.slice(0, 2).map((mission) => {
              const missionCompleted = mission.activities.filter(a => 
                progress.completedActivities.includes(a.id)
              ).length;
              const missionProgress = mission.activities.length > 0 ? (missionCompleted / mission.activities.length) * 100 : 0;
              
              return (
                <Link 
                  key={mission.id} 
                  href={`/missions/${mission.id}`}
                  className="block border border-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-sm hover:border-blue-200 transition-all touch-manipulation"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      Semana {mission.week}: {mission.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 flex-shrink-0">
                      <Star className="w-3 sm:w-4 h-3 sm:h-4" />
                      {missionCompleted}/{mission.activities.length}
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${missionProgress}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600">
                    {mission.activities.length} atividades • {Math.round(missionProgress)}% completo
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação - Mobile Otimizado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link 
            href="/missions"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center touch-manipulation"
          >
            <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-2" />
            <h3 className="font-semibold text-base sm:text-lg mb-1">Explorar Missões</h3>
            <p className="text-blue-100 text-xs sm:text-sm">Descubra novas atividades semanais</p>
          </Link>
          
          <button
            onClick={handleReportsClick}
            className={`p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center relative touch-manipulation ${
              canAccessReports 
                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
            }`}
          >
            {!canAccessReports && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4" />
              </div>
            )}
            <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-2" />
            <h3 className="font-semibold text-base sm:text-lg mb-1">
              {canAccessReports ? 'Relatório Detalhado' : 'Relatórios Premium'}
            </h3>
            <p className={`text-xs sm:text-sm ${canAccessReports ? 'text-green-100' : 'text-gray-200'}`}>
              {canAccessReports ? 'Veja o progresso completo' : 'Desbloqueie insights detalhados'}
            </p>
          </button>
        </div>
      </div>

      {/* Modais */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onUpgrade={handleUpgrade}
          trigger={paymentTrigger}
        />
      )}

      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
          daysInTrial={7 - trialDaysRemaining}
        />
      )}
    </div>
  );
}