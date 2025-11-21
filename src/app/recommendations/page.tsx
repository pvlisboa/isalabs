'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Filter, 
  Star, 
  ExternalLink,
  Book,
  Gamepad2,
  Palette,
  Music,
  Baby,
  Heart
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'books' | 'toys' | 'games' | 'art' | 'music' | 'educational';
  ageRange: string;
  price: string;
  rating: number;
  imageUrl: string;
  affiliateLink: string; // Para links de afiliados
  benefits: string[];
}

const products: Product[] = [
  {
    id: 'book-1',
    name: 'Livro Interativo - Cores e Formas',
    description: 'Livro educativo com texturas e sons para explorar cores e formas geométricas.',
    category: 'books',
    ageRange: '1-3 anos',
    price: 'R$ 29,90',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Desenvolve percepção visual', 'Estimula tato', 'Vocabulário de cores']
  },
  {
    id: 'toy-1',
    name: 'Blocos de Encaixe Montessori',
    description: 'Conjunto de blocos de madeira para desenvolver coordenação motora e raciocínio lógico.',
    category: 'toys',
    ageRange: '2-5 anos',
    price: 'R$ 89,90',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Coordenação motora fina', 'Raciocínio lógico', 'Concentração']
  },
  {
    id: 'art-1',
    name: 'Kit de Pintura Lavável',
    description: 'Tintas atóxicas e laváveis com pincéis especiais para pequenos artistas.',
    category: 'art',
    ageRange: '2-5 anos',
    price: 'R$ 45,90',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Criatividade', 'Expressão artística', 'Coordenação motora']
  },
  {
    id: 'music-1',
    name: 'Instrumentos Musicais Infantis',
    description: 'Conjunto com xilofone, chocalhos e pandeiro para iniciação musical.',
    category: 'music',
    ageRange: '1-4 anos',
    price: 'R$ 67,90',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Percepção auditiva', 'Ritmo', 'Coordenação motora']
  },
  {
    id: 'educational-1',
    name: 'Quebra-Cabeça Alfabeto',
    description: 'Quebra-cabeça educativo com letras do alfabeto e figuras correspondentes.',
    category: 'educational',
    ageRange: '3-5 anos',
    price: 'R$ 39,90',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Alfabetização', 'Coordenação motora', 'Memória visual']
  },
  {
    id: 'book-2',
    name: 'Coleção Histórias para Dormir',
    description: 'Conjunto de 5 livros com histórias curtas e ilustrações suaves para a hora do sono.',
    category: 'books',
    ageRange: '2-5 anos',
    price: 'R$ 79,90',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Rotina do sono', 'Imaginação', 'Vínculo familiar']
  },
  {
    id: 'toy-2',
    name: 'Brinquedo de Empilhar Arco-íris',
    description: 'Torre de anéis coloridos para empilhar, desenvolve coordenação e reconhecimento de cores.',
    category: 'toys',
    ageRange: '1-3 anos',
    price: 'R$ 54,90',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Coordenação motora', 'Cores', 'Causa e efeito']
  },
  {
    id: 'games-1',
    name: 'Jogo da Memória Animais',
    description: 'Jogo educativo com cartas grandes e ilustrações de animais para desenvolver memória.',
    category: 'games',
    ageRange: '3-5 anos',
    price: 'R$ 24,90',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    affiliateLink: '#',
    benefits: ['Memória', 'Concentração', 'Vocabulário de animais']
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: Heart },
  { id: 'books', name: 'Livros', icon: Book },
  { id: 'toys', name: 'Brinquedos', icon: Baby },
  { id: 'games', name: 'Jogos', icon: Gamepad2 },
  { id: 'art', name: 'Arte', icon: Palette },
  { id: 'music', name: 'Música', icon: Music },
  { id: 'educational', name: 'Educativo', icon: Star }
];

const ageRanges = [
  { id: 'all', name: 'Todas as idades' },
  { id: '1-2', name: '1-2 anos' },
  { id: '2-3', name: '2-3 anos' },
  { id: '3-4', name: '3-4 anos' },
  { id: '4-5', name: '4-5 anos' }
];

export default function RecommendationsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const ageMatch = selectedAgeRange === 'all' || product.ageRange.includes(selectedAgeRange.replace('-', '-'));
    return categoryMatch && ageMatch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return Heart;
    return category.icon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
              <h1 className="text-xl font-bold text-gray-900">Produtos Recomendados</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Filtrar Produtos</h3>
            
            {/* Categorias */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Categoria</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-700 border-2 border-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Faixa Etária */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Faixa Etária</h4>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedAgeRange(range.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedAgeRange === range.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Introdução */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Produtos Selecionados para o Desenvolvimento Infantil
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra produtos cuidadosamente selecionados que complementam as atividades do IsaLabs 
            e apoiam o desenvolvimento saudável da sua criança.
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const IconComponent = getCategoryIcon(product.category);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem do produto */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {product.ageRange}
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Benefícios */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Benefícios:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.benefits.slice(0, 2).map((benefit, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                      {product.benefits.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{product.benefits.length - 2} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preço e botão */}
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-green-600">
                      {product.price}
                    </div>
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Ver Produto
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensagem quando não há produtos */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar produtos adequados.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            💡 Sobre nossas recomendações
          </h3>
          <p className="text-yellow-700 text-sm">
            Os produtos recomendados foram selecionados com base em critérios educacionais e de desenvolvimento infantil. 
            Alguns links podem conter códigos de afiliação, que nos ajudam a manter o IsaLabs gratuito. 
            Sempre consulte as especificações do produto e a adequação para a idade da sua criança antes da compra.
          </p>
        </div>
      </div>
    </div>
  );
}