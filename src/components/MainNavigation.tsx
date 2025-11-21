'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Crown, 
  Star,
  Home,
  BookOpen,
  BarChart3,
  ShoppingBag,
  Users,
  Baby,
  Plus,
  ChevronDown
} from 'lucide-react';
import { 
  getParentProfile, 
  getActiveChild, 
  switchActiveChild,
  ParentProfile,
  ChildProfile 
} from '@/lib/data';

export default function MainNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChildrenMenu, setShowChildrenMenu] = useState(false);
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [userPlan, setUserPlan] = useState('free');
  const [mounted, setMounted] = useState(false);

  // Páginas onde não mostrar a navegação
  const hideNavigation = ['/auth', '/onboarding'].includes(pathname);

  useEffect(() => {
    setMounted(true);
    if (hideNavigation) return;

    const parent = getParentProfile();
    const child = getActiveChild();
    const plan = typeof window !== 'undefined' ? localStorage.getItem('userPlan') || 'free' : 'free';
    
    setParentProfile(parent);
    setActiveChild(child);
    setUserPlan(plan);
  }, [pathname, hideNavigation]);

  const handleSignOut = async () => {
    if (typeof window === 'undefined') return;
    
    // Limpar localStorage
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userPlan');
    localStorage.removeItem('childProfile');
    localStorage.removeItem('progress');
    localStorage.removeItem('parentProfile');
    localStorage.removeItem('onboardingCompleted');
    
    // Redirecionar para página de autenticação
    router.push('/auth');
  };

  const handleSwitchChild = (childId: string) => {
    switchActiveChild(childId);
    const child = parentProfile?.children.find(c => c.id === childId);
    if (child) {
      setActiveChild(child);
    }
    setShowChildrenMenu(false);
    setIsMenuOpen(false);
    
    // Recarregar a página para atualizar os dados
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const getUserData = () => {
    if (typeof window === 'undefined') {
      return {
        name: 'Usuário',
        email: '',
        image: null
      };
    }
    
    return {
      name: localStorage.getItem('userName') || 'Usuário',
      email: localStorage.getItem('userEmail') || '',
      image: localStorage.getItem('userImage') || null
    };
  };

  if (!mounted || hideNavigation) return null;

  const userData = getUserData();
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('userAuthenticated') : null;

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Header Principal - Otimizado para Mobile */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo e Nome - Responsivo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9de3e442-281e-4f62-8b95-cd94a151e2b6.png" 
                alt="IsaLabs Logo" 
                className="h-6 sm:h-8 w-auto flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">IsaLabs</h1>
                {activeChild && (
                  <p className="text-xs text-gray-600 truncate">
                    {activeChild.name} • {Math.floor((new Date().getTime() - new Date(activeChild.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} anos
                  </p>
                )}
              </div>
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link 
                href="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  pathname === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                Início
              </Link>
              
              <Link 
                href="/missions" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  pathname === '/missions' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Missões
              </Link>
              
              <Link 
                href="/progress" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  pathname === '/progress' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Progresso
              </Link>
              
              <Link 
                href="/recommendations" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  pathname === '/recommendations' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Produtos
              </Link>
            </nav>

            {/* Área do Usuário Desktop */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {/* Seletor de Filhos */}
              {parentProfile && parentProfile.children.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowChildrenMenu(!showChildrenMenu)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Baby className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate max-w-20 sm:max-w-none">{activeChild?.name || 'Selecionar'}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </button>
                  
                  {showChildrenMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Meus Filhos</p>
                      </div>
                      
                      {parentProfile.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleSwitchChild(child.id!)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                            child.id === parentProfile.activeChildId ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Baby className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{child.name}</p>
                            <p className="text-xs text-gray-600">
                              {Math.floor((new Date().getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} anos
                            </p>
                          </div>
                          {child.id === parentProfile.activeChildId && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </button>
                      ))}
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowChildrenMenu(false)}
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Filho
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Badge do Plano - Responsivo */}
              <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                userPlan === 'premium' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {userPlan === 'premium' ? <Crown className="w-3 sm:w-4 h-3 sm:h-4" /> : <Star className="w-3 sm:w-4 h-3 sm:h-4" />}
                <span className="font-semibold hidden sm:inline">
                  {userPlan === 'premium' ? 'Premium' : 'Gratuito'}
                </span>
              </div>

              {/* Menu do Usuário */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {userData.image ? (
                    <img
                      src={userData.image}
                      alt="Foto do perfil"
                      className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                    </div>
                  )}
                  <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 text-gray-600" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 truncate">{userData.name}</p>
                      <p className="text-sm text-gray-600 truncate">{userData.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Configurações
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Mobile - Melhorado */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay - Melhorado */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-full max-w-sm h-full shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt="Foto do perfil"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{userData.name}</p>
                  <p className="text-sm text-gray-600 truncate">{userData.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-manipulation ${
                  pathname === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Início</span>
              </Link>
              
              <Link
                href="/missions"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-manipulation ${
                  pathname === '/missions' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Missões</span>
              </Link>
              
              <Link
                href="/progress"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-manipulation ${
                  pathname === '/progress' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Progresso</span>
              </Link>
              
              <Link
                href="/recommendations"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-manipulation ${
                  pathname === '/recommendations' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Produtos</span>
              </Link>

              {/* Seleção de Filhos Mobile */}
              {parentProfile && parentProfile.children.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-3 px-3">Meus Filhos</p>
                  <div className="space-y-1">
                    {parentProfile.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleSwitchChild(child.id!)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-manipulation ${
                          child.id === parentProfile.activeChildId 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <Baby className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <span className="font-medium truncate block">{child.name}</span>
                          <span className="text-xs text-gray-600">
                            {Math.floor((new Date().getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} anos
                          </span>
                        </div>
                        {child.id === parentProfile.activeChildId && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Meu Perfil</span>
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configurações</span>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors touch-manipulation"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Overlay para fechar menus */}
      {(showChildrenMenu && !isMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowChildrenMenu(false)}
        />
      )}
    </>
  );
}