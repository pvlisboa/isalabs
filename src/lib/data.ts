// Tipos de dados
export interface ChildProfile {
  id?: string;
  name: string;
  birthDate: string;
  ageInMonths: number;
  ageGroup: string;
  interests: string[];
  specialNeeds: string;
  createdAt: string;
  parentId?: string;
}

export interface ParentProfile {
  id: string;
  email: string;
  name: string;
  children: ChildProfile[];
  activeChildId: string;
  subscriptions: Record<string, 'free' | 'premium'>;
  trialEndDate?: string;
}

export interface Progress {
  completedActivities: string[];
  level: number;
  badges: string[];
  weeklyStats: Record<string, number>;
  totalTimeSpent: number;
  avatarAccessories: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  parentTips?: string[];
  image?: string;
  time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  lineId: string;
  materials: string[];
  steps: string[];
  benefits: string[];
  isIndoorActivity?: boolean;
  month?: number;
  season?: string;
  theme?: string;
  reward?: {
    accessory: string;
    description: string;
  };
}

export interface Mission {
  id: string;
  week: number;
  title: string;
  description: string;
  activities: Activity[];
  ageGroup: string;
  month?: number;
  season?: string;
  theme?: string;
}

export interface ActivityLine {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Linhas de atividade
export const activityLines: ActivityLine[] = [
  {
    id: 'motor-skills',
    name: 'Habilidades Motoras',
    description: 'Desenvolvimento da coordenação e movimento',
    color: 'blue',
    icon: '🏃'
  },
  {
    id: 'cognitive',
    name: 'Desenvolvimento Cognitivo',
    description: 'Raciocínio, memória e resolução de problemas',
    color: 'purple',
    icon: '🧠'
  },
  {
    id: 'language',
    name: 'Linguagem e Comunicação',
    description: 'Fala, vocabulário e expressão',
    color: 'green',
    icon: '💬'
  },
  {
    id: 'social',
    name: 'Habilidades Sociais',
    description: 'Interação, empatia e relacionamentos',
    color: 'pink',
    icon: '👥'
  },
  {
    id: 'creative',
    name: 'Criatividade e Arte',
    description: 'Expressão artística e imaginação',
    color: 'orange',
    icon: '🎨'
  },
  {
    id: 'emotional',
    name: 'Inteligência Emocional',
    description: 'Reconhecimento e gestão de emoções',
    color: 'yellow',
    icon: '❤️'
  }
];

// Acessórios do avatar por categoria
export const avatarAccessories = {
  'motor-skills': ['Tênis Esportivo', 'Faixa de Campeão', 'Luvas de Exercício', 'Medalha de Ouro'],
  'cognitive': ['Óculos de Sábio', 'Chapéu de Pensador', 'Livro Mágico', 'Coroa de Conhecimento'],
  'language': ['Microfone Dourado', 'Distintivo de Orador', 'Pena de Escritor', 'Megafone Colorido'],
  'social': ['Crachá de Amizade', 'Coração Brilhante', 'Distintivo de Líder', 'Abraço Virtual'],
  'creative': ['Pincel Mágico', 'Paleta de Cores', 'Coroa de Artista', 'Varinha Criativa'],
  'emotional': ['Medalhão do Coração', 'Distintivo de Empatia', 'Aura de Calma', 'Sorriso Dourado']
};

// Atividades com imagens e detalhes expandidos
const activitiesDatabase: Activity[] = [
  // Atividades 1-1.5 anos
  {
    id: 'peek-a-boo',
    title: 'Esconde-Esconde com Panos',
    description: 'Brincadeira clássica usando tecidos coloridos para desenvolver permanência do objeto',
    detailedDescription: 'Uma atividade fundamental que ensina à criança que objetos continuam existindo mesmo quando não podem ser vistos. Use panos coloridos e macios para cobrir o rosto ou brinquedos, criando momentos de surpresa e alegria.',
    parentTips: [
      'Use panos de texturas diferentes para estimular o tato',
      'Varie a velocidade - às vezes rápido, às vezes devagar',
      'Se a criança parecer assustada, mantenha parte do rosto visível',
      'Celebre cada "descoberta" com entusiasmo'
    ],
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    time: 10,
    difficulty: 'easy',
    ageGroup: '1-1.5 anos',
    lineId: 'cognitive',
    materials: ['Panos coloridos', 'Tecidos de texturas diferentes'],
    steps: [
      'Sente-se em frente à criança',
      'Cubra seu rosto com o pano',
      'Diga "Cadê a mamãe/papai?"',
      'Retire o pano dizendo "Achou!"',
      'Repita variando a velocidade'
    ],
    benefits: ['Desenvolvimento da permanência do objeto', 'Fortalecimento do vínculo', 'Estimulação visual'],
    isIndoorActivity: true,
    month: 1,
    season: 'winter',
    theme: 'Descoberta',
    reward: {
      accessory: 'Óculos de Sábio',
      description: 'Parabéns! Você ajudou a desenvolver o raciocínio da criança!'
    }
  },
  {
    id: 'texture-exploration',
    title: 'Exploração de Texturas',
    description: 'Caixa sensorial com diferentes materiais para estimular o tato',
    detailedDescription: 'Crie uma experiência sensorial rica oferecendo diferentes texturas para a criança explorar. Esta atividade desenvolve a discriminação tátil e a curiosidade natural.',
    parentTips: [
      'Supervisione sempre para evitar que leve objetos pequenos à boca',
      'Descreva as texturas: "macio", "áspero", "liso"',
      'Deixe a criança explorar no seu próprio ritmo',
      'Observe as reações e prefere texturas da criança'
    ],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    time: 15,
    difficulty: 'easy',
    ageGroup: '1-1.5 anos',
    lineId: 'motor-skills',
    materials: ['Caixa grande', 'Tecidos variados', 'Esponjas', 'Objetos texturizados seguros'],
    steps: [
      'Prepare uma caixa com diferentes texturas',
      'Sente a criança confortavelmente',
      'Apresente um material por vez',
      'Deixe explorar livremente',
      'Descreva as sensações'
    ],
    benefits: ['Desenvolvimento sensorial', 'Coordenação motora fina', 'Vocabulário tátil'],
    isIndoorActivity: true,
    month: 2,
    season: 'winter',
    theme: 'Sensorial',
    reward: {
      accessory: 'Luvas de Exercício',
      description: 'Suas mãozinhas estão ficando mais hábeis!'
    }
  },

  // Atividades 1.5-2 anos
  {
    id: 'color-sorting',
    title: 'Separação de Cores',
    description: 'Atividade de classificação usando objetos coloridos para desenvolver percepção visual',
    detailedDescription: 'Uma atividade fundamental para desenvolver habilidades de classificação e reconhecimento de cores. Use objetos seguros e coloridos para criar uma experiência de aprendizado divertida.',
    parentTips: [
      'Comece com apenas 2 cores para não sobrecarregar',
      'Use objetos grandes que não ofereçam risco de engasgo',
      'Celebre cada acerto, mesmo que seja por acaso',
      'Se a criança misturar as cores, não corrija imediatamente - deixe explorar'
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    time: 20,
    difficulty: 'easy',
    ageGroup: '1.5-2 anos',
    lineId: 'cognitive',
    materials: ['Objetos coloridos grandes', 'Cestas ou recipientes', 'Blocos de cores'],
    steps: [
      'Prepare recipientes para cada cor',
      'Mostre um objeto e nomeie a cor',
      'Demonstre colocando no recipiente correto',
      'Incentive a criança a tentar',
      'Elogie cada tentativa'
    ],
    benefits: ['Reconhecimento de cores', 'Habilidades de classificação', 'Coordenação motora'],
    isIndoorActivity: true,
    month: 3,
    season: 'spring',
    theme: 'Cores',
    reward: {
      accessory: 'Paleta de Cores',
      description: 'Você está aprendendo sobre as cores do mundo!'
    }
  },
  {
    id: 'simple-puzzles',
    title: 'Quebra-cabeças Simples',
    description: 'Puzzles de encaixe com formas grandes para desenvolver resolução de problemas',
    detailedDescription: 'Quebra-cabeças apropriados para a idade ajudam a desenvolver habilidades de resolução de problemas, coordenação motora fina e percepção espacial.',
    parentTips: [
      'Escolha puzzles com 2-4 peças grandes',
      'Ajude guiando a mão da criança se necessário',
      'Comemore quando conseguir encaixar uma peça',
      'Se ficar frustrada, ofereça ajuda ou mude de atividade'
    ],
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    time: 15,
    difficulty: 'medium',
    ageGroup: '1.5-2 anos',
    lineId: 'cognitive',
    materials: ['Quebra-cabeças de madeira', 'Puzzles de encaixe', 'Formas geométricas'],
    steps: [
      'Escolha um puzzle simples',
      'Retire as peças e mostre os espaços',
      'Demonstre encaixando uma peça',
      'Incentive a criança a tentar',
      'Ofereça ajuda quando necessário'
    ],
    benefits: ['Resolução de problemas', 'Coordenação motora fina', 'Percepção espacial'],
    isIndoorActivity: true,
    month: 4,
    season: 'spring',
    theme: 'Lógica',
    reward: {
      accessory: 'Chapéu de Pensador',
      description: 'Sua mente está ficando cada vez mais esperta!'
    }
  },

  // Atividades 2-3 anos
  {
    id: 'pretend-cooking',
    title: 'Cozinha de Faz de Conta',
    description: 'Brincadeira de cozinhar com utensílios seguros para desenvolver imaginação',
    detailedDescription: 'A brincadeira de faz de conta é essencial para o desenvolvimento da imaginação e habilidades sociais. Criar cenários de cozinha ajuda a criança a processar experiências do dia a dia.',
    parentTips: [
      'Use utensílios reais mas seguros (colheres de pau, tigelas plásticas)',
      'Participe da brincadeira fazendo pedidos: "Pode fazer um bolo?"',
      'Elogie a "comida" que a criança preparar',
      'Aproveite para ensinar sobre alimentos saudáveis'
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    time: 25,
    difficulty: 'medium',
    ageGroup: '2-3 anos',
    lineId: 'creative',
    materials: ['Utensílios de cozinha seguros', 'Potes e panelas', 'Alimentos de brinquedo'],
    steps: [
      'Organize os utensílios em uma área',
      'Sugira preparar uma refeição',
      'Participe fazendo pedidos',
      'Elogie as criações',
      'Brinquem de servir e comer'
    ],
    benefits: ['Desenvolvimento da imaginação', 'Habilidades sociais', 'Coordenação motora'],
    isIndoorActivity: true,
    month: 5,
    season: 'spring',
    theme: 'Imaginação',
    reward: {
      accessory: 'Pincel Mágico',
      description: 'Sua imaginação está criando mundos incríveis!'
    }
  },
  {
    id: 'story-telling',
    title: 'Contação de Histórias Interativa',
    description: 'Histórias simples com participação da criança para desenvolver linguagem',
    detailedDescription: 'Contar histórias de forma interativa estimula o desenvolvimento da linguagem, imaginação e habilidades de escuta. Encoraje a participação ativa da criança.',
    parentTips: [
      'Use livros com figuras grandes e coloridas',
      'Faça vozes diferentes para os personagens',
      'Pause para fazer perguntas: "O que você acha que vai acontecer?"',
      'Deixe a criança "ler" também, inventando a história pelas figuras'
    ],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    time: 20,
    difficulty: 'easy',
    ageGroup: '2-3 anos',
    lineId: 'language',
    materials: ['Livros infantis', 'Fantoches', 'Objetos para representar personagens'],
    steps: [
      'Escolha um livro apropriado',
      'Sente-se confortavelmente com a criança',
      'Leia usando vozes expressivas',
      'Faça perguntas sobre a história',
      'Incentive a criança a recontar'
    ],
    benefits: ['Desenvolvimento da linguagem', 'Imaginação', 'Habilidades de escuta'],
    isIndoorActivity: true,
    month: 6,
    season: 'summer',
    theme: 'Linguagem',
    reward: {
      accessory: 'Livro Mágico',
      description: 'As palavras estão se tornando suas amigas!'
    }
  },

  // Atividades 3-4 anos
  {
    id: 'emotion-cards',
    title: 'Cartas das Emoções',
    description: 'Jogo com cartas de expressões faciais para reconhecer e nomear emoções',
    detailedDescription: 'Ajudar a criança a identificar e nomear emoções é fundamental para o desenvolvimento emocional saudável. Use imagens claras e situações do cotidiano.',
    parentTips: [
      'Comece com emoções básicas: feliz, triste, bravo, assustado',
      'Relacione com situações reais: "Como você se sente quando..."',
      'Valide todas as emoções: "É normal se sentir triste às vezes"',
      'Use espelho para a criança ver suas próprias expressões'
    ],
    image: 'https://images.unsplash.com/photo-1594736797933-d0b22d3b6b4a?w=400&h=300&fit=crop',
    time: 15,
    difficulty: 'medium',
    ageGroup: '3-4 anos',
    lineId: 'emotional',
    materials: ['Cartas com expressões faciais', 'Espelho', 'Livros sobre emoções'],
    steps: [
      'Mostre uma carta de emoção',
      'Nomeie a emoção claramente',
      'Faça a expressão no espelho',
      'Pergunte quando a criança se sente assim',
      'Pratique fazendo as expressões juntos'
    ],
    benefits: ['Inteligência emocional', 'Vocabulário emocional', 'Autoconhecimento'],
    isIndoorActivity: true,
    month: 7,
    season: 'summer',
    theme: 'Emoções',
    reward: {
      accessory: 'Medalhão do Coração',
      description: 'Você está aprendendo sobre seus sentimentos!'
    }
  },
  {
    id: 'building-blocks',
    title: 'Construção com Blocos',
    description: 'Atividade de construção livre para desenvolver criatividade e coordenação',
    detailedDescription: 'Construir com blocos desenvolve habilidades espaciais, criatividade e coordenação motora. Encoraje tanto construções livres quanto seguir modelos simples.',
    parentTips: [
      'Deixe a criança construir livremente primeiro',
      'Depois sugira construir algo específico: "Vamos fazer uma torre?"',
      'Não se preocupe se desmoronar - faz parte do aprendizado',
      'Elogie o processo, não apenas o resultado'
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    time: 30,
    difficulty: 'medium',
    ageGroup: '3-4 anos',
    lineId: 'motor-skills',
    materials: ['Blocos de madeira', 'Legos grandes', 'Blocos de espuma'],
    steps: [
      'Disponibilize os blocos em uma área',
      'Deixe a criança explorar livremente',
      'Sugira construções simples',
      'Construam juntos',
      'Celebre as criações'
    ],
    benefits: ['Coordenação motora', 'Percepção espacial', 'Criatividade'],
    isIndoorActivity: true,
    month: 8,
    season: 'summer',
    theme: 'Construção',
    reward: {
      accessory: 'Faixa de Campeão',
      description: 'Suas construções estão ficando incríveis!'
    }
  },

  // Atividades 4-5 anos
  {
    id: 'science-experiments',
    title: 'Experimentos Científicos Simples',
    description: 'Experimentos seguros para despertar curiosidade científica',
    detailedDescription: 'Experimentos simples e seguros despertam a curiosidade natural da criança sobre como o mundo funciona. Sempre supervisione e explique o que está acontecendo.',
    parentTips: [
      'Escolha experimentos com materiais seguros e comestíveis',
      'Explique o que está acontecendo em linguagem simples',
      'Deixe a criança fazer previsões: "O que você acha que vai acontecer?"',
      'Repitam o experimento para confirmar os resultados'
    ],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
    time: 25,
    difficulty: 'hard',
    ageGroup: '4-5 anos',
    lineId: 'cognitive',
    materials: ['Bicarbonato de sódio', 'Vinagre', 'Corante alimentar', 'Recipientes transparentes'],
    steps: [
      'Prepare os materiais com segurança',
      'Explique o que vão fazer',
      'Deixe a criança ajudar a misturar',
      'Observem o resultado juntos',
      'Expliquem o que aconteceu'
    ],
    benefits: ['Curiosidade científica', 'Pensamento crítico', 'Observação'],
    isIndoorActivity: true,
    month: 9,
    season: 'autumn',
    theme: 'Ciência',
    reward: {
      accessory: 'Coroa de Conhecimento',
      description: 'Você está se tornando um pequeno cientista!'
    }
  },
  {
    id: 'collaborative-art',
    title: 'Arte Colaborativa',
    description: 'Projeto artístico feito em conjunto para desenvolver cooperação',
    detailedDescription: 'Criar arte em conjunto ensina sobre cooperação, compartilhamento e expressão criativa. Cada um contribui com sua parte para criar algo único.',
    parentTips: [
      'Escolha um projeto que ambos possam contribuir',
      'Não se preocupe com o resultado final - foque no processo',
      'Elogie as ideias criativas da criança',
      'Exiba a obra finalizada em local de destaque'
    ],
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    time: 35,
    difficulty: 'medium',
    ageGroup: '4-5 anos',
    lineId: 'creative',
    materials: ['Papel grande', 'Tintas', 'Pincéis', 'Materiais de colagem'],
    steps: [
      'Preparem o espaço de trabalho',
      'Decidam o tema juntos',
      'Cada um trabalha em uma parte',
      'Combinem as partes',
      'Admirem o resultado final'
    ],
    benefits: ['Cooperação', 'Expressão criativa', 'Trabalho em equipe'],
    isIndoorActivity: true,
    month: 10,
    season: 'autumn',
    theme: 'Arte',
    reward: {
      accessory: 'Coroa de Artista',
      description: 'Vocês criaram uma obra de arte incrível juntos!'
    }
  }
];

// Missões organizadas por idade
export const missions: Mission[] = [
  {
    id: 'mission-1-1.5-week1',
    week: 1,
    title: 'Descobrindo o Mundo',
    description: 'Primeiras explorações sensoriais e cognitivas',
    ageGroup: '1-1.5 anos',
    month: 1,
    season: 'winter',
    theme: 'Descoberta',
    activities: activitiesDatabase.filter(a => a.ageGroup === '1-1.5 anos').slice(0, 3)
  },
  {
    id: 'mission-1.5-2-week1',
    week: 1,
    title: 'Cores e Formas',
    description: 'Desenvolvendo percepção visual e classificação',
    ageGroup: '1.5-2 anos',
    month: 3,
    season: 'spring',
    theme: 'Cores',
    activities: activitiesDatabase.filter(a => a.ageGroup === '1.5-2 anos').slice(0, 3)
  },
  {
    id: 'mission-2-3-week1',
    week: 1,
    title: 'Imaginação em Ação',
    description: 'Brincadeiras criativas e desenvolvimento da linguagem',
    ageGroup: '2-3 anos',
    month: 5,
    season: 'spring',
    theme: 'Imaginação',
    activities: activitiesDatabase.filter(a => a.ageGroup === '2-3 anos').slice(0, 3)
  },
  {
    id: 'mission-3-4-week1',
    week: 1,
    title: 'Emoções e Construções',
    description: 'Inteligência emocional e habilidades motoras',
    ageGroup: '3-4 anos',
    month: 7,
    season: 'summer',
    theme: 'Emoções',
    activities: activitiesDatabase.filter(a => a.ageGroup === '3-4 anos').slice(0, 3)
  },
  {
    id: 'mission-4-5-week1',
    week: 1,
    title: 'Pequenos Cientistas',
    description: 'Experimentos e arte colaborativa',
    ageGroup: '4-5 anos',
    month: 9,
    season: 'autumn',
    theme: 'Ciência',
    activities: activitiesDatabase.filter(a => a.ageGroup === '4-5 anos').slice(0, 3)
  }
];

// Funções de utilidade
export function getProgress(): Progress {
  if (typeof window === 'undefined') {
    return { completedActivities: [], level: 1, badges: [], weeklyStats: {}, totalTimeSpent: 0, avatarAccessories: [] };
  }
  
  const saved = localStorage.getItem('progress');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return { completedActivities: [], level: 1, badges: [], weeklyStats: {}, totalTimeSpent: 0, avatarAccessories: [] };
}

export function saveProgress(progress: Progress): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('progress', JSON.stringify(progress));
  }
}

export function completeActivity(activityId: string): void {
  const progress = getProgress();
  if (!progress.completedActivities.includes(activityId)) {
    progress.completedActivities.push(activityId);
    
    // Encontrar a atividade para obter a recompensa
    const activity = activitiesDatabase.find(a => a.id === activityId);
    if (activity?.reward) {
      if (!progress.avatarAccessories) {
        progress.avatarAccessories = [];
      }
      if (!progress.avatarAccessories.includes(activity.reward.accessory)) {
        progress.avatarAccessories.push(activity.reward.accessory);
      }
    }
    
    // Calcular nível baseado no número de atividades completadas
    progress.level = Math.floor(progress.completedActivities.length / 5) + 1;
    
    // Adicionar badges
    if (progress.completedActivities.length === 1) {
      progress.badges.push('Primeira Atividade');
    }
    if (progress.completedActivities.length === 5) {
      progress.badges.push('Explorador Iniciante');
    }
    if (progress.completedActivities.length === 10) {
      progress.badges.push('Aventureiro');
    }
    
    saveProgress(progress);
  }
}

export function getChildProfile(): ChildProfile | null {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('childProfile');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}

export function saveChildProfile(profile: ChildProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('childProfile', JSON.stringify(profile));
  }
}

export function getParentProfile(): ParentProfile | null {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('parentProfile');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}

export function saveParentProfile(profile: ParentProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('parentProfile', JSON.stringify(profile));
  }
}

