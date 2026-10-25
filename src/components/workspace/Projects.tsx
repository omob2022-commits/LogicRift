"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  FolderOpen,
  LayoutGrid,
  List,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { progress, type Profile, type Project } from "@/lib/workspace";
import { Badge, Empty, Forward, go, PageHeading } from "./ui";
export function Projects({ profile }: { profile: Profile }) {
  const store = useWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");
  const company = profile.role === "company";
  const all = store.projects.filter((p) =>
    company ? p.ownerId === profile.id : p.memberIds.includes(profile.id),
  );
  const projects = all.filter(
    (p) =>
      `${p.name} ${p.client} ${p.sector}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" || (filter === "review" ? p.submitted : !p.submitted)),
  );
  const requirements = all.flatMap((p) => p.requirements);
  return (
    <>
      <PageHeading
        eyebrow="مساحة العمل / المشاريع"
        title={`أهلًا ${profile.name.split(" ")[0]}، خلّينا نبني بوضوح.`}
        description="كل فكرة في مكانها. وكل خطوة تقرّبك من الصورة الكاملة."
      >
        {company ? (
          <Forward path="/projects/new">
            مشروع جديد <Plus size={17} />
          </Forward>
        ) : (
          <Forward path="/join">
            الانضمام بكود <Plus size={17} />
          </Forward>
        )}
      </PageHeading>
      <div className="stats-grid">
        {[
          [
            FolderOpen,
            all.length,
            "مشاريع في المساحة",
            "كل أفكارك، في مكان واحد",
          ],
          [
            MessageIcon,
            all.filter((p) => !p.submitted).length,
            "مقابلات جارية",
            "الحوار يصنع التفاصيل",
          ],
          [
            CircleCheck,
            requirements.filter((r) => r.status === "approved").length,
            "متطلبات معتمدة",
            "خطوات واضحة للتنفيذ",
          ],
          [
            Clock3,
            all.flatMap((p) => p.decisions).filter((d) => !d.resolved).length,
            "قرارات معلّقة",
            "نقاط تستحق النقاش",
          ],
        ].map(([Icon, value, title, desc], i) => {
          const I = Icon as typeof FolderOpen;
          return (
            <article className="stat" key={i}>
              <div>
                <span>{String(title)}</span>
                <I size={18} />
              </div>
              <strong>{String(value).padStart(2, "0")}</strong>
              <small>{String(desc)}</small>
            </article>
          );
        })}
      </div>
      <div className="section-title">
        <div>
          <h2>
            {company ? "مشاريعك" : "المشاريع التي انضممت إليها"}{" "}
            <span className="count">{all.length}</span>
          </h2>
          <p>من أول سؤال، إلى آخر متطلب.</p>
        </div>
      </div>
      <div className="toolbar">
        <div className="tabs" aria-label="تصفية المشاريع">
          {[
            ["all", "كل المشاريع"],
            ["active", "قيد الاكتشاف"],
            ["review", "جاهزة للمراجعة"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={filter === value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="toolbar-end">
          <label className="search-field">
            <Search size={17} />
            <input
              aria-label="البحث في المشاريع"
              placeholder="ابحث عن مشروع..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="view-switch">
            <button
              aria-label="عرض شبكي"
              aria-pressed={view === "grid"}
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="عرض قائمة"
              aria-pressed={view === "list"}
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      {!projects.length ? (
        <Empty
          title={
            all.length ? "ما لقينا مشروعًا مطابقًا" : "أول فكرة تبدأ من هون."
          }
          body={
            all.length
              ? "جرّب اسمًا مختلفًا أو غيّر التصفية."
              : "أنشئ مشروعك، وخلّينا نحوّل الحوار إلى خطوات واضحة."
          }
        >
          {all.length ? (
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              مسح التصفية
            </button>
          ) : (
            <Forward path={company ? "/projects/new" : "/join"}>
              {company ? "إنشاء أول مشروع" : "إدخال كود المشروع"}
            </Forward>
          )}
        </Empty>
      ) : (
        <div className={"project-grid " + (view === "list" ? "list-view" : "")}>
          {projects.map((p, i) => (
            <a
              className="project-card"
              key={p.id}
              href={
                company
                  ? `#/project/${p.id}/overview`
                  : `#/interview/${p.id}/welcome`
              }
            >
              <div className="project-card-top">
                <span className={"project-symbol tone-" + (i % 3)}>
                  <BriefcaseBusiness size={24} />
                </span>
                <Badge status={p.submitted ? "review" : "draft"}>
                  {p.submitted ? "جاهز للمراجعة" : "قيد الاكتشاف"}
                </Badge>
                <ArrowUpLeft className="card-arrow" size={19} />
              </div>
              <div className="project-card-body">
                <small className="muted">{p.sector}</small>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
              </div>
              <div className="project-progress">
                <div>
                  <span>تغطية المقابلة</span>
                  <b>{progress(p)}%</b>
                </div>
                <div className="progress-track">
                  <i style={{ width: progress(p) + "%" }} />
                </div>
              </div>
              <div className="project-card-footer">
                <span>
                  <Users size={15} />
                  {p.client}
                </span>
                <span>{p.requirements.length} متطلبات</span>
              </div>
            </a>
          ))}
          {company && !query && filter === "all" && (
            <a href="#/projects/new" className="new-project-card">
              <span>
                <Plus size={27} />
              </span>
              <h3>مساحة لفكرتك القادمة</h3>
              <p>مشروع جديد، بداية واضحة.</p>
            </a>
          )}
        </div>
      )}
      <div className="bottom-tip">
        <div className="tip-icon">
          <Check size={20} />
        </div>
        <div>
          <h3>الوضوح مش بكثرة المتطلبات.</h3>
          <p>اربط كل متطلب بمصدره، واحسم الأسئلة المهمة قبل بدء التنفيذ.</p>
        </div>
        <a href="#/guide">
          دليل الاستخدام <ArrowLeft size={16} />
        </a>
      </div>
    </>
  );
}
const MessageIcon = CalendarDays;
export function NewProject() {
  const add = useWorkspace((s) => s.addProject);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    client: "",
    sector: "الصحة والمواعيد",
    description: "",
    scope: "",
  });
  const update = (key: keyof typeof data, value: string) =>
    setData((d) => ({ ...d, [key]: value }));
  return (
    <>
      <PageHeading
        eyebrow="المشاريع / مشروع جديد"
        title="أعطِ فكرتك نقطة انطلاق."
        description="نحتاج الأساسيات فقط. التفاصيل نكتشفها خلال الحوار."
      />
      <div className="creation-layout">
        <aside className="steps-panel">
          {["تعريف المشروع", "الهدف والنطاق", "جاهز للانطلاق"].map((s, i) => (
            <div className={"step-row " + (step === i ? "active" : "")} key={s}>
              <span>{step > i ? <Check size={17} /> : `0${i + 1}`}</span>
              <div>
                <b>{s}</b>
                <small>
                  {
                    [
                      "اسم واضح وأطراف معروفون",
                      "ما الذي نريد تحقيقه؟",
                      "راجع وأنشئ الدعوة",
                    ][i]
                  }
                </small>
              </div>
            </div>
          ))}
          <div className="notice">
            ابدأ بنطاق صغير وواضح؛ يمكن تعديله من إعدادات المشروع لاحقًا.
          </div>
        </aside>
        <form
          className="panel create-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 2) setStep(step + 1);
            else {
              const id = add(data);
              if (id) go(`/project/${id}/invites`);
            }
          }}
        >
          <div className="eyebrow">الخطوة {step + 1} من 3</div>
          <h2>
            {
              [
                "خلّينا نعرف المشروع.",
                "ما الذي نحاول تغييره؟",
                "نظرة أخيرة قبل البداية.",
              ][step]
            }
          </h2>
          {step === 0 && (
            <>
              <label>
                اسم المشروع
                <input
                  autoFocus
                  required
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  pattern=".*\S.*"
                  maxLength={100}
                  placeholder="مثل: موعد — منصة حجز العيادات"
                />
              </label>
              <label>
                اسم الزبون أو الجهة
                <input
                  required
                  value={data.client}
                  onChange={(e) => update("client", e.target.value)}
                  pattern=".*\S.*"
                  maxLength={100}
                  placeholder="لمن نبني هذا المشروع؟"
                />
              </label>
              <label>
                مجال المشروع
                <select
                  value={data.sector}
                  onChange={(e) => update("sector", e.target.value)}
                >
                  {[
                    "الصحة والمواعيد",
                    "الخدمات والحجوزات",
                    "التجارة الإلكترونية",
                    "التعليم",
                    "مجال آخر",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          {step === 1 && (
            <>
              <label>
                الفكرة والمشكلة
                <textarea
                  required
                  autoFocus
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  maxLength={2000}
                  placeholder="صف الوضع الحالي والنتيجة التي تريد الوصول إليها."
                  rows={5}
                />
              </label>
              <label>
                حدود النسخة الأولى <span className="optional">اختياري</span>
                <textarea
                  value={data.scope}
                  onChange={(e) => update("scope", e.target.value)}
                  maxLength={1000}
                  placeholder="ما الذي سننفذه الآن؟ وما الذي سنؤجله؟"
                  rows={3}
                />
              </label>
            </>
          )}
          {step === 2 && (
            <div className="review-fields">
              {Object.entries({
                "اسم المشروع": data.name,
                الزبون: data.client,
                المجال: data.sector,
                الفكرة: data.description,
                النطاق: data.scope || "نحدده خلال المقابلة",
              }).map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <p>{v}</p>
                </div>
              ))}
              <div className="notice">
                <Check size={18} />
                سننشئ كود دعوة صالحًا لمدة ٧ أيام. تستطيع إيقافه أو تجديده.
              </div>
            </div>
          )}
          <div className="form-footer">
            <button
              type="button"
              className="button secondary"
              onClick={() => (step ? setStep(step - 1) : go("/projects"))}
            >
              {step ? "السابق" : "إلغاء"}
            </button>
            <button className="button primary">
              {step === 2 ? "إنشاء المشروع والدعوة" : "الخطوة التالية"}
              <ArrowLeft size={17} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export function ProjectHeader({
  project,
  section,
}: {
  project: Project;
  section: string;
}) {
  return (
    <>
      <div className="breadcrumbs">
        <a href="#/projects">المشاريع</a>
        <span>/</span>
        <span>{project.name}</span>
      </div>
      <PageHeading
        eyebrow={project.sector}
        title={project.name}
        description={project.client}
      >
        <Badge status={project.submitted ? "review" : "draft"}>
          {project.submitted ? "جاهز للمراجعة" : "قيد الاكتشاف"}
        </Badge>
      </PageHeading>
      <nav className="project-tabs">
        {[
          ["overview", "نظرة عامة"],
          ["invites", "الدعوات والمشاركون"],
          ["interviews", "المقابلة"],
          ["requirements", "المتطلبات"],
          ["decisions", "القرارات"],
          ["reports", "التقرير والتسليم"],
          ["settings", "الإعدادات"],
        ].map(([id, label]) => (
          <a
            key={id}
            aria-current={section === id ? "page" : undefined}
            className={section === id ? "active" : ""}
            href={`#/project/${project.id}/${id}`}
          >
            {label}
            {id === "requirements" && (
              <span>{project.requirements.length}</span>
            )}
          </a>
        ))}
      </nav>
    </>
  );
}
