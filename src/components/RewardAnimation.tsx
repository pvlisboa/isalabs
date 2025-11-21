'use client';

import { useState, useEffect } from 'react';
import { Star, Sparkles, Crown, Trophy } from 'lucide-react';

interface RewardAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  reward: string;
  type: 'accessory' | 'badge' | 'level';
}

export default function RewardAnimation({ isVisible, onComplete, reward, type }: RewardAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'showing' | 'exiting'>('entering');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('entering');
      
      // Fase 1: Entrada (1s)
      const enterTimer = setTimeout(() => {
        setAnimationPhase('showing');
      }, 1000);

      // Fase 2: Exibição (2s)
      const showTimer = setTimeout(() => {
        setAnimationPhase('exiting');
      }, 3000);

      // Fase 3: Saída (0.5s)
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 3500);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(showTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'accessory':
        return <Crown className="w-16 h-16 text-yellow-500" />;
      case 'badge':
        return <Trophy className="w-16 h-16 text-blue-500" />;
      case 'level':
        return <Star className="w-16 h-16 text-purple-500" />;
      default:
        return <Sparkles className="w-16 h-16 text-pink-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'accessory':
        return 'Novo Acessório Desbloqueado!';
      case 'badge':
        return 'Nova Conquista!';
      case 'level':
        return 'Subiu de Nível!';
      default:
        return 'Parabéns!';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'accessory':
        return 'from-yellow-400 to-orange-500';
      case 'badge':
        return 'from-blue-400 to-purple-500';
      case 'level':
        return 'from-purple-400 to-pink-500';
      default:
        return 'from-pink-400 to-purple-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse ${
              animationPhase === 'entering' ? 'animate-bounce' : ''
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Card principal da recompensa */}
      <div
        className={`relative bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl transform transition-all duration-1000 ${
          animationPhase === 'entering'
            ? 'scale-0 rotate-180 opacity-0'
            : animationPhase === 'showing'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-110 rotate-12 opacity-0'
        }`}
      >
        {/* Brilho de fundo */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundColor()} opacity-10 rounded-3xl`} />
        
        {/* Ícone principal */}
        <div className="relative mb-6">
          <div
            className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${getBackgroundColor()} flex items-center justify-center shadow-lg transform transition-transform duration-500 ${
              animationPhase === 'showing' ? 'animate-pulse scale-110' : ''
            }`}
          >
            {getIcon()}
          </div>
          
          {/* Efeito de brilho */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${getBackgroundColor()} opacity-20 animate-ping ${
                animationPhase === 'showing' ? 'block' : 'hidden'
              }`}
            />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getTitle()}
        </h2>

        {/* Descrição da recompensa */}
        <div className={`inline-block px-4 py-2 bg-gradient-to-r ${getBackgroundColor()} text-white rounded-full text-lg font-semibold mb-4`}>
          {reward}
        </div>

        {/* Mensagem motivacional */}
        <p className="text-gray-600 text-sm">
          Continue assim! Você está indo muito bem! 🎉
        </p>

        {/* Estrelas decorativas */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Star className="w-5 h-5 text-pink-400 animate-bounce" />
        </div>
        <div className="absolute top-4 -left-3">
          <Star className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
      </div>

      {/* Avatar chegando (para acessórios) */}
      {type === 'accessory' && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div
            className={`transition-all duration-2000 ${
              animationPhase === 'entering'
                ? 'translate-y-20 opacity-0'
                : animationPhase === 'showing'
                ? 'translate-y-0 opacity-100'
                : 'translate-y-0 opacity-100'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
              👶
            </div>
            <div className="text-center mt-2 text-white text-sm font-medium">
              Seu avatar ganhou um novo acessório!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}