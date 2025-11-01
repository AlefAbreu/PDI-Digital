import type { SurveyQuestion, MaturityLevelInfo } from './types';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 1, text: 'Eu defino metas claras e alcançáveis para meu desenvolvimento profissional.', category: 'Planejamento' },
  { id: 2, text: 'Eu busco feedback ativamente e o utilizo para melhorar.', category: 'Autodesenvolvimento' },
  { id: 3, text: 'Eu comunico minhas ideias de forma clara e confiante em reuniões.', category: 'Comunicação' },
  { id: 4, text: 'Eu colaboro efetivamente com meus colegas para atingir objetivos comuns.', category: 'Trabalho em Equipe' },
  { id: 5, text: 'Eu assumo a responsabilidade por minhas tarefas e entrego resultados de alta qualidade.', category: 'Responsabilidade' },
  { id: 6, text: 'Eu consigo me adaptar a mudanças em projetos ou prioridades.', category: 'Adaptabilidade' },
  { id: 7, text: 'Eu procuro oportunidades para aprender novas habilidades, mesmo fora da minha área de atuação.', category: 'Aprendizado Contínuo' },
  { id: 8, text: 'Eu ajudo a motivar meus colegas e contribuo para um ambiente de trabalho positivo.', category: 'Liderança' },
  { id: 9, text: 'Eu gerencio meu tempo de forma eficaz para cumprir prazos.', category: 'Organização' },
  { id: 10, text: 'Eu tomo a iniciativa de resolver problemas em vez de esperar que me digam o que fazer.', category: 'Proatividade' },
];

export const MATURITY_LEVELS: MaturityLevelInfo[] = [
    {
        level: 1,
        name: "Júnior I (Iniciante)",
        description: "Profissional em início de carreira, focado em aprender as tarefas básicas e se integrar à equipe.",
        characteristics: ["Dependente de instruções detalhadas", "Conhecimento técnico básico", "Focado em tarefas individuais", "Baixa autonomia"]
    },
    {
        level: 2,
        name: "Júnior II (Em Desenvolvimento)",
        description: "Começa a ganhar autonomia em tarefas conhecidas e a entender melhor o negócio.",
        characteristics: ["Executa tarefas com supervisão moderada", "Busca ativamente por conhecimento", "Começa a colaborar com a equipe", "Desenvolve habilidades de comunicação"]
    },
    {
        level: 3,
        name: "Pleno I (Autônomo)",
        description: "Possui autonomia para executar tarefas complexas e começa a ter uma visão mais ampla dos projetos.",
        characteristics: ["Autônomo na maioria das tarefas", "Contribui com ideias e soluções", "Compreende o impacto do seu trabalho", "Começa a mentorar colegas menos experientes"]
    },
    {
        level: 4,
        name: "Pleno II (Referência)",
        description: "É uma referência técnica em sua área e consegue lidar com desafios de alta complexidade.",
        characteristics: ["Domínio técnico aprofundado", "Resolve problemas complexos de forma independente", "Influencia positivamente a equipe", "Visão sistêmica dos projetos"]
    },
    {
        level: 5,
        name: "Sênior (Estrategista)",
        description: "Atua com visão estratégica, lidera iniciativas e mentora outros profissionais, influenciando as decisões técnicas da empresa.",
        characteristics: ["Visão estratégica e de negócio", "Lidera projetos e iniciativas", "Mentora múltiplos profissionais", "Promove inovações e melhorias contínuas"]
    }
];

export const MATURITY_TIPS: { [key: number]: { title: string; points: string[] } } = {
    1: {
        title: "Foco no Quartil 1: Fundamentos",
        points: [
            "Fortalecer a comunicação com a equipe.",
            "Aprimorar o trabalho em equipe e a colaboração.",
            "Desenvolver a habilidade de resolução de problemas.",
            "Participar de treinamentos e atividades para desenvolver habilidades técnicas."
        ]
    },
    2: {
        title: "Foco no Quartil 2: Proatividade e Adaptação",
        points: [
            "Incentivar a proatividade na busca por novas soluções.",
            "Trabalhar a adaptação a mudanças de escopo e prioridades.",
            "Participar ativamente de projetos inovadores.",
            "Buscar e aproveitar oportunidades de desenvolvimento profissional."
        ]
    },
    3: {
        title: "Foco no Quartil 3: Excelência e Liderança",
        points: [
            "Buscar a excelência em todas as áreas de atuação.",
            "Promover a inovação no dia a dia.",
            "Desenvolver talentos e habilidades de liderança.",
            "Participar de programas de mentoria e buscar desafios que estimulem o crescimento."
        ]
    },
    4: {
        title: "Foco no Quartil 4: Performance e Crescimento Contínuo",
        points: [
            "Manter um alto nível de performance e entrega.",
            "Promover uma cultura de aprendizado contínuo.",
            "Buscar constantemente novas oportunidades de crescimento.",
            "Participar de projetos desafiadores e celebrar as conquistas da equipe."
        ]
    },
    5: { // Mapping Quartil 4 tips to Level 5 as well
        title: "Foco no Quartil 4: Performance e Crescimento Contínuo",
        points: [
            "Manter um alto nível de performance e entrega.",
            "Promover uma cultura de aprendizado contínuo.",
            "Buscar constantemente novas oportunidades de crescimento.",
            "Participar de projetos desafiadores e celebrar as conquistas da equipe."
        ]
    }
};