export function getActiveChild(): ChildProfile | null {
  const parent = getParentProfile();
  if (parent && parent.activeChildId) {
    return parent.children.find(c => c.id === parent.activeChildId) || null;
  }
  return getChildProfile();
}

export function switchActiveChild(childId: string): void {
  const parent = getParentProfile();
  if (parent) {
    parent.activeChildId = childId;
    saveParentProfile(parent);
    
    // Atualizar também o childProfile para compatibilidade
    const child = parent.children.find(c => c.id === childId);
    if (child) {
      saveChildProfile(child);
    }
  }
}

export function addChildToParent(child: ChildProfile): void {
  let parent = getParentProfile();
  if (!parent) {
    const userData = {
      name: localStorage.getItem('userName') || 'Usuário',
      email: localStorage.getItem('userEmail') || ''
    };
    
    parent = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      children: [],
      activeChildId: '',
      subscriptions: {}
    };
  }
  
  child.id = Date.now().toString();
  child.parentId = parent.id;
  parent.children.push(child);
  parent.subscriptions[child.id] = 'free';
  
  if (parent.children.length === 1) {
    parent.activeChildId = child.id;
  }
  
  saveParentProfile(parent);
}

export function getActivitiesForAge(ageGroup: string): Mission[] {
  return missions.filter(mission => mission.ageGroup === ageGroup);
}

