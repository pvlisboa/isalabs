'use client';

import { useState } from 'react';
import { X, Crown, Check, Zap, Star, Shield, Heart } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
  trigger: 'trial_ending' | 'activity_limit' | 'reports_blocked' | 'feedback_prompt';
}

export default function PaymentModal({ isOpen, onClose, onUpgrade, trigger }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (trigger) {
      case 'trial_ending':
        return {
          title: '⏰ Seu trial está acabando!',
          subtitle: 'Continue aproveitando todas as funcionalidades',
          highlight: 'Não perca o progresso do(a) seu(sua) pequeno(a)!'
        };
      case 'activity_limit':
        return {
          title: '🔒 Limite de atividades atingido',
          subtitle: 'Desbloqueie atividades ilimitadas',
          highlight: 'Após os 7 dias gratuitos, você terá acesso a apenas 1 atividade a cada 15 dias!'
        };
      case 'reports_blocked':
        return {
          title: '📊 Relatórios Premium',
          subtitle: 'Acompanhe o desenvolvimento detalhado',
          highlight: 'Insights valiosos sobre o progresso!'
        };
      case 'feedback_prompt':
        return {
          title: '💝 Como está sendo a experiência?',
          subtitle: 'Queremos saber sua opinião',
          highlight: 'E que tal desbloquear ainda mais recursos?'
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 text-center bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <Crown className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
          <h2 className="text-xl font-bold mb-1">{content.title}</h2>
          <p className="text-purple-100 text-sm">{content.subtitle}</p>
          <div className="mt-3 bg-white/20 rounded-lg p-2">
            <p className="text-sm font-medium">{content.highlight}</p>
          </div>
        </div>

        {/* Feedback Section (apenas para feedback_prompt) */}
        {trigger === 'feedback_prompt' && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Como está sendo a experiência?</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-2 rounded-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                >
                  <Star className="w-6 h-6 mx-auto text-yellow-400" />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Conte-nos o que você achou até agora..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Plans */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Escolha seu plano Premium
          </h3>
          
          <div className="space-y-3 mb-6">
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Mensal</h4>
                  <p className="text-sm text-gray-600">Flexibilidade total</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">R$ 29,90</div>
                  <div className="text-sm text-gray-600">/mês</div>
                </div>
              </div>
            </div>

            {/* Yearly Plan */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative ${
                selectedPlan === 'yearly'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                40% OFF
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Anual</h4>
                  <p className="text-sm text-gray-600">Melhor custo-benefício</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">R$ 17,90</div>
                  <div className="text-sm text-gray-600">/mês</div>
                  <div className="text-xs text-green-600 font-medium">
                    R$ 214,80/ano
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              O que você ganha:
            </h4>
            <div className="space-y-2">
              {[
                'Atividades ilimitadas para todas as idades',
                'Relatórios detalhados de desenvolvimento',
                'Acesso a mais de 100 atividades exclusivas',
                'Suporte prioritário',
                'Novos conteúdos toda semana'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
            <Shield className="w-4 h-4" />
            <span>Pagamento 100% seguro • Cancele quando quiser</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onUpgrade(selectedPlan)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Fazer Upgrade - {selectedPlan === 'monthly' ? 'R$ 29,90/mês' : 'R$ 17,90/mês'}
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 font-medium py-2 hover:text-gray-800 transition-colors"
            >
              {trigger === 'feedback_prompt' ? 'Enviar Feedback' : 'Continuar Gratuito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}