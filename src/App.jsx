import React, { useState, useEffect, useMemo } from 'react';
// REMOVIDOS: Imports do Firebase
import { 
  Dumbbell, Timer, CheckCircle2, Play, Plus, Search, ChevronRight, 
  Info, X, ArrowLeft, Share2, Eye, EyeOff, Save, Trash2, 
  Check, Edit3, TrendingUp, BarChart3, Flame, 
  User, LogOut, Mail, Lock, ShieldCheck, HeartPulse, Target, Footprints,
  Download
} from 'lucide-react';

// --- MOCK CONSTANTS (Dados estáticos para teste) ---
const TRAINING_METHODS = {
  'drop-set': { name: 'Drop Set', desc: 'Série Reduzida: Após falhar em uma série, reduzir imediatamente o peso e continuar até nova falha.' },
  'rest-pause': { name: 'Rest-Pause', desc: 'Fazer uma série até perto da falha, descansar brevemente (10-30s), e continuar para mais repetições.' },
  'biset': { name: 'Biset', desc: 'Dois exercícios para grupos musculares opostos executados sem pausa (ex.: peito e costas).' },
  'triset': { name: 'Triset', desc: 'Três exercícios executados consecutivamente sem pausa.' },
  'superserie': { name: 'Supersérie', desc: 'Dois exercícios executados consecutivamente sem pausa.' },
  'myo-reps': { name: 'Myo-Reps', desc: 'Protocolo de clusters de repetições com pausas muito curtas.' },
  'cluster-set': { name: 'Cluster Set', desc: 'Série com pequenas pausas intra-série.' },
  'fst-7': { name: 'FST-7', desc: '7 séries finais com descansos curtos (30-45s) para alongar a fáscia.' },
  '5x5': { name: '5×5', desc: 'Foco em força: 5 séries de 5 repetições com carga pesada.' },
  'piramide-crescente': { name: 'Pirâmide Crescente', desc: 'Aumentar carga, diminuir reps.' },
  'piramide-decrescente': { name: 'Pirâmide Decrescente', desc: 'Diminuir carga após falha, continuar série.' }
};

const EXERCISE_CATEGORIES = [
  { id: 'Peito', label: 'Peito', icon: <Target size={24} />, color: 'bg-blue-600' },
  { id: 'Pernas', label: 'Pernas', icon: <Footprints size={24} />, color: 'bg-emerald-600' },
  { id: 'Costas', label: 'Costas', icon: <Dumbbell size={24} />, color: 'bg-orange-600' },
  { id: 'Cardio', label: 'Cardio', icon: <HeartPulse size={24} />, color: 'bg-rose-600' },
  { id: 'Full Body', label: 'Full Body', icon: <Flame size={24} />, color: 'bg-purple-600' },
  { id: 'Braços', label: 'Braços', icon: <Dumbbell size={24} />, color: 'bg-cyan-600' },
  { id: 'Ombros', label: 'Ombros', icon: <Target size={24} />, color: 'bg-amber-600' },
];

const EXERCISE_LIBRARY = [
  // --- PEITO ---
  { 
    id: 'chest_1', 
    name: 'Supino Reto com Barra', 
    category: 'Musculação',
    target: 'Peito', 
    instructions: 'Deite no banco, pés firmes no chão. Desça a barra controlada até tocar o peito e empurre.', 
    video: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' 
  },
  { 
    id: 'chest_2', 
    name: 'Supino Inclinado com Halteres', 
    category: 'Musculação', 
    target: 'Peito', 
    instructions: 'Banco a 45º. Suba os halteres alinhados com o peito superior e desça controlando.', 
    video: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' 
  },
  { 
    id: 'chest_3', 
    name: 'Crucifixo na Máquina (Peck Deck)', 
    category: 'Musculação', 
    target: 'Peito', 
    instructions: 'Mantenha os cotovelos na altura dos ombros e feche os braços até as mãos se tocarem.', 
    video: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' 
  },
  { 
    id: 'chest_4', 
    name: 'Flexão de Braço', 
    category: 'Calistenia', 
    target: 'Peito', 
    instructions: 'Mãos na largura dos ombros, corpo pranchado. Desça até o peito quase tocar o chão.', 
    video: 'https://images.unsplash.com/photo-1598971639058-211a73287750?w=400&h=300&fit=crop' 
  },
  { 
    id: 'chest_5', 
    name: 'Crossover Polia Alta', 
    category: 'Musculação', 
    target: 'Peito', 
    instructions: 'Incline o tronco levemente. Puxe os cabos em direção ao centro do abdômen inferior.', 
    video: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' 
  },

  // --- PERNAS ---
  { 
    id: 'legs_1', 
    name: 'Agachamento Livre', 
    category: 'Musculação', 
    target: 'Pernas', 
    instructions: 'Pés na largura dos ombros. Desça o quadril para trás e para baixo, mantendo a coluna reta.', 
    video: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=400&h=300&fit=crop' 
  },
  { 
    id: 'legs_2', 
    name: 'Leg Press 45º', 
    category: 'Musculação', 
    target: 'Pernas', 
    instructions: 'Empurre a plataforma com os calcanhares. Não estenda totalmente os joelhos no topo.', 
    video: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop' 
  },
  { 
    id: 'legs_3', 
    name: 'Cadeira Extensora', 
    category: 'Musculação', 
    target: 'Pernas', 
    instructions: 'Estenda as pernas contraindo o quadríceps no topo. Segure 1s antes de descer.', 
    video: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&h=300&fit=crop' 
  },
  { 
    id: 'legs_4', 
    name: 'Stiff com Barra', 
    category: 'Musculação', 
    target: 'Pernas', 
    instructions: 'Joelhos semi-flexionados. Desça a barra rente à perna, jogando o quadril para trás.', 
    video: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&h=300&fit=crop' 
  },
  { 
    id: 'legs_5', 
    name: 'Elevação de Panturrilha em Pé', 
    category: 'Musculação', 
    target: 'Pernas', 
    instructions: 'Na ponta dos pés, suba o máximo que conseguir e desça alongando bem o calcanhar.', 
    video: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' 
  },

  // --- COSTAS ---
  { 
    id: 'back_1', 
    name: 'Puxada Alta Frontal', 
    category: 'Musculação', 
    target: 'Costas', 
    instructions: 'Puxe a barra em direção ao peito superior, jogando os cotovelos para baixo.', 
    video: 'https://images.unsplash.com/photo-1603287681836-e5452e4d6f6e?w=400&h=300&fit=crop' 
  },
  { 
    id: 'back_2', 
    name: 'Remada Curvada com Barra', 
    category: 'Musculação', 
    target: 'Costas', 
    instructions: 'Tronco inclinado, coluna reta. Puxe a barra em direção ao umbigo.', 
    video: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop' 
  },
  { 
    id: 'back_3', 
    name: 'Remada Baixa (Triângulo)', 
    category: 'Musculação', 
    target: 'Costas', 
    instructions: 'Sentado, puxe o triângulo até o abdômen mantendo o peito estufado.', 
    video: 'https://images.unsplash.com/photo-1598532163257-5264875b223a?w=400&h=300&fit=crop' 
  },
  { 
    id: 'back_4', 
    name: 'Serrote Unilateral', 
    category: 'Musculação', 
    target: 'Costas', 
    instructions: 'Apoie joelho e mão no banco. Puxe o halter rente ao corpo focando na dorsal.', 
    video: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop' 
  },
  { 
    id: 'back_5', 
    name: 'Barra Fixa (Pull-up)', 
    category: 'Calistenia', 
    target: 'Costas', 
    instructions: 'Pendure-se na barra e suba até o queixo ultrapassar a linha das mãos.', 
    video: 'https://images.unsplash.com/photo-1598971639058-211a73287750?w=400&h=300&fit=crop' 
  },

  // --- BRAÇOS (Bíceps/Tríceps) ---
  { 
    id: 'arms_1', 
    name: 'Rosca Direta com Barra', 
    category: 'Musculação', 
    target: 'Braços', 
    instructions: 'Cotovelos fixos ao lado do corpo. Suba a barra até o peito e desça devagar.', 
    video: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' 
  },
  { 
    id: 'arms_2', 
    name: 'Tríceps Pulley (Corda)', 
    category: 'Musculação', 
    target: 'Braços', 
    instructions: 'Puxe a corda para baixo, abrindo as mãos no final do movimento para contrair o tríceps.', 
    video: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop' 
  },
  { 
    id: 'arms_3', 
    name: 'Rosca Martelo', 
    category: 'Musculação', 
    target: 'Braços', 
    instructions: 'Halteres na posição neutra (em pé). Suba alternadamente ou simultâneo.', 
    video: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' 
  },
  { 
    id: 'arms_4', 
    name: 'Tríceps Testa', 
    category: 'Musculação', 
    target: 'Braços', 
    instructions: 'Deitado, desça a barra W em direção à testa dobrando apenas os cotovelos.', 
    video: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' 
  },
  { 
    id: 'arms_5', 
    name: 'Rosca Scott', 
    category: 'Musculação', 
    target: 'Braços', 
    instructions: 'Apoie os braços no banco Scott. Suba a barra sem tirar o tríceps do apoio.', 
    video: 'https://images.unsplash.com/photo-1598532163257-5264875b223a?w=400&h=300&fit=crop' 
  },

  // --- OMBROS ---
  { 
    id: 'shoulders_1', 
    name: 'Desenvolvimento com Halteres', 
    category: 'Musculação', 
    target: 'Ombros', 
    instructions: 'Sentado, empurre os halteres acima da cabeça até estender os braços.', 
    video: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop' 
  },
  { 
    id: 'shoulders_2', 
    name: 'Elevação Lateral', 
    category: 'Musculação', 
    target: 'Ombros', 
    instructions: 'Em pé, suba os braços lateralmente até a altura dos ombros. Cotovelos levemente flexionados.', 
    video: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop' 
  },
  { 
    id: 'shoulders_3', 
    name: 'Elevação Frontal', 
    category: 'Musculação', 
    target: 'Ombros', 
    instructions: 'Levante o peso à frente do corpo até a linha dos olhos, sem balançar o tronco.', 
    video: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' 
  },
  { 
    id: 'shoulders_4', 
    name: 'Crucifixo Inverso', 
    category: 'Musculação', 
    target: 'Ombros', 
    instructions: 'Incline o tronco para frente. Abra os braços focando na parte de trás do ombro.', 
    video: 'https://images.unsplash.com/photo-1598532163257-5264875b223a?w=400&h=300&fit=crop' 
  },
  { 
    id: 'shoulders_5', 
    name: 'Encolhimento de Ombros', 
    category: 'Musculação', 
    target: 'Ombros', 
    instructions: 'Segure pesos pesados ao lado do corpo. Suba os ombros em direção às orelhas.', 
    video: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' 
  },

  // --- CARDIO ---
  { 
    id: 'cardio_1', 
    name: 'Corrida na Esteira', 
    category: 'Cardio', 
    target: 'Cardio', 
    instructions: 'Mantenha um ritmo constante ou intercale tiros de velocidade com caminhada.', 
    video: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop' 
  },
  { 
    id: 'cardio_2', 
    name: 'Bicicleta Ergométrica', 
    category: 'Cardio', 
    target: 'Cardio', 
    instructions: 'Ajuste o banco na altura do quadril. Pedale mantendo a coluna estável.', 
    video: 'https://images.unsplash.com/photo-1543975177-8004945e8211?w=400&h=300&fit=crop' 
  },
  { 
    id: 'cardio_3', 
    name: 'Elíptico', 
    category: 'Cardio', 
    target: 'Cardio', 
    instructions: 'Use os braços e pernas em sincronia. Ótimo para baixo impacto nas articulações.', 
    video: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop' 
  },
  { 
    id: 'cardio_4', 
    name: 'Pular Corda', 
    category: 'Cardio', 
    target: 'Cardio', 
    instructions: 'Saltos curtos e rápidos na ponta dos pés. Gire a corda usando os punhos.', 
    video: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&h=300&fit=crop' 
  },
  { 
    id: 'cardio_5', 
    name: 'Polichinelos', 
    category: 'Cardio', 
    target: 'Cardio', 
    instructions: 'Salte abrindo pernas e braços simultaneamente. Mantenha o ritmo acelerado.', 
    video: 'https://images.unsplash.com/photo-1603287681836-e5452e4d6f6e?w=400&h=300&fit=crop' 
  },

  // --- FULL BODY ---
  { 
    id: 'full_1', 
    name: 'Burpees Completos', 
    category: 'Cross Training', 
    target: 'Full Body', 
    instructions: 'Agache, faça uma flexão, suba e termine com um salto vertical.', 
    video: 'https://images.unsplash.com/photo-1543975177-8004945e8211?w=400&h=300&fit=crop' 
  },
  { 
    id: 'full_2', 
    name: 'Kettlebell Swing', 
    category: 'Cross Training', 
    target: 'Full Body', 
    instructions: 'Segure o peso, flexione o quadril e exploda para frente elevando o peso.', 
    video: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&h=300&fit=crop' 
  },
  { 
    id: 'full_3', 
    name: 'Mountain Climbers', 
    category: 'Cardio', 
    target: 'Full Body', 
    instructions: 'Em posição de prancha, traga os joelhos alternadamente em direção ao peito rapidamente.', 
    video: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=400&h=300&fit=crop' 
  },
  { 
    id: 'full_4', 
    name: 'Thruster (Agachamento + Ombro)', 
    category: 'Cross Training', 
    target: 'Full Body', 
    instructions: 'Agache segurando a barra/halter e, ao subir, empurre o peso acima da cabeça.', 
    video: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop' 
  },
  { 
    id: 'full_5', 
    name: 'Corda Naval (Battle Rope)', 
    category: 'Cross Training', 
    target: 'Full Body', 
    instructions: 'Base agachada, coluna reta. Faça movimentos de onda alternados com os braços.', 
    video: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&h=300&fit=crop' 
  }
];