export function getIndoorActivities(): Activity[] {
  return activitiesDatabase.filter(activity => activity.isIndoorActivity);
}

export function getRecommendedActivities(interests: string[], ageGroup: string): Activity[] {
  return activitiesDatabase
    .filter(activity => activity.ageGroup === ageGroup)
    .slice(0, 3);
}

export function getMonthlyObjectives(month: number): string[] {
  const objectives = {
    1: ['Desenvolver coordenação motora grossa', 'Estimular a linguagem expressiva', 'Fortalecer vínculos afetivos'],
    2: ['Aprimorar habilidades sociais', 'Desenvolver criatividade artística', 'Trabalhar inteligência emocional'],
    3: ['Estimular curiosidade científica', 'Desenvolver pensamento lógico', 'Fortalecer autonomia'],
    4: ['Aprimorar coordenação motora fina', 'Desenvolver habilidades pré-acadêmicas', 'Estimular cooperação'],
    5: ['Trabalhar resolução de problemas', 'Desenvolver expressão criativa', 'Fortalecer autoestima'],
    6: ['Estimular exploração sensorial', 'Desenvolver linguagem receptiva', 'Trabalhar paciência'],
    7: ['Aprimorar habilidades de classificação', 'Desenvolver memória', 'Estimular imaginação'],
    8: ['Trabalhar coordenação bilateral', 'Desenvolver atenção sustentada', 'Fortalecer independência'],
    9: ['Estimular raciocínio espacial', 'Desenvolver empatia', 'Trabalhar perseverança'],
    10: ['Aprimorar habilidades narrativas', 'Desenvolver autocontrole', 'Estimular liderança'],
    11: ['Trabalhar planejamento', 'Desenvolver gratidão', 'Fortalecer resiliência'],
    12: ['Estimular reflexão', 'Desenvolver generosidade', 'Celebrar conquistas']
  };
  
  return objectives[month as keyof typeof objectives] || objectives[1];
}

export function getActivitiesForMonth(month: number): Activity[] {
  return activitiesDatabase.filter(activity => activity.month === month);
}

export function getActivitiesForSeason(season: string): Activity[] {
  return activitiesDatabase.filter(activity => activity.season === season);
}

export function getActivityById(id: string): Activity | undefined {
  return activitiesDatabase.find(activity => activity.id === id);
}

export function getMissionById(id: string): Mission | undefined {
  return missions.find(mission => mission.id === id);
}