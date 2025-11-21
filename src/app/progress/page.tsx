'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { missions, activityLines, getProgress, type Progress } from '@/lib/data';
import { ArrowLeft, TrendingUp, Calendar, Target, Award, BarChart3, Clock, CheckCircle } from 'lucide-react';

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress>({ completedActivities: [], level: 1, badges: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalActivities = missions.reduce((acc, mission) => acc + mission.activities.length, 0);
  const completedCount = progress.completedActivities.length;
  const progressPercentage = totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0;

  // Calcular progresso por linha de atividade
  const lineProgress = activityLines.map(line => {
    const lineActivities = missions.flatMap(m => m.activities).filter(a => a.lineId === line.id);
    const completedInLine = lineActivities.filter(a => progress.completedActivities.includes(a.id)).length;
    const totalTime = lineActivities.reduce((acc, activity) => acc + activity.time, 0);
    const completedTime = lineActivities
      .filter(a => progress.completedActivities.includes(a.id))
      .reduce((acc, activity) => acc + activity.time, 0);
    
    return {
      ...line,
      total: lineActivities.length,
      completed: completedInLine,
      percentage: lineActivities.length > 0 ? (completedInLine / lineActivities.length) * 100 : 0,
      totalTime,
      completedTime,
      activities: lineActivities
    };
  });

  // Estatísticas gerais
  const totalTimeSpent = missions
    .flatMap(m => m.activities)
    .filter(a => progress.completedActivities.includes(a.id))
    .reduce((acc, activity) => acc + activity.time, 0);

  const averageActivityTime = completedCount > 0 ? Math.round(totalTimeSpent / completedCount) : 0;

  // Progresso semanal
  const weeklyProgress = missions.map(mission => {
    const missionCompleted = mission.activities.filter(a => 
      progress.completedActivities.includes(a.id)
    ).length;
    const missionProgress = (missionCompleted / mission.activities.length) * 100;
    
    return {
      ...mission,
      completed: missionCompleted,
      percentage: missionProgress
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
          
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Relatório de Progresso
              </h1>
              <p className="text-gray-600 mt-1">
                Acompanhe o desenvolvimento da sua criança
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{completedCount}</div>
            <div className="text-sm text-gray-600">Atividades Completadas</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Progresso Total</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalTimeSpent}</div>
            <div className="text-sm text-gray-600">Minutos Investidos</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{progress.level}</div>
            <div className="text-sm text-gray-600">Nível Atual</div>
          </div>
        </div>

        {/* Progresso por Linha de Atividade */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Progresso por Área de Desenvolvimento</h2>
          </div>
          
          <div className="grid gap-6">
            {lineProgress.map((line) => (
              <div key={line.id} className="border border-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{line.name}</h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{line.completed}/{line.total} atividades</div>
                    <div className="text-xs text-gray-500">{line.completedTime}/{line.totalTime} min</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${line.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {Math.round(line.percentage)}% completo
                  </span>
                  {line.percentage === 100 && (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Área Dominada!
                    </span>
                  )}
                </div>

                {/* Atividades da linha */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Atividades:</h4>
                  <div className="grid gap-2">
                    {line.activities.map((activity) => {
                      const isCompleted = progress.completedActivities.includes(activity.id);
                      return (
                        <div key={activity.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={isCompleted ? 'text-green-700' : 'text-gray-600'}>
                              {activity.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {activity.time}min
                            {isCompleted && <CheckCircle className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progresso Semanal */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Progresso por Semana</h2>
          </div>
          
          <div className="grid gap-4">
            {weeklyProgress.map((mission) => (
              <div key={mission.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    Semana {mission.week}: {mission.title}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {mission.completed}/{mission.activities.length}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${mission.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {Math.round(mission.percentage)}% completo
                  </span>
                  {mission.percentage === 100 && (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Semana Concluída!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conquistas */}
        {progress.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Conquistas Desbloqueadas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progress.badges.map((badge, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl text-center shadow-lg"
                >
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-medium">{badge}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Talking Points */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            💬 Pontos de Conversa da Semana
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 mb-2">Desenvolvimento Motor Fino:</h3>
              <p className="text-purple-700 text-sm">
                Atividades de coordenação motora fina ajudam a preparar a criança para a escrita e tarefas que exigem precisão manual.
              </p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 mb-2">Linguagem e Comunicação:</h3>
              <p className="text-purple-700 text-sm">
                O desenvolvimento da linguagem nesta idade é crucial para a expressão de ideias e compreensão do mundo ao redor.
              </p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 mb-2">Tempo de Qualidade:</h3>
              <p className="text-purple-700 text-sm">
                Você já investiu {totalTimeSpent} minutos em atividades de desenvolvimento. Cada minuto conta para o crescimento da sua criança!
              </p>
            </div>
          </div>
        </div>

        {/* Botão de ação */}
        <div className="text-center">
          <Link 
            href="/missions"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Target className="w-5 h-5" />
            Continuar Missões
          </Link>
        </div>
      </div>
    </div>
  );
}