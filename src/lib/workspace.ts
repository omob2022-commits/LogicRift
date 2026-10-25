export type Role = "company" | "client";
export type Status = "draft" | "review" | "approved" | "rejected";
export interface Profile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: Role;
}
export interface Answer {
  text: string;
  deferred: boolean;
  updatedAt: string;
  audioId?: string;
}
export interface Requirement {
  id: string;
  title: string;
  type: "functional" | "quality";
  priority: "high" | "medium" | "low";
  status: Status;
  source: string;
  sourceText: string;
  acceptance: string;
  history: string[];
}
export interface Decision {
  id: string;
  title: string;
  resolution: string;
  resolved: boolean;
}
export interface Project {
  id: string;
  ownerId: string;
  name: string;
  client: string;
  sector: string;
  description: string;
  scope: string;
  createdAt: string;
  code: string;
  inviteActive: boolean;
  expiresAt: string;
  memberIds: string[];
  answers: Record<string, Answer>;
  submitted: boolean;
  requirements: Requirement[];
  decisions: Decision[];
  notes: string;
  activity: string[];
  versions: { id: string; date: string; requirements: Requirement[] }[];
}
export const statusLabels: Record<Status, string> = {
  draft: "مسودة",
  review: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
};
export const priorityLabels = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};
export const QUESTIONS = [
  {
    id: "goal",
    title: "لنبدأ بالصورة الكبيرة.",
    question: "ما المشكلة التي تريد حلّها، وكيف تتعامل معها اليوم؟",
    hint: "احكِ لنا عن يوم عمل عادي، وما الذي تود تغييره.",
    topic: "الفكرة والهدف",
    options: ["تنظيم العمل اليدوي", "تسهيل تجربة الزبون", "تقليل الأخطاء"],
  },
  {
    id: "users",
    title: "لمن نصمّم هذه التجربة؟",
    question: "من سيستخدم المشروع؟ وما الذي يحتاج كل شخص إلى فعله؟",
    hint: "مثل: الزبون يحجز، والموظف يدير المواعيد، والمدير يراجع التقارير.",
    topic: "المستخدمون",
    options: ["الزبائن", "الموظفون", "الإدارة"],
  },
  {
    id: "features",
    title: "ما الذي يجب أن تنجزه النسخة الأولى؟",
    question: "صف أهم الوظائف والخطوات من بداية الاستخدام إلى نهايته.",
    hint: "اذكر ما هو ضروري الآن، وما يمكن تأجيله.",
    topic: "الوظائف الأساسية",
    options: ["حجز المواعيد", "إدارة الطلبات", "إشعارات وتذكيرات"],
  },
  {
    id: "payment",
    title: "لنوضّح موضوع الدفع.",
    question: "هل الدفع إلكتروني أم عند تقديم الخدمة؟ وماذا يحدث عند الإلغاء؟",
    hint: "ظهر موضوع الدفع في إجاباتك، لذلك نحتاج توضيح هذه النقطة.",
    topic: "الدفع والاستثناءات",
    options: ["الدفع عند تقديم الخدمة", "دفع إلكتروني", "نحتاج مناقشة القرار"],
  },
  {
    id: "constraints",
    title: "التفاصيل الصغيرة تصنع فرقًا.",
    question:
      "ما القيود أو الاستثناءات المهمة: الصلاحيات، الخصوصية، الوقت أو الميزانية؟",
    hint: "لا تحتاج أرقامًا نهائية. وضّح ما تعرفه وما لم يُحسم بعد.",
    topic: "القيود والجودة",
    options: ["واجهة عربية", "يعمل على الموبايل", "صلاحيات مختلفة"],
  },
  {
    id: "success",
    title: "كيف نعرف أننا نجحنا؟",
    question:
      "ما النتيجة التي ستجعلك تعتبر المشروع ناجحًا؟ وما الذي لا تريده ضمن النطاق؟",
    hint: "مثل تقليل وقت الحجز، أو تقليل المكالمات، مع استثناء التوصيل في البداية.",
    topic: "النجاح والنطاق",
    options: [],
  },
];
export function questionsFor(project: Pick<Project, "answers">) {
  const text = ["goal", "users", "features"]
    .map((k) => project.answers[k]?.text || "")
    .join(" ");
  return QUESTIONS.filter(
    (q) =>
      q.id !== "payment" ||
      /دفع|مدفوع|سعر|شراء|payment|pay\b|checkout/i.test(text),
  );
}
export function progress(project: Pick<Project, "answers">) {
  const questions = questionsFor(project);
  return Math.round(
    (questions.filter(
      (q) =>
        project.answers[q.id]?.text.trim() || project.answers[q.id]?.deferred,
    ).length /
      questions.length) *
      100,
  );
}
export function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[\s-]/g, "");
}
export function invitationError(
  project: Project | undefined,
  now = Date.now(),
) {
  if (!project) return "الكود غير صحيح. تأكد من الكود الذي أرسلته الشركة.";
  if (!project.inviteActive)
    return "أوقفت الشركة هذه الدعوة. اطلب كودًا جديدًا.";
  if (Date.parse(project.expiresAt) <= now)
    return "انتهت صلاحية الدعوة. اطلب من الشركة تجديدها.";
  return null;
}
// getRandomValues also works on local HTTP previews; randomUUID requires HTTPS.
export function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function createCode() {
  return "LR-" + newId().replace(/-/g, "").slice(0, 8).toUpperCase();
}
export function createProject(
  ownerId: string,
  input: Pick<Project, "name" | "client" | "sector" | "description" | "scope">,
): Project {
  return {
    ...input,
    id: newId(),
    ownerId,
    createdAt: new Date().toISOString(),
    code: createCode(),
    inviteActive: true,
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    memberIds: [],
    answers: {},
    submitted: false,
    requirements: [],
    decisions: [],
    notes: "",
    activity: ["تم إنشاء المشروع وتجهيز دعوة المقابلة"],
    versions: [],
  };
}
// Explicitly deterministic prototype extraction. No model call and no automatic approval.
export function extractDrafts(
  project: Project,
): Pick<Project, "requirements" | "decisions"> {
  const requirements = [...project.requirements];
  const decisions = [...project.decisions];
  for (const q of questionsFor(project)) {
    const answer = project.answers[q.id];
    if (!answer) continue;
    if (answer.deferred) {
      if (!decisions.some((d) => d.id === "question-" + q.id))
        decisions.push({
          id: "question-" + q.id,
          title: q.question,
          resolution: "",
          resolved: false,
        });
      continue;
    }
    if (!answer.text.trim()) continue;
    if (
      requirements.some(
        (r) => r.source === q.id && r.sourceText === answer.text,
      )
    )
      continue;
    requirements.push({
      id: `REQ-${String(requirements.length + 1).padStart(3, "0")}`,
      title: answer.text.trim(),
      type: q.id === "constraints" ? "quality" : "functional",
      priority: "medium",
      status: "draft",
      source: q.id,
      sourceText: answer.text,
      acceptance: "",
      history: ["مسودة من إجابة الزبون — تحتاج صياغة ومراجعة المحلل"],
    });
  }
  return { requirements, decisions };
}
export function reviseRequirement(
  old: Requirement,
  patch: Partial<Requirement>,
): Requirement {
  const changed = ["title", "type", "priority", "acceptance"].some(
    (key) =>
      key in patch &&
      patch[key as keyof Requirement] !== old[key as keyof Requirement],
  );
  return {
    ...old,
    ...patch,
    status:
      changed && old.status === "approved"
        ? "review"
        : (patch.status ?? old.status),
    history: [
      ...old.history,
      changed
        ? "عُدّل المتطلب؛ يتطلب اعتماد التغيير"
        : `تغيير الحالة إلى ${statusLabels[patch.status || old.status]}`,
    ],
  };
}
export function csv(project: Project) {
  const cell = (value: string) =>
    '"' +
    (/^[=+\-@\t\r]/.test(value) ? "'" + value : value).replaceAll('"', '""') +
    '"';
  return (
    "\uFEFF" +
    [
      ["ID", "المتطلب", "النوع", "الأولوية", "معيار القبول", "المصدر"],
      ...project.requirements
        .filter((r) => r.status === "approved")
        .map((r) => [
          r.id,
          r.title,
          r.type,
          priorityLabels[r.priority],
          r.acceptance,
          r.sourceText,
        ]),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n")
  );
}
export function demoProject(): Project {
  const project = createProject("demo-company", {
    name: "موعد | منصة حجز العيادات",
    client: "عيادات المدار",
    sector: "الصحة والمواعيد",
    description:
      "تجربة حجز واضحة تربط المرضى بالعيادات، وتمنح فريق الاستقبال وقتًا أكبر لخدمة الناس.",
    scope: "حجز المواعيد وإدارتها لعيادة واحدة، دون ملف طبي إلكتروني.",
  });
  project.id = "demo-mawed";
  project.code = "LR-DEMO2026";
  const now = new Date().toISOString();
  project.answers = {
    goal: {
      text: "نريد تقليل مكالمات الحجز وإتاحة اختيار موعد مناسب للمريض من الموبايل.",
      deferred: false,
      updatedAt: now,
    },
    users: {
      text: "المريض يحجز موعدًا، وموظف الاستقبال يؤكد الحجز ويعدله، والمدير يطّلع على التقارير.",
      deferred: false,
      updatedAt: now,
    },
    features: {
      text: "يعرض النظام الأوقات المتاحة ويمنع حجز نفس الموعد مرتين، ويرسل تذكيرًا قبل الموعد.",
      deferred: false,
      updatedAt: now,
    },
    constraints: {
      text: "واجهة عربية تعمل على الموبايل، مع فصل صلاحيات موظفي الاستقبال عن الإدارة.",
      deferred: false,
      updatedAt: now,
    },
  };
  project.requirements = [
    {
      id: "REQ-001",
      title: "عرض المواعيد المتاحة حسب الطبيب والتاريخ",
      type: "functional",
      priority: "high",
      status: "approved",
      source: "goal",
      sourceText: project.answers.goal.text,
      acceptance: "عند اختيار الطبيب والتاريخ، تظهر المواعيد المتاحة فقط.",
      history: ["أضيف من مقابلة تجريبية", "اعتمده المحلل في بيانات العرض"],
    },
    {
      id: "REQ-002",
      title: "منع تعارض الحجوزات لنفس الموعد",
      type: "functional",
      priority: "high",
      status: "review",
      source: "features",
      sourceText: project.answers.features.text,
      acceptance: "عند حجز موعد، لا يمكن لزبون آخر اختيار الوقت نفسه.",
      history: ["أضيف من مقابلة تجريبية"],
    },
    {
      id: "REQ-003",
      title: "إرسال تذكير قبل موعد الزيارة",
      type: "functional",
      priority: "medium",
      status: "draft",
      source: "features",
      sourceText: project.answers.features.text,
      acceptance: "",
      history: ["قناة التذكير ووقته بحاجة إلى تحديد"],
    },
    {
      id: "REQ-004",
      title: "واجهة عربية متجاوبة مع الموبايل",
      type: "quality",
      priority: "high",
      status: "approved",
      source: "constraints",
      sourceText: project.answers.constraints.text,
      acceptance: "يمكن إتمام الحجز من شاشة بعرض 360 بكسل دون تمرير أفقي.",
      history: ["اعتمده المحلل في بيانات العرض"],
    },
  ];
  project.decisions = [
    {
      id: "reminder",
      title: "ما قناة التذكير وكم يسبق الموعد؟",
      resolution: "",
      resolved: false,
    },
    {
      id: "cancel",
      title: "ما المدة المسموحة لإلغاء الحجز؟",
      resolution: "",
      resolved: false,
    },
  ];
  project.activity = [
    "أُضيفت ٤ متطلبات من المقابلة التجريبية",
    "اعتماد متطلبَي المواعيد والواجهة العربية",
    "بقيت نقطتان بحاجة إلى قرار",
  ];
  return project;
}