const PRESET_WORKOUTS = [
  {
    id: 'preset-1',
    name: 'Iniciante Full Body',
    type: 'preset',
    active: true,
    exercises: [
      { id: 'ex1', name: 'Supino Reto com Barra', sets: 3, reps: 12, weight: 0, completed: false, methods: [] },
      { id: 'ex2', name: 'Agachamento Livre com Barra', sets: 3, reps: 15, weight: 0, completed: false, methods: [] },
      { id: 'ex5', name: 'Burpees Completos', sets: 3, reps: 10, weight: 0, completed: false, methods: ['drop-set'] }
    ]
  }
];

// --- COMPONENTES AUXILIARES ---

const Loader = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Carregando Modo Dev...</p>
  </div>
);

// AuthScreen removida pois não será usada no bypass

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  // BYPASS: Inicializamos o usuário já com dados fictícios
  const [user, setUser] = useState({ uid: 'dev-user', email: 'developer@fitflow.local' });
  const [authLoading, setAuthLoading] = useState(false); // Já carregado
  
  // UI States
  const [activeTab, setActiveTab] = useState('library'); 
  const [isCreatingOrEditing, setIsCreatingOrEditing] = useState(false); 
  const [librarySubTab, setLibrarySubTab] = useState('exercises'); 
  const [activeCategory, setActiveCategory] = useState(null); 
  const [search, setSearch] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null); 
  const [isOnline, setIsOnline] = useState(true); // Sempre online no mock
  const [showDetail, setShowDetail] = useState(null); 
  const [showPlanDetail, setShowPlanDetail] = useState(null);
  const [addingToPlan, setAddingToPlan] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [importCode, setImportCode] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Dados (Inicializados com presets)
  const [allWorkouts, setAllWorkouts] = useState(PRESET_WORKOUTS);
  const [weightHistory, setWeightHistory] = useState({});
  const [workoutDraft, setWorkoutDraft] = useState({ name: '', exercises: [] });

  // Styles Injection
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Toast Timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- LÓGICA DE NEGÓCIO (MOCK) ---

  // Bypass: Função syncData agora não faz nada (apenas loga no console)
  const syncData = async (newData) => {
    console.log("[DEV MODE] Sync simulado:", newData);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsCreatingOrEditing(false);
    setShowDetail(null);
    setShowPlanDetail(null);
    setAddingToPlan(null);
    setActiveCategory(null);
    setSearch('');
    setShowImportModal(false);
  };

  const startNewPlanWithExercise = (exercise) => {
    const history = weightHistory[exercise.id] || [];
    const lastW = history.length > 0 ? history[history.length - 1].weight : 0;
    setWorkoutDraft({ 
      name: '', 
      exercises: [{ ...exercise, sets: 3, reps: 12, weight: lastW, methods: [] }] 
    });
    setAddingToPlan(null);
    setIsCreatingOrEditing(true);
    setActiveTab('library');
  };

  const toggleWorkoutActive = (id, e) => {
    if (e) e.stopPropagation();
    const updated = allWorkouts.map(w => w.id === id ? { ...w, active: !w.active } : w);
    setAllWorkouts(updated);
    syncData({ workouts: updated });
    if (showPlanDetail?.id === id) setShowPlanDetail(prev => ({ ...prev, active: !prev.active }));
  };

  const finishWorkout = () => {
    const updatedWeights = { ...weightHistory };
    selectedWorkout.exercises.forEach(ex => {
      if (ex.weight) {
        const current = updatedWeights[ex.id] || [];
        const weightVal = parseFloat(ex.weight);
        if (current[current.length - 1]?.weight !== weightVal) {
          updatedWeights[ex.id] = [...current, { date: new Date().toLocaleDateString('pt-BR'), weight: weightVal }];
        }
      }
    });
    const updatedWorkouts = allWorkouts.map(w => 
      w.id === selectedWorkout.id ? { ...w, exercises: w.exercises.map(ex => ({ ...ex, completed: false })) } : w
    );
    setAllWorkouts(updatedWorkouts);
    setWeightHistory(updatedWeights);
    syncData({ workouts: updatedWorkouts, weights: updatedWeights });
    setSelectedWorkout(null); 
    setActiveTab('my-workouts'); 
    setToast("Sessão salva (Localmente)!");
  };

  const editWorkout = (plan) => {
    setWorkoutDraft({ name: plan.name, exercises: plan.exercises });
    setEditingPlanId(plan.id);
    setShowPlanDetail(null);
    setIsCreatingOrEditing(true);
    setActiveTab('library');
  };

  const saveNewWorkout = () => {
    if (!workoutDraft.name) return;
    let updated;
    if (editingPlanId) {
      updated = allWorkouts.map(w => w.id === editingPlanId ? { ...w, name: workoutDraft.name, exercises: workoutDraft.exercises } : w);
      setToast("Plano atualizado!");
    } else {
      const newW = { ...workoutDraft, id: `custom-${Date.now()}`, type: 'custom', active: true, createdAt: new Date().toISOString() };
      updated = [newW, ...allWorkouts];
      setToast("Plano criado!");
    }
    setAllWorkouts(updated);
    syncData({ workouts: updated });
    setWorkoutDraft({ name: '', exercises: [] });
    setEditingPlanId(null);
    setIsCreatingOrEditing(false);
  };

  const importWorkout = () => {
    if (!importCode) return;
    try {
      const decoded = JSON.parse(atob(importCode));
      if (!decoded.name || !decoded.exercises) throw new Error();
      const newW = {
        ...decoded,
        id: `imported-${Date.now()}`,
        type: 'custom',
        active: true,
        createdAt: new Date().toISOString(),
        exercises: decoded.exercises.map(ex => ({ ...ex, weight: 0, completed: false }))
      };
      const updated = [newW, ...allWorkouts];
      setAllWorkouts(updated);
      syncData({ workouts: updated });
      setImportCode('');
      setShowImportModal(false);
      setToast("Treino importado!");
      setLibrarySubTab('plans');
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("Código inválido.");
    }
  };

  const toggleExerciseInDraft = (ex) => {
    const isSelected = workoutDraft.exercises.some(e => e.id === ex.id);
    if (isSelected) {
      setWorkoutDraft(prev => ({ ...prev, exercises: prev.exercises.filter(e => e.id !== ex.id) }));
    } else {
      const lastW = (weightHistory[ex.id]?.length > 0) ? weightHistory[ex.id][weightHistory[ex.id].length-1].weight : 0;
      setWorkoutDraft(prev => ({ ...prev, exercises: [...prev.exercises, { ...ex, sets: 3, reps: 12, weight: lastW, methods: [] }] }));
    }
  };

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || 
                            ex.target.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || ex.target === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const getWorkoutTags = (workout) => {
    const targets = workout.exercises.map(ex => {
      const libEx = EXERCISE_LIBRARY.find(l => l.id === ex.id);
      return libEx ? libEx.target : ex.target;
    });
    return [...new Set(targets.filter(Boolean))].map(t => t.toUpperCase());
  };

  const activeWorkoutsList = useMemo(() => allWorkouts.filter(w => w.active), [allWorkouts]);
  const customWorkoutsList = useMemo(() => allWorkouts.filter(w => w.type === 'custom'), [allWorkouts]);

  if (authLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center relative overflow-x-hidden">

      {/* HEADER FIXO */}
      <header className="w-full max-w-md sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black italic text-white tracking-tighter">FITFLOW <span className='text-[8px] text-amber-500 not-italic align-top bg-amber-500/10 px-1 rounded ml-1'>DEV</span></h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{isOnline ? 'Modo Local' : 'Offline'}</p>
          </div>
        </div>
        {!isCreatingOrEditing && activeTab === 'library' && (
          <div className="flex gap-2">
            {librarySubTab === 'plans' && (
              <button onClick={() => setShowImportModal(true)} className="p-2.5 bg-slate-800 active:bg-slate-700 active:scale-90 rounded-full text-blue-400 shadow-xl transition-all border border-slate-700"><Download size={18} /></button>
            )}
            <button onClick={() => { setWorkoutDraft({name: '', exercises: []}); setEditingPlanId(null); setIsCreatingOrEditing(true); }} className="p-2.5 bg-blue-600 active:bg-blue-700 active:scale-90 rounded-full text-white shadow-xl transition-all"><Plus size={18} /></button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-md p-4 flex-1 pb-32">
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
            <Check size={14} /> {toast}
          </div>
        )}

        {/* TAB: BIBLIOTECA - CRIANDO TREINO */}
        {isCreatingOrEditing && (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setIsCreatingOrEditing(false)} className="p-2 bg-slate-900 rounded-full border border-slate-800"><ArrowLeft size={20} /></button>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter text-blue-400">{editingPlanId ? 'Editar Plano' : 'Novo Plano'}</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Nome do Plano</label>
                        <input type="text" placeholder="Ex: Treino de Peito (Hipertrofia)" className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={workoutDraft.name} onChange={(e) => setWorkoutDraft({...workoutDraft, name: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Exercícios Selecionados ({workoutDraft.exercises.length})</label>
                         {workoutDraft.exercises.length === 0 ? (
                             <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
                                 <p className="text-xs text-slate-500 italic mb-2">Nenhum exercício adicionado.</p>
                                 <p className="text-[10px] text-blue-500 font-bold uppercase">Toque nos exercícios abaixo para adicionar</p>
                             </div>
                         ) : (
                             <div className="space-y-2">
                                 {workoutDraft.exercises.map((ex, idx) => (
                                     <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                                         <span className="text-xs font-bold uppercase truncate w-[70%]">{ex.name}</span>
                                         <button onClick={() => toggleExerciseInDraft(ex)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                                     </div>
                                 ))}
                             </div>
                         )}
                    </div>

                    <button onClick={saveNewWorkout} disabled={!workoutDraft.name || workoutDraft.exercises.length === 0} className="w-full py-4 bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">SALVAR PLANO</button>
                    {editingPlanId && <button onClick={() => { if(confirm("Excluir?")) { const u = allWorkouts.filter(w => w.id !== editingPlanId); setAllWorkouts(u); syncData({workouts: u}); setIsCreatingOrEditing(false); } }} className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-xs">EXCLUIR PLANO</button>}
                </div>
                
                <div className="pt-6 border-t border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Adicionar Exercícios</p>
                    <input type="text" placeholder="Buscar exercício..." className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="space-y-2">
                        {filteredExercises.map(ex => {
                            const isSelected = workoutDraft.exercises.some(e => e.id === ex.id);
                            return (
                                <div key={ex.id} onClick={() => toggleExerciseInDraft(ex)} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'bg-blue-600/10 border-blue-600/30' : 'bg-slate-900 border-slate-800'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold uppercase ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>{ex.name}</p>
                                            <p className="text-[9px] text-slate-500 uppercase">{ex.target}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

        {/* TAB: BIBLIOTECA - LISTAGEM */}
        {activeTab === 'library' && !isCreatingOrEditing && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button onClick={() => { setLibrarySubTab('exercises'); setActiveCategory(null); setSearch(''); }} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${librarySubTab === 'exercises' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}>EXERCÍCIOS</button>
              <button onClick={() => setLibrarySubTab('plans')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${librarySubTab === 'plans' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}>PLANOS</button>
            </div>

            {librarySubTab === 'exercises' ? (
              <section className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="text" placeholder="Pesquisar..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {!search && !activeCategory ? (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-500">
                    {EXERCISE_CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`relative h-24 rounded-3xl overflow-hidden p-4 flex flex-col justify-end group active:scale-95 transition-all shadow-xl ${cat.color}`}>
                          <div className="absolute top-2 right-2 opacity-20 transition-opacity">{cat.icon}</div>
                          <span className="font-black uppercase italic text-sm tracking-tighter text-white drop-shadow-md">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                ) : activeCategory && !search ? (
                  <div className="flex items-center gap-3 animate-in slide-in-from-left duration-300">
                    <button onClick={() => setActiveCategory(null)} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 active:bg-slate-800 transition-all"><ArrowLeft size={20}/></button>
                    <div>
                      <h2 className="text-xl font-black italic uppercase tracking-tighter text-blue-400">{activeCategory}</h2>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filtrando categoria</p>
                    </div>
                  </div>
                ) : search ? (
                  <div className="flex items-center justify-between px-2 animate-in fade-in"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resultados para: <span className="text-blue-500 italic">"{search}"</span></p><button onClick={() => setSearch('')} className="text-[10px] font-black uppercase text-blue-500 underline">Limpar</button></div>
                ) : null}

                <div className="grid gap-3">
                  {filteredExercises.map(ex => (
                    <div key={ex.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-3 flex items-center justify-between active:bg-slate-900 transition-colors shadow-sm">
                      <div className="flex items-center gap-3 w-[70%]" onClick={() => setShowDetail({ exercise: ex, tab: 'info' })}>
                        <img src={ex.video} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" alt="" />
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-bold text-sm uppercase italic tracking-tighter leading-tight whitespace-pre-wrap">{ex.name}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{ex.target}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => startNewPlanWithExercise(ex)} className="p-3 bg-blue-600/10 text-blue-400 active:bg-blue-600 active:text-white rounded-xl transition-all shadow-sm"><Plus size={18} /></button>
                        <button onClick={() => setShowDetail({ exercise: ex, tab: 'info' })} className="p-3 text-slate-600 active:text-white transition-all"><Info size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="space-y-4">
                {allWorkouts.map(w => (
                  <div key={w.id} onClick={() => setShowPlanDetail(w)} className={`bg-slate-900 border ${w.active ? 'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'border-slate-800'} rounded-3xl p-5 active:scale-[0.98] transition-all`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className={`font-black uppercase italic text-lg tracking-tighter leading-tight ${!w.active && 'text-slate-500'}`}>{w.name}</h3>
                           <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase flex-shrink-0 ${w.type === 'preset' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>{w.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">{w.exercises.length} EXS •</span>
                           {getWorkoutTags(w).map(tag => (
                             <span key={tag} className="text-[8px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-slate-700/50">{tag}</span>
                           ))}
                        </div>
                      </div>
                      <button onClick={(e) => toggleWorkoutActive(w.id, e)} className={`p-2.5 rounded-full transition-all flex-shrink-0 ${w.active ? 'bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-slate-800 text-slate-600'}`}>{w.active ? <Eye size={20} /> : <EyeOff size={20} />}</button>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                      <div className="text-[10px] text-blue-500 font-black uppercase italic flex items-center gap-1">Ver detalhes <ChevronRight size={12}/></div>
                      {w.active && <button onClick={(e) => { e.stopPropagation(); setSelectedWorkout({ ...w, startTime: Date.now() }); setActiveTab('my-workouts'); }} className="bg-blue-600 text-white text-[10px] font-black px-5 py-2.5 rounded-xl active:bg-blue-700 transition-all shadow-lg">INICIAR</button>}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}

        {/* VIEW: TREINAR */}
        {activeTab === 'my-workouts' && (
          <div className="h-full flex flex-col items-center">
            {selectedWorkout ? (
              <div className="fixed inset-0 top-0 bottom-20 z-50 bg-slate-950 flex flex-col animate-in slide-in-from-right duration-300 items-center">
                  <div className="w-full max-w-md p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 backdrop-blur sticky top-0 z-20">
                  <button onClick={() => setActiveTab('library')} className="p-2 text-slate-400 active:text-white transition-all"><ArrowLeft /></button>
                  <h2 className="font-black italic text-center uppercase tracking-tighter text-blue-400 max-w-[200px] truncate">{selectedWorkout.name}</h2>
                  <div className="w-10" /> 
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full max-w-md pb-32 custom-scrollbar">
                  {[...selectedWorkout.exercises].sort((a,b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)).map((ex) => (
                    <div key={ex.id} className={`bg-slate-900 rounded-[2.5rem] border ${ex.completed ? 'border-emerald-500/20 bg-emerald-500/5 opacity-60 scale-[0.98]' : 'border-slate-800 shadow-xl'} p-6 transition-all`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-4 w-[80%]">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${ex.completed ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>
                             {ex.completed ? <Check size={20} /> : selectedWorkout.exercises.indexOf(ex) + 1}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className={`font-black uppercase italic tracking-tighter leading-tight whitespace-pre-wrap ${ex.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{ex.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{ex.sets} séries • {ex.reps} reps</p>
                              {ex.methods?.map(m => <span key={m} className="bg-amber-500/20 text-amber-500 text-[8px] font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1 border border-amber-500/20"><Flame size={8} fill="currentColor" /> {TRAINING_METHODS[m].name}</span>)}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => { 
                          const updated = { ...selectedWorkout }; const i = updated.exercises.findIndex(e => e.id === ex.id);
                          updated.exercises[i].completed = !updated.exercises[i].completed;
                          setSelectedWorkout(updated);
                        }} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${ex.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-600'}`}><CheckCircle2 size={24} /></button>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="w-[60%] relative">
                          <input type="number" placeholder="0" className="w-full bg-black/40 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 font-black text-xl outline-none text-center focus:ring-1 focus:ring-blue-500" value={ex.weight || ''} onChange={(e) => { const u = { ...selectedWorkout }; const i = u.exercises.findIndex(e => e.id === ex.id); u.exercises[i].weight = e.target.value; setSelectedWorkout(u); }} />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase">KG</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowDetail({ exercise: EXERCISE_LIBRARY.find(el => el.id === ex.id) || ex, tab: 'stats', activeInWorkout: ex })} className="p-4 bg-slate-800/50 text-emerald-400 rounded-2xl active:bg-emerald-500/10 border border-emerald-500/10 shadow-lg transition-all"><TrendingUp size={22} /></button>
                          <button onClick={() => setShowDetail({ exercise: EXERCISE_LIBRARY.find(el => el.id === ex.id) || ex, tab: 'info', activeInWorkout: ex })} className="p-4 bg-slate-800/50 text-slate-400 rounded-2xl border border-slate-800 shadow-lg transition-all"><Info size={22} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center p-6 bg-slate-950 border-t border-slate-900 shadow-[0_-15px_30px_rgba(0,0,0,0.5)]">
                  <button onClick={finishWorkout} className="w-full max-w-[280px] py-5 bg-blue-600 text-white rounded-3xl font-black text-xl italic shadow-2xl active:bg-blue-700 active:scale-95 transition-all uppercase tracking-tighter">FINALIZAR TREINO</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in w-full max-w-md">
                <header><h2 className="text-2xl font-black italic uppercase tracking-tighter underline decoration-blue-500 underline-offset-8">Treino de Hoje</h2><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-4">Atividade selecionada</p></header>
                <div className="grid gap-4">
                  {activeWorkoutsList.map(w => (
                    <div key={w.id} onClick={() => setSelectedWorkout({ ...w, startTime: Date.now() })} className="group bg-slate-900 rounded-[2.5rem] border border-slate-800 p-6 active:scale-[0.98] transition-all relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-12 -mt-12" />
                      <h3 className="text-xl font-black mb-1 italic uppercase tracking-tight leading-tight relative z-10">{w.name}</h3>
                      <div className="flex flex-wrap gap-1 mb-4 relative z-10">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">{w.exercises.length} EXS •</span>
                        {getWorkoutTags(w).map(tag => (
                           <span key={tag} className="text-[8px] font-black bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-slate-700/50">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-end"><div className="bg-white text-black p-3 rounded-full shadow-lg group-active:bg-blue-600 group-active:text-white transition-all"><Play size={20} fill="currentColor" /></div></div>
                    </div>
                  ))}
                  {activeWorkoutsList.length === 0 && <div className="py-12 text-center bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl"><p className="text-slate-500 text-sm mb-4 italic">Nenhum treino ativado.</p><button onClick={() => { setActiveTab('library'); setLibrarySubTab('plans'); }} className="text-blue-500 text-xs font-black uppercase underline">Escolher Plano</button></div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: PERFIL */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in text-center py-10 w-full max-w-md mx-auto">
             <div className="w-24 h-24 bg-slate-900 rounded-full mx-auto flex items-center justify-center border-2 border-slate-800 shadow-2xl relative">
                <User size={48} className="text-slate-600" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-lg"><ShieldCheck size={16} className="text-white" /></div>
             </div>
             <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter truncate px-4">{user.email}</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">MODO DESENVOLVEDOR</p>
             </div>

              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Verde Productions</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-7 rounded-[2rem] border border-slate-800 shadow-xl"><p className="text-[9px] font-black text-slate-500 uppercase mb-2">Meus Planos</p><span className="text-2xl font-black italic text-blue-500">{customWorkoutsList.length}</span></div>
                <div className="bg-slate-900 p-7 rounded-[2rem] border border-slate-800 shadow-xl"><p className="text-[9px] font-black text-slate-500 uppercase mb-2">Cargas Salvas</p><span className="text-2xl font-black italic text-emerald-500">{Object.keys(weightHistory).length}</span></div>
             </div>
             {/* O botão de sair apenas recarrega a página no modo mock */}
             <button onClick={() => window.location.reload()} className="w-full py-5 bg-slate-900 text-red-500 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 active:bg-red-500/10 border border-slate-800 transition-all shadow-xl italic tracking-tighter"><LogOut size={20} /> Resetar Sessão</button>
          </div>
        )}
      </main>

      {/* MODAIS (Plan Detail, Import, etc) */}
      {showPlanDetail && (
        <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:p-4">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setShowPlanDetail(null)} />
           <div className="relative bg-slate-900 w-full max-w-md h-[85vh] rounded-t-[3rem] overflow-hidden border-t border-slate-800 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] flex flex-col mx-auto mb-20 animate-in slide-in-from-bottom duration-300">
              <div className="p-8 border-b border-slate-800 relative">
                <button onClick={() => setShowPlanDetail(null)} className="absolute right-6 top-6 p-2.5 bg-slate-800 rounded-full text-slate-400 active:text-white transition-all shadow-lg"><X size={20} /></button>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2 leading-tight pr-10">{showPlanDetail.name}</h3>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{showPlanDetail.exercises.length} EXERCÍCIOS NO PLANO</span>
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {getWorkoutTags(showPlanDetail).map(tag => (
                        <span key={tag} className="text-[9px] font-black bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">{tag}</span>
                    ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {showPlanDetail.exercises.map((ex, i) => (
                  <div key={i} onClick={() => setShowDetail({ exercise: EXERCISE_LIBRARY.find(el => el.id === ex.id) || ex, tab: 'info', activeInWorkout: ex })} className="bg-slate-800/30 border border-slate-800 p-5 rounded-3xl flex items-start justify-between active:scale-[0.98] transition-all">
                    <div className="flex items-start gap-4 w-[85%]">
                      <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center font-black text-xs text-blue-500 flex-shrink-0 shadow-inner">{i + 1}</div>
                      <div className="flex-1"><h4 className="font-bold text-sm uppercase italic leading-tight whitespace-pre-wrap">{ex.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{ex.sets} séries • {ex.reps} reps</p>
                           {ex.methods?.map(m => <span key={m} className="text-[8px] text-amber-500 font-black uppercase border border-amber-500/20 px-1 rounded-md">{TRAINING_METHODS[m].name}</span>)}
                        </div>
                      </div>
                    </div><ChevronRight size={16} className="text-slate-700 flex-shrink-0 mt-3" />
                  </div>
                ))}
              </div>
              <div className="p-8 border-t border-slate-800 flex flex-col gap-3 bg-slate-900/50">
                <div className="flex gap-2">
                  <button onClick={(e) => toggleWorkoutActive(showPlanDetail.id, e)} className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${showPlanDetail.active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-lg' : 'bg-slate-800 text-slate-400 border-transparent'}`}>
                    {showPlanDetail.active ? <><Eye size={16} className="mr-1 inline" /> Ativado</> : <><EyeOff size={16} className="mr-1 inline" /> Ativar</>}
                  </button>
                  <button onClick={() => editWorkout(showPlanDetail)} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:bg-slate-700 transition-all shadow-lg"><Edit3 size={16} /> Editar</button>
                </div>
                <button onClick={() => { setSelectedWorkout({ ...showPlanDetail, startTime: Date.now() }); setShowPlanDetail(null); setActiveTab('my-workouts'); }} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest italic text-lg shadow-xl active:bg-blue-700 active:scale-95 transition-all">INICIAR AGORA</button>
              </div>
           </div>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setShowDetail(null)} />
          <div className="relative bg-slate-900 w-full max-w-md h-[90vh] rounded-t-[3rem] overflow-hidden border border-slate-800 shadow-2xl animate-in zoom-in-95 flex flex-col mx-auto mb-20">
            <div className="relative h-52 overflow-hidden flex-shrink-0">
               <button onClick={() => setShowDetail(null)} className="absolute right-6 top-6 p-2.5 bg-black/50 rounded-full text-white z-20 active:scale-110 transition-all shadow-xl"><X size={20} /></button>
               <img src={showDetail.exercise.video} className="w-full h-full object-cover grayscale-[0.3]" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
               <div className="absolute bottom-6 left-8 pr-12"><h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-tight whitespace-pre-wrap">{showDetail.exercise.name}</h3></div>
            </div>
            <div className="flex bg-slate-900 border-b border-slate-800 px-4 overflow-x-auto no-scrollbar flex-shrink-0 shadow-lg">
              <button onClick={() => setShowDetail({...showDetail, tab: 'info'})} className={`flex-shrink-0 px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${showDetail.tab === 'info' ? 'text-blue-400' : 'text-slate-500'}`}>Instruções {showDetail.tab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}</button>
              <button onClick={() => setShowDetail({...showDetail, tab: 'stats'})} className={`flex-shrink-0 px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${showDetail.tab === 'stats' ? 'text-emerald-400' : 'text-slate-500'}`}>Evolução {showDetail.tab === 'stats' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_10px_#10b981]" />}</button>
              <button onClick={() => setShowDetail({...showDetail, tab: 'methods'})} className={`flex-shrink-0 px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${showDetail.tab === 'methods' ? 'text-amber-500' : 'text-slate-500'}`}>Métodos {showDetail.tab === 'methods' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />}</button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-slate-900/20">
              {showDetail.tab === 'info' && (<div className="space-y-6 animate-in fade-in duration-300"><div className="flex flex-wrap gap-2"><span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">{showDetail.exercise.target}</span><span className="bg-slate-800/50 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">{showDetail.exercise.category}</span></div><div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 italic text-slate-400 text-sm leading-relaxed whitespace-pre-wrap shadow-inner tracking-tight">"{showDetail.exercise.instructions}"</div></div>)}
              {showDetail.tab === 'stats' && (<div className="space-y-4 animate-in fade-in duration-300"><div className="flex items-center justify-between mb-4"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registros Históricos</p><BarChart3 size={16} className="text-slate-700" /></div>{weightHistory[showDetail.exercise.id]?.length > 0 ? (<div className="space-y-3">{[...weightHistory[showDetail.exercise.id]].reverse().map((entry, idx) => (<div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex justify-between items-center transition-all active:bg-slate-900"><div className="flex flex-col"><span className="text-[9px] font-black text-slate-600 uppercase mb-0.5 tracking-wider">{entry.date}</span><span className="text-xl font-black italic text-emerald-400">{entry.weight}<small className="text-[10px] not-italic ml-1 text-slate-500 uppercase font-black tracking-widest">KG</small></span></div>{idx === 0 && <span className="text-[8px] bg-emerald-500 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20">Recorde</span>}</div>))}</div>) : (<div className="py-20 text-center space-y-4 opacity-40"><TrendingUp size={48} className="mx-auto text-slate-800" /><p className="text-xs font-bold uppercase tracking-widest">Aguardando seu primeiro treino.</p></div>)}</div>)}
              {showDetail.tab === 'methods' && (<div className="space-y-4 animate-in fade-in duration-300"><div className="flex items-center gap-2 mb-6"><Flame size={18} className="text-amber-500 shadow-amber-500/50" /><p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Sistemas de Intensidade</p></div>{showDetail.activeInWorkout?.methods?.length > 0 ? showDetail.activeInWorkout.methods.map(m => (<div key={m} className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-[2rem] space-y-2.5 shadow-inner"><h5 className="text-sm font-black text-amber-500 uppercase italic">{TRAINING_METHODS[m].name}</h5><p className="text-[11px] text-slate-400 leading-relaxed font-medium tracking-tight">{TRAINING_METHODS[m].desc}</p></div>)) : (<div className="py-20 text-center opacity-30 italic text-xs tracking-widest uppercase">Nenhuma técnica avançada ativada.</div>)}</div>)}
            </div>
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex-shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"><button onClick={() => setShowDetail(null)} className="w-full py-5 bg-white text-black font-black uppercase rounded-3xl active:scale-95 transition-all shadow-2xl tracking-widest italic text-lg uppercase">FECHAR</button></div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setShowImportModal(false)} />
          <div className="relative bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl animate-in zoom-in-95 flex flex-col mx-auto p-8">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-blue-400 mb-2">Importar Treino</h3>
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-6 leading-relaxed">Cole abaixo o código de compartilhamento que você recebeu.</p>
            <textarea 
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder="Cole o hash aqui..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-blue-300 outline-none focus:ring-1 focus:ring-blue-500 mb-6 resize-none"
            />
            <div className="flex flex-col gap-3">
              <button onClick={importWorkout} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all italic shadow-lg shadow-blue-500/20">IMPORTAR PLANO</button>
              <button onClick={() => setShowImportModal(false)} className="w-full py-4 text-slate-500 font-black uppercase text-xs tracking-widest active:text-white transition-all">CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGAÇÃO GLOBAL */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        <div className="w-full max-w-md bg-slate-950/95 backdrop-blur-3xl border-t border-slate-900 px-6 py-5 flex justify-around items-center">
          <button onClick={() => handleNavClick('library')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-125 ${activeTab === 'library' ? 'text-blue-500' : 'text-slate-600'}`}>
            <Dumbbell size={24} className={activeTab === 'library' ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Biblioteca</span>
          </button>
          <button onClick={() => handleNavClick('my-workouts')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-125 ${activeTab === 'my-workouts' ? 'text-blue-500' : 'text-slate-600'}`}>
            <div className="relative">
               <Timer size={24} className={activeTab === 'my-workouts' ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} />
               {selectedWorkout && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-950 animate-pulse shadow-[0_0_10px_#3b82f6]" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{selectedWorkout ? 'Treinando' : 'Treinar'}</span>
          </button>
          <button onClick={() => handleNavClick('profile')} className={`flex flex-col items-center gap-1.5 transition-all active:scale-125 ${activeTab === 'profile' ? 'text-blue-500' : 'text-slate-600'}`}>
            <User size={24} className={activeTab === 'profile' ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}