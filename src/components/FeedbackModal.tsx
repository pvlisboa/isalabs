'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Star, MessageCircle, Gift } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string; showUpgrade: boolean }) => void;
  daysInTrial: number;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, daysInTrial }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ rating, comment, showUpgrade });
    onClose();
  };

  const getFeedbackPrompt = () => {
    if (daysInTrial <= 2) {
      return {
        title: '💝 Como está sendo a experiência?',
        subtitle: 'Seu trial está quase acabando, queremos saber sua opinião!',
        emoji: '🎯'
      };
    } else if (daysInTrial <= 4) {
      return {
        title: '⭐ Conte-nos sua experiência!',
        subtitle: 'Como tem sido usar o IsaLabs com seu pequeno?',
        emoji: '🌟'
      };
    } else {
      return {
        title: '💬 Que tal nos contar como está sendo?',
        subtitle: 'Adoraríamos saber sua opinião sobre as atividades!',
        emoji: '💕'
      };
    }
  };

  const prompt = getFeedbackPrompt();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="relative p-6 text-center bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-4xl mb-3">{prompt.emoji}</div>
          <h2 className="text-xl font-bold mb-1">{prompt.title}</h2>
          <p className="text-blue-100 text-sm">{prompt.subtitle}</p>
        </div>

        <div className="p-6">
          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">
              Como você avalia a experiência até agora?
            </h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-all ${
                    rating >= star
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  <Star className="w-8 h-8" fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 5 && '🤩 Incrível!'}
                {rating === 4 && '😊 Muito bom!'}
                {rating === 3 && '🙂 Bom!'}
                {rating === 2 && '😐 Pode melhorar'}
                {rating === 1 && '😞 Não gostou?'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-900 mb-2">
              Conte-nos mais sobre sua experiência:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="O que você mais gostou? Há algo que podemos melhorar?"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Upgrade Suggestion */}
          {(rating >= 4 || daysInTrial <= 2) && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-1">
                    Que tal continuar essa jornada?
                  </h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Com o plano Premium, você terá acesso a mais de 100 atividades exclusivas 
                    e relatórios detalhados do desenvolvimento!
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showUpgrade}
                      onChange={(e) => setShowUpgrade(e.target.checked)}
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-purple-800">
                      Quero saber mais sobre o plano Premium
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Enviar Feedback
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 font-medium py-2 hover:text-gray-800 transition-colors"
            >
              Talvez depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}