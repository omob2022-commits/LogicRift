import { create } from 'zustand';

/* ─── TYPES ─── */
export interface UserStory {
  id: string;
  asA: string;
  iWantTo: string;
  soThat: string;
  acceptanceCriteria: string[];
}

export interface SocraticQuestion {
  id: string;
  questionForClient: string;
  severity: 'High' | 'Medium' | 'Low';
  answered: boolean;
  answer?: string;
}

export interface PRDData {
  projectTitle: string;
  executiveSummary: string;
  userStories: UserStory[];
  functionalRequirements: string[];
  nonFunctionalRequirements: {
    performance: string;
    security: string;
    scalability: string;
  };
  outOfScope: string[];
  techStackRecommendations: string[];
  socraticQuestions: SocraticQuestion[];
  mermaidDiagram: string;
}

export type ViewMode = 'stakeholder' | 'engineer';
export type Theme = 'dark' | 'light';
export type EngineerTab = 'scope' | 'stories' | 'diagrams' | 'techstack';

interface AppState {
  /* Theme */
  theme: Theme;
  toggleTheme: () => void;

  /* View mode */
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  /* Engineer tabs */
  activeTab: EngineerTab;
  setActiveTab: (tab: EngineerTab) => void;

  /* Stakeholder input */
  rawInput: string;
  setRawInput: (input: string) => void;

  /* Processing state */
  isProcessing: boolean;
  processingStep: string;

  /* PRD data */
  prdData: PRDData | null;

  /* Reverse translator */
  reverseInput: string;
  setReverseInput: (input: string) => void;
  reverseOutput: string;
  isReverseTranslating: boolean;

  /* Socratic Q&A */
  showSocratic: boolean;
  setShowSocratic: (show: boolean) => void;
  answerQuestion: (id: string, answer: string) => void;

  /* Actions */
  processInput: () => void;
  translateReverse: () => void;
  resetProject: () => void;
}

/* ─── MOCK PRD DATA ─── */
const MOCK_PRD: PRDData = {
  projectTitle: 'FreshCart — On-Demand Grocery Delivery Platform',
  executiveSummary:
    'FreshCart is a mobile-first on-demand grocery delivery marketplace that connects local grocery stores with customers seeking convenient home delivery. The platform features real-time inventory sync, smart route optimization for delivery drivers, a subscription-based loyalty program, and AI-powered product recommendations. Target launch: Q2 2025 in 3 metropolitan areas.',
  userStories: [
    {
      id: 'US-01',
      asA: 'Customer',
      iWantTo: 'browse grocery items from nearby stores with real-time availability',
      soThat: 'I can quickly add items to my cart without worrying about out-of-stock products',
      acceptanceCriteria: [
        'Given a customer has location services enabled, When they open the app, Then they see stores within a 10km radius sorted by distance',
        'Given an item is out of stock, When browsing, Then the item shows a "Notify Me" button instead of "Add to Cart"',
        'Given a customer searches for "organic milk", When results load, Then items appear within 300ms with relevance scoring',
      ],
    },
    {
      id: 'US-02',
      asA: 'Customer',
      iWantTo: 'schedule a delivery for a specific time slot',
      soThat: 'I can ensure someone is home to receive the groceries',
      acceptanceCriteria: [
        'Given a customer selects a delivery date, When time slots load, Then only available slots (with capacity) are shown',
        'Given a slot is within 2 hours, When selected, Then it shows an express delivery surcharge clearly before checkout',
        'Given a delivery is scheduled, When the driver is en route, Then the customer receives real-time ETA updates via push notification',
      ],
    },
    {
      id: 'US-03',
      asA: 'Store Owner',
      iWantTo: 'manage my inventory and update prices in real-time',
      soThat: 'customers always see accurate stock levels and current pricing',
      acceptanceCriteria: [
        'Given a store owner updates a product price, When saved, Then the new price reflects on the customer app within 5 seconds',
        'Given stock reaches zero, When auto-detected, Then the product is automatically marked as unavailable',
        'Given a bulk import CSV is uploaded, When processed, Then the system validates and imports up to 10,000 SKUs within 30 seconds',
      ],
    },
    {
      id: 'US-04',
      asA: 'Delivery Driver',
      iWantTo: 'receive optimized multi-stop delivery routes',
      soThat: 'I can complete more deliveries efficiently and earn higher tips',
      acceptanceCriteria: [
        'Given a driver has 4+ pending deliveries, When route optimization runs, Then the suggested route minimizes total drive time',
        'Given traffic conditions change mid-route, When recalculated, Then the driver receives updated directions within 10 seconds',
        'Given a delivery is completed, When the driver marks it done, Then the customer is prompted to rate and tip within 60 seconds',
      ],
    },
  ],
  functionalRequirements: [
    'Real-time inventory synchronization between store POS systems and the platform via webhooks (target latency < 2s)',
    'Multi-vendor shopping cart allowing items from up to 3 different stores in a single order',
    'Dynamic pricing engine supporting flash sales, loyalty discounts, and store-specific promotions',
    'In-app chat system between customers and delivery drivers with message read receipts',
    'Automated order splitting when items come from multiple stores, with independent tracking per sub-order',
    'Smart substitution engine that suggests alternative products when an item becomes unavailable post-checkout',
    'Referral system with QR code generation and tracking, awarding credits to both referrer and referee',
    'Multi-language support (English, Spanish, French) with right-to-left layout support for future Arabic expansion',
  ],
  nonFunctionalRequirements: {
    performance:
      'API response time ≤ 200ms at P95 for catalog queries. Page load time ≤ 1.5s on 4G networks. Support 50,000 concurrent users during peak hours (evenings 5–8 PM).',
    security:
      'PCI DSS Level 1 compliance for payment processing. All PII encrypted at rest (AES-256) and in transit (TLS 1.3). SOC 2 Type II certification within 12 months of launch. Rate limiting: 100 req/min per user, 1000 req/min per store API key.',
    scalability:
      'Horizontal auto-scaling from 3 to 50 pods based on CPU/memory thresholds. Database read replicas across 3 availability zones. CDN-cached static assets with < 50ms TTFB globally. Event-driven microservice architecture supporting independent service deployment.',
  },
  outOfScope: [
    'Prescription medication or pharmacy item delivery (regulatory complexity — Phase 2)',
    'In-house fleet management — all drivers are independent contractors via third-party integration',
    'Cryptocurrency or blockchain-based payment methods',
    'Desktop web application — mobile-first PWA only for v1.0',
    'AI-powered meal planning or recipe generation features',
    'White-label solution for enterprise grocery chains (B2B2C model — Phase 3)',
  ],
  techStackRecommendations: [
    'Frontend: React Native (iOS + Android) with Expo, Next.js for admin dashboard',
    'Backend: Node.js with Fastify, GraphQL API layer via Apollo Server',
    'Database: PostgreSQL (primary), Redis (caching + real-time), Elasticsearch (product search)',
    'Infrastructure: AWS EKS (Kubernetes), Terraform IaC, GitHub Actions CI/CD',
    'Payments: Stripe Connect (marketplace split payments)',
    'Maps & Routing: Google Maps Platform with OR-Tools for route optimization',
    'Monitoring: Datadog APM + Sentry error tracking + PagerDuty alerting',
    'Analytics: Amplitude for product analytics, Looker for business intelligence',
  ],
  socraticQuestions: [
    {
      id: 'Q1',
      questionForClient:
        'What should happen if a customer places an order but the store closes before the driver arrives to pick up the items? Should we auto-cancel, try a nearby substitute store, or hold the order until the store reopens?',
      severity: 'High',
      answered: false,
    },
    {
      id: 'Q2',
      questionForClient:
        'For the loyalty program, do customers earn points based on total spend amount, number of orders, or both? Is there a tier system (e.g., Silver, Gold, Platinum)?',
      severity: 'Medium',
      answered: false,
    },
    {
      id: 'Q3',
      questionForClient:
        'If a delivery driver reports that specific items in an order are damaged or missing upon store pickup, who authorizes the substitution or partial refund — the store owner, your support team, or should it be automated within a dollar threshold?',
      severity: 'High',
      answered: false,
    },
    {
      id: 'Q4',
      questionForClient:
        'How should the app handle areas where multiple stores offer the same product at different prices? Should we show the cheapest option first, the closest store first, or let the customer choose a sorting preference?',
      severity: 'Medium',
      answered: false,
    },
    {
      id: 'Q5',
      questionForClient:
        'What is the maximum delivery radius you want to support? Should this be configurable per store, or a global platform limit? Also, are there any geographic areas you want to explicitly exclude from launch?',
      severity: 'Low',
      answered: false,
    },
  ],
  mermaidDiagram: `flowchart TD
    A["👤 Customer Opens App"] --> B["📍 Detect Location"]
    B --> C["🏪 Load Nearby Stores"]
    C --> D["🛒 Browse & Add Items"]
    D --> E{"Multi-Store Cart?"}
    E -- Yes --> F["✂️ Split Order by Store"]
    E -- No --> G["📦 Single Store Order"]
    F --> H["💳 Checkout & Payment"]
    G --> H
    H --> I["✅ Order Confirmed"]
    I --> J["📨 Notify Store(s)"]
    J --> K["🏪 Store Prepares Order"]
    K --> L["🚗 Driver Assigned"]
    L --> M["📍 Route Optimized"]
    M --> N["🚚 Delivery In Progress"]
    N --> O["📦 Order Delivered"]
    O --> P["⭐ Customer Rates & Tips"]
    P --> Q["📊 Analytics Updated"]

    style A fill:#0F382C,stroke:#D4AF37,color:#E8EDE9
    style H fill:#0F382C,stroke:#D4AF37,color:#E8EDE9
    style I fill:#153D32,stroke:#34D399,color:#E8EDE9
    style O fill:#153D32,stroke:#34D399,color:#E8EDE9
    style P fill:#0F382C,stroke:#D4AF37,color:#E8EDE9`,
};

/* ─── PROCESSING STEPS (simulated) ─── */
const PROCESSING_STEPS = [
  'Parsing raw stakeholder input...',
  'Identifying implicit requirements...',
  'Extracting user stories & acceptance criteria...',
  'Analyzing non-functional constraints...',
  'Defining scope boundaries...',
  'Generating system architecture diagram...',
  'Formulating clarifying questions...',
  'Compiling final specification...',
];

/* ─── REVERSE TRANSLATION MOCK ─── */
const REVERSE_TRANSLATIONS: Record<string, string> = {
  default: `Here's what the engineering team has accomplished this sprint:

✅ **Performance Improvement**: We've made the app significantly faster — pages now load in under 1 second, which is 3x faster than before. Your customers will notice a much snappier experience.

✅ **Data Protection Upgrade**: We've upgraded our security systems to bank-level encryption. All customer information (names, addresses, payment details) is now protected with the strongest available standard.

✅ **Scalability Milestone**: The system can now handle 5x more simultaneous users than before. During your busiest hours, everything will keep running smoothly without slowdowns.

📊 **What This Means For Your Business**: These improvements directly translate to better customer retention (faster app = happier users), regulatory compliance readiness, and the ability to scale your marketing campaigns without worrying about the technology breaking under demand.

🔜 **Next Sprint Focus**: The team will be working on the delivery driver matching system and the loyalty program rewards engine.`,
};

/* ─── STORE ─── */
export const useAppStore = create<AppState>((set, get) => ({
  /* Theme */
  theme: 'dark',
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    set({ theme: newTheme });
  },

  /* View mode */
  viewMode: 'stakeholder',
  setViewMode: (mode) => set({ viewMode: mode }),

  /* Engineer tabs */
  activeTab: 'scope',
  setActiveTab: (tab) => set({ activeTab: tab }),

  /* Stakeholder input */
  rawInput: '',
  setRawInput: (input) => set({ rawInput: input }),

  /* Processing */
  isProcessing: false,
  processingStep: '',

  /* PRD */
  prdData: null,

  /* Reverse translator */
  reverseInput: '',
  setReverseInput: (input) => set({ reverseInput: input }),
  reverseOutput: '',
  isReverseTranslating: false,

  /* Socratic */
  showSocratic: false,
  setShowSocratic: (show) => set({ showSocratic: show }),
  answerQuestion: (id, answer) => {
    const prd = get().prdData;
    if (!prd) return;
    set({
      prdData: {
        ...prd,
        socraticQuestions: prd.socraticQuestions.map((q) =>
          q.id === id ? { ...q, answered: true, answer } : q
        ),
      },
    });
  },

  /* Process input (simulated AI pipeline) */
  processInput: () => {
    const { rawInput } = get();
    if (!rawInput.trim()) return;

    set({ isProcessing: true, processingStep: PROCESSING_STEPS[0] });

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < PROCESSING_STEPS.length) {
        set({ processingStep: PROCESSING_STEPS[stepIndex] });
      } else {
        clearInterval(interval);
        set({
          isProcessing: false,
          processingStep: '',
          prdData: MOCK_PRD,
          showSocratic: true,
          viewMode: 'engineer',
        });
      }
    }, 600);
  },

  /* Reverse translate */
  translateReverse: () => {
    const { reverseInput } = get();
    if (!reverseInput.trim()) return;

    set({ isReverseTranslating: true });
    setTimeout(() => {
      set({
        isReverseTranslating: false,
        reverseOutput: REVERSE_TRANSLATIONS.default,
      });
    }, 1800);
  },

  /* Reset */
  resetProject: () =>
    set({
      rawInput: '',
      prdData: null,
      showSocratic: false,
      reverseInput: '',
      reverseOutput: '',
      activeTab: 'scope',
      viewMode: 'stakeholder',
    }),
}));
