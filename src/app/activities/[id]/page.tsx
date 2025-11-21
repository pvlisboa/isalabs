'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Users, Star, Trophy, CheckCircle, Play, Pause, RotateCcw, Award } from 'lucide-react';
import { getActivityById, getProgress, completeActivity, saveProgress, type Activity, type Progress } from '@/lib/data';

export default function ActivityPage() {
  const router = useRouter();
  const params = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (params.id) {
      const activityData = getActivityById(params.id as string);
      const progressData = getProgress();
      
      setActivity(activityData || null);
      setProgress(progressData);
      
      if (activityData) {
        setTimer(activityData.time * 60); // Converter minutos para segundos
        setIsCompleted(progressData.completedActivities.includes(activityData.id));
      }
    }
  }, [params.id]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteActivity = () => {
    if (activity && progress) {
      completeActivity(activity.id);
      setIsCompleted(true);
      
      // Mostrar recompensa se houver
      if (activity.reward) {
        setShowReward(true);
      }
      
      // Atualizar progresso local
      const updatedProgress = getProgress();
      setProgress(updatedProgress);
    }
  };

  const handleNextStep = () => {
    if (activity && currentStep < activity.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando atividade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timer)}</span>
              </div>
              
              {/* Controles do Timer */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setTimer(activity.time * 60);
                    setIsTimerRunning(false);
                  }}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho da Atividade */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{activity.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{activity.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{activity.time} minutos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{activity.difficulty === 'easy' ? 'Fácil' : activity.difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{activity.ageGroup}</span>
                  </div>
                </div>
              </div>
              
              {/* Imagem da Atividade */}
              {activity.image && (
                <div className="ml-6">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-32 h-32 object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Status de Conclusão */}
            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Atividade Concluída!</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Parabéns! Você completou esta atividade com sucesso.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Descrição Detalhada */}
              {activity.detailedDescription && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre esta Atividade</h2>
                  <p className="text-gray-700 leading-relaxed">{activity.detailedDescription}</p>
                </div>
              )}

              {/* Passos da Atividade */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Como Fazer</h2>
                  <span className="text-sm text-gray-500">
                    Passo {currentStep + 1} de {activity.steps.length}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-gray-800 text-lg">{activity.steps[currentStep]}</p>
                  </div>
                </div>
                
                {/* Navegação dos Passos */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Passo Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {activity.steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {currentStep < activity.steps.length - 1 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Próximo Passo
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteActivity}
                      disabled={isCompleted}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      {isCompleted ? 'Concluída' : 'Concluir Atividade'}
                    </button>
                  )}
                </div>
              </div>

              {/* Dicas para os Pais */}
              {activity.parentTips && activity.parentTips.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Dicas para os Pais</h2>
                  <div className="space-y-3">
                    {activity.parentTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Materiais Necessários */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Materiais Necessários</h3>
                <ul className="space-y-2">
                  {activity.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefícios */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Benefícios</h3>
                <ul className="space-y-2">
                  {activity.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recompensa */}
              {activity.reward && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recompensa
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="font-semibold text-purple-800">{activity.reward.accessory}</p>
                    <p className="text-sm text-purple-600 mt-1">{activity.reward.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Recompensa */}
      {showReward && activity.reward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Parabéns!</h2>
            <p className="text-gray-600 mb-4">Você desbloqueou um novo acessório:</p>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-bold text-purple-800 text-lg">{activity.reward.accessory}</p>
              <p className="text-sm text-purple-600 mt-1">{activity.reward.description}</p>
            </div>
            
            <button
              onClick={() => setShowReward(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}