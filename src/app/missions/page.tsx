'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Target, 
  BookOpen, 
  Star, 
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { 
  missions, 
  getActivitiesForAge, 
  getActivitiesForMonth,
  getActivitiesForSeason,
  getMonthlyObjectives,
  getProgress, 
  getActiveChild,
  Mission 
} from '@/lib/data';

export default function MissionsPage() {
  const router = useRouter();
  const [activeChild, setActiveChild] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem('userAuthenticated');
    
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const child = getActiveChild();
    const userProgress = getProgress();
    
    if (!child) {
      router.push('/onboarding');
      return;
    }

    setActiveChild(child);
    setProgress(userProgress);
    
    // Filtrar missões por idade
    const ageMissions = getActivitiesForAge(child.ageGroup);
    setFilteredMissions(ageMissions);
  }, [router]);

  useEffect(() => {
    if (!activeChild) return;

    let filtered = getActivitiesForAge(activeChild.ageGroup);

    // Filtrar por mês
    if (selectedMonth !== 0) {
      filtered = filtered.filter(mission => mission.month === selectedMonth);
    }

    // Filtrar por estação
    if (selectedSeason !== 'all') {
      filtered = filtered.filter(mission => mission.season === selectedSeason);
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(mission => 
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.theme.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMissions(filtered);
  }, [selectedMonth, selectedSeason, searchTerm, activeChild]);

  if (!mounted || !activeChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentMonth = new Date().getMonth() + 1;
  const monthlyObjectives = getMonthlyObjectives(currentMonth);

  const getMissionProgress = (mission: Mission) => {
    if (!progress) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = mission.activities.filter(activity => 
      progress.completedActivities.includes(activity.id)
    ).length;
    const total = mission.activities.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  };

  const getSeasonName = (season: string) => {
    const seasons = {
      'spring': 'Primavera',
      'summer': 'Verão', 
      'autumn': 'Outono',
      'winter': 'Inverno'
    };
    return seasons[season as keyof typeof seasons] || season;
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Missões de Desenvolvimento
              </h1>
              <p className="text-gray-600 mt-1">
                Jornada estruturada para {activeChild.name} • {activeChild.ageGroup}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">
                {progress?.completedActivities?.length || 0} atividades
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Objetivos Mensais */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Objetivos de {getMonthName(currentMonth)}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthlyObjectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-purple-800 text-sm">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar missões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Mês */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Todos os meses</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {getMonthName(i + 1)}
                </option>
              ))}
            </select>

            {/* Filtro por Estação */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as estações</option>
              <option value="spring">Primavera</option>
              <option value="summer">Verão</option>
              <option value="autumn">Outono</option>
              <option value="winter">Inverno</option>
            </select>
          </div>
        </div>

        {/* Lista de Missões */}
        <div className="space-y-6">
          {filteredMissions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma missão encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros para ver mais missões disponíveis.
              </p>
            </div>
          ) : (
            filteredMissions.map((mission) => {
              const missionProgress = getMissionProgress(mission);
              
              return (
                <div key={mission.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header da Missão */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                              Semana {mission.week}
                            </span>
                          </div>
                          {mission.month && (
                            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-green-700">
                                {getMonthName(mission.month)}
                              </span>
                            </div>
                          )}
                          {mission.season && (
                            <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-orange-700">
                                {getSeasonName(mission.season)}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {mission.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{mission.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{mission.activities.length} atividades</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {mission.activities.reduce((acc, act) => acc + act.time, 0)} min total
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{mission.theme}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-gray-900">
                            {missionProgress.completed}/{missionProgress.total}
                          </span>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${missionProgress.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round(missionProgress.percentage)}% completo
                        </p>
                      </div>
                    </div>

                    {/* Preview das Atividades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {mission.activities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {activity.time} min
                            </span>
                            {progress?.completedActivities?.includes(activity.id) && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {mission.activities.length > 3 && (
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                          <span className="text-sm text-gray-600">
                            +{mission.activities.length - 3} atividades
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botão Ver Detalhes */}
                    <Link
                      href={`/missions/${mission.id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      <span>Ver Missão Completa</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Estatísticas Gerais */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Progresso Geral
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {filteredMissions.length}
              </div>
              <div className="text-sm text-gray-600">Missões Disponíveis</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {filteredMissions.filter(m => getMissionProgress(m).percentage === 100).length}
              </div>
              <div className="text-sm text-gray-600">Missões Completas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {filteredMissions.reduce((acc, m) => acc + m.activities.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total de Atividades</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {progress?.completedActivities?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Atividades Concluídas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}