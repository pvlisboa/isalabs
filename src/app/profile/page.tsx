'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Crown,
  Star,
  Edit3,
  Camera,
  Shield,
  Bell,
  Heart,
  Award,
  BarChart3,
  ArrowLeft,
  Plus,
  Users,
  Baby
} from 'lucide-react';

interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  ageInMonths: number;
  ageGroup: string;
  interests: string[];
  specialNeeds: string;
  createdAt: string;
  parentId: string;
}

interface Progress {
  completedActivities: string[];
  level: number;
  badges: string[];
}

interface ParentProfile {
  id: string;
  email: string;
  name: string;
  children: ChildProfile[];
  activeChildId: string;
  subscriptions: Record<string, 'free' | 'premium'>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userPlan, setUserPlan] = useState('free');
  const [showChildrenMenu, setShowChildrenMenu] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildData, setNewChildData] = useState({
    name: '',
    birthDate: '',
    interests: [] as string[]
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Carregar dados do perfil e progresso
    const loadData = () => {
      try {
        const childProfile = getActiveChild() || getChildProfile();
        const userProgress = getProgress();
        const parent = getParentProfile();
        const plan = localStorage.getItem('userPlan') || 'free';

        setProfile(childProfile);
        setProgress(userProgress);
        setParentProfile(parent);
        setUserPlan(plan);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, [isClient]);

  const handleSignOut = async () => {
    if (!isClient) return;

    try {
      // Limpar localStorage
      localStorage.removeItem('userAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userImage');
      localStorage.removeItem('userPlan');
      localStorage.removeItem('childProfile');
      localStorage.removeItem('progress');
      localStorage.removeItem('parentProfile');

      // Redirecionar para página de autenticação
      router.push('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserData = () => {
    if (!isClient) return { name: 'Usuário', email: '', image: null };

    return {
      name: localStorage.getItem('userName') || 'Usuário',
      email: localStorage.getItem('userEmail') || '',
      image: localStorage.getItem('userImage') || null
    };
  };

  const getActiveChild = (): ChildProfile | null => {
    if (!isClient) return null;
    const data = localStorage.getItem('activeChild');
    return data ? JSON.parse(data) : null;
  };

  const getChildProfile = (): ChildProfile | null => {
    if (!isClient) return null;
    const data = localStorage.getItem('childProfile');
    return data ? JSON.parse(data) : null;
  };

  const getProgress = (): Progress | null => {
    if (!isClient) return null;
    const data = localStorage.getItem('progress');
    return data ? JSON.parse(data) : { completedActivities: [], level: 1, badges: [] };
  };

  const getParentProfile = (): ParentProfile | null => {
    if (!isClient) return null;
    const data = localStorage.getItem('parentProfile');
    return data ? JSON.parse(data) : null;
  };

  const saveParentProfile = (parent: ParentProfile) => {
    if (!isClient) return;
    localStorage.setItem('parentProfile', JSON.stringify(parent));
  };

  const handleAddChild = () => {
    if (!newChildData.name || !newChildData.birthDate || !isClient) return;

    const userData = getUserData();

    // Criar ou atualizar perfil do pai
    let parent = parentProfile;
    if (!parent) {
      parent = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        children: [],
        activeChildId: '',
        subscriptions: {}
      };
    }

    // Calcular idade em meses
    const birthDate = new Date(newChildData.birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 +
                       (today.getMonth() - birthDate.getMonth());

    // Determinar faixa etária
    const getAgeGroup = (months: number) => {
      if (months < 18) return '1-1.5 anos';
      if (months < 24) return '1.5-2 anos';
      if (months < 36) return '2-3 anos';
      if (months < 48) return '3-4 anos';
      return '4-5 anos';
    };

    const newChild: ChildProfile = {
      id: Date.now().toString(),
      name: newChildData.name,
      birthDate: newChildData.birthDate,
      ageInMonths,
      ageGroup: getAgeGroup(ageInMonths),
      interests: newChildData.interests,
      specialNeeds: '',
      createdAt: new Date().toISOString(),
      parentId: parent.id
    };

    parent.children.push(newChild);
    parent.subscriptions[newChild.id] = 'free';

    // Se é o primeiro filho, torna ativo
    if (parent.children.length === 1) {
      parent.activeChildId = newChild.id;
    }

    saveParentProfile(parent);
    setParentProfile(parent);

    // Se é o primeiro filho, atualizar perfil ativo
    if (parent.children.length === 1) {
      setProfile(newChild);
    }

    setShowAddChild(false);
    setNewChildData({ name: '', birthDate: '', interests: [] });
  };

  const handleSwitchChild = (childId: string) => {
    if (!isClient) return;

    const child = parentProfile?.children.find(c => c.id === childId);
    if (child) {
      localStorage.setItem('activeChild', JSON.stringify(child));
      setProfile(child);
      // Recarregar progresso para a criança específica
      setProgress(getProgress());
    }
    setShowChildrenMenu(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 +
                       (today.getMonth() - birth.getMonth());

    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    if (years === 0) return `${months} meses`;
    if (months === 0) return `${years} anos`;
    return `${years} anos e ${months} meses`;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const userData = getUserData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9de3e442-281e-4f62-8b95-cd94a151e2b6.png"
                alt="IsaLabs Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
            </div>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Informações do Usuário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card do Usuário */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {userData.image ? (
                      <img
                        src={userData.image}
                        alt="Foto do perfil"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Camera className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              </div>

              {/* Plano Atual */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  {userPlan === 'premium' ? (
                    <Crown className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <Star className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Plano {userPlan === 'premium' ? 'Premium' : 'Gratuito'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {userPlan === 'premium'
                        ? 'Acesso ilimitado a todas as atividades'
                        : '3 atividades por semana'
                      }
                    </p>
                  </div>
                </div>
                {userPlan === 'free' && (
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Upgrade
                  </button>
                )}
              </div>

              {/* Estatísticas Rápidas */}
              {progress && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{progress.completedActivities.length}</div>
                    <div className="text-sm text-blue-700">Atividades</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{progress.level}</div>
                    <div className="text-sm text-green-700">Nível</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">{progress.badges.length}</div>
                    <div className="text-sm text-yellow-700">Conquistas</div>
                  </div>
                </div>
              )}
            </div>

            {/* Gerenciamento de Filhos */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Meus Filhos
                </h3>
                <button
                  onClick={() => setShowAddChild(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Filho
                </button>
              </div>

              {/* Lista de Filhos */}
              <div className="space-y-3">
                {parentProfile?.children.map((child) => (
                  <div
                    key={child.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      child.id === parentProfile.activeChildId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSwitchChild(child.id!)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                          <Baby className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{child.name}</h4>
                          <p className="text-sm text-gray-600">{calculateAge(child.birthDate)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parentProfile.subscriptions[child.id!] === 'premium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {parentProfile.subscriptions[child.id!] === 'premium' ? 'Premium' : 'Gratuito'}
                        </div>
                        {child.id === parentProfile.activeChildId && (
                          <p className="text-xs text-blue-600 mt-1">Ativo</p>
                        )}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Baby className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum filho cadastrado ainda</p>
                    <p className="text-sm">Clique em "Adicionar Filho" para começar</p>
                  </div>
                )}
              </div>

              {/* Modal Adicionar Filho */}
              {showAddChild && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Adicionar Novo Filho</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da criança
                        </label>
                        <input
                          type="text"
                          value={newChildData.name}
                          onChange={(e) => setNewChildData({...newChildData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Digite o nome"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de nascimento
                        </label>
                        <input
                          type="date"
                          value={newChildData.birthDate}
                          onChange={(e) => setNewChildData({...newChildData, birthDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowAddChild(false)}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddChild}
                        disabled={!newChildData.name || !newChildData.birthDate}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informações da Criança Ativa */}
            {profile && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Criança Ativa: {profile.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Nome</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{profile.name}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Idade</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{calculateAge(profile.birthDate)}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Faixa Etária</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{profile.ageGroup}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Interesses</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {profile.interests.length > 0 ? profile.interests.join(', ') : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Ações e Configurações */}
          <div className="space-y-6">
            {/* Menu de Ações */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações</h3>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Meus Dados</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span>Notificações</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Shield className="w-5 h-5" />
                  <span>Privacidade</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span>Relatórios</span>
                </button>

                <hr className="my-2" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Conquistas Recentes */}
            {progress && progress.badges.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Conquistas Recentes
                </h3>

                <div className="space-y-3">
                  {progress.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-yellow-800">{badge}</span>
                    </div>
                  ))}
                </div>

                {progress.badges.length > 3 && (
                  <button className="w-full mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Ver todas as conquistas
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}