"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  KeyRound,
  Link2,
  MessageSquareText,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import {
  newId,
  createCode,
  csv,
  invitationError,
  priorityLabels,
  progress,
  QUESTIONS,
  statusLabels,
  type Project,
  type Requirement,
  type Status,
} from "@/lib/workspace";
import { Badge, CopyButton, download, Empty, Forward, Modal } from "./ui";
import { AudioPlayback } from "./VoiceRecorder";
const date = (value: string) =>
  new Date(value).toLocaleDateString("ar-PS", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export function Overview({ project: p }: { project: Project }) {
  const approved = p.requirements.filter((r) => r.status === "approved").length;
  return (
    <>
      <div className="overview-grid">
        <section className="panel project-brief">
          <div className="section-title">
            <h2>الصورة الكبيرة</h2>
            <span className="label-tag">PROJECT BRIEF</span>
          </div>
          <p className="lead">{p.description}</p>
          <div className="scope-block">
            <span className="eyebrow">نطاق النسخة الأولى</span>
            <p>{p.scope || "نكتشف حدود النطاق مع الزبون خلال المقابلة."}</p>
          </div>
          <div className="brief-meta">
            <span>
              <Users size={17} />
              {p.client}
            </span>
            <span>
              <Clock3 size={17} />
              أنشئ {date(p.createdAt)}
            </span>
          </div>
        </section>
        <section className="panel progress-panel">
          <div
            className="ring"
            style={{ "--progress": `${progress(p)}%` } as React.CSSProperties}
          >
            <div>
              <strong>
                {progress(p)}
                <small>%</small>
              </strong>
              <span>تغطية المقابلة</span>
            </div>
          </div>
          <h3>
            {p.submitted
              ? "وصلت الإجابات. دورك الآن."
              : "كل إجابة تقرّب الصورة."}
          </h3>
          <p>
            {p.submitted
              ? "راجع المصادر قبل اعتماد أي متطلب."
              : "شارك كود المشروع مع الزبون ليبدأ الحوار."}
          </p>
          <Forward
            path={`/project/${p.id}/${p.submitted ? "requirements" : "invites"}`}
            secondary
          >
            {p.submitted ? "مراجعة المتطلبات" : "إدارة الدعوة"}
          </Forward>
        </section>
      </div>
      <div className="overview-grid lower">
        <section className="panel">
          <div className="section-title">
            <h2>رحلة المشروع</h2>
            <span className="muted">خطوة بخطوة</span>
          </div>
          {[
            ["تأسيس المشروع", "الفكرة والأطراف وحدود النطاق", true],
            ["مقابلة الزبون", `${progress(p)}% من المحاور مغطاة`, p.submitted],
            [
              "مراجعة المتطلبات",
              `${approved} من ${p.requirements.length} متطلبات معتمدة`,
              p.requirements.length > 0 && approved === p.requirements.length,
            ],
            [
              "تسليم نسخة مرجعية",
              `${p.versions.length} إصدارات محفوظة`,
              p.versions.length > 0,
            ],
          ].map(([title, sub, done], i) => (
            <div className="journey-row" key={i}>
              <span className={done ? "done" : ""}>
                {done ? <Check size={18} /> : i + 1}
              </span>
              <div>
                <h3>{String(title)}</h3>
                <p>{String(sub)}</p>
              </div>
              {done && <span className="muted">مكتمل</span>}
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="section-title">
            <h2>آخر النشاطات</h2>
            <span className="live-dot" />
          </div>
          <div className="activity-list">
            {p.activity.slice(0, 6).map((a, i) => (
              <div key={i}>
                <span className="activity-dot" />
                <p>{a}</p>
              </div>
            ))}
          </div>
          <a className="text-button" href={`#/project/${p.id}/decisions`}>
            راجع القرارات المعلقة <ArrowLeft size={16} />
          </a>
        </section>
      </div>
    </>
  );
}
export function Invites({ project: p }: { project: Project }) {
  const store = useWorkspace();
  const [confirm, setConfirm] = useState(false);
  const error = invitationError(p);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#/join?code=${p.code}`
      : "";
  const members = store.profiles.filter((profile) =>
    p.memberIds.includes(profile.id),
  );
  return (
    <>
      <div className="overview-grid">
        <section className="panel invite-panel">
          <div className="section-title">
            <h2>
              <KeyRound size={21} />
              دعوة الزبون
            </h2>
            <Badge status={error ? "warning" : "success"}>
              {error ? "غير متاحة" : "دعوة فعّالة"}
            </Badge>
          </div>
          <p>شارك الكود مع الزبون، ليصل مباشرة إلى مقابلة هذا المشروع.</p>
          <div className="invite-code" dir="ltr">
            {p.code}
          </div>
          <div className="actions">
            <CopyButton value={p.code} label="نسخ الكود" />
            <CopyButton value={link} label="نسخ رابط الدعوة" />
          </div>
          <small>تنتهي الصلاحية: {date(p.expiresAt)}</small>
          <div className="invite-controls">
            <button className="text-button" onClick={() => setConfirm(true)}>
              <RefreshCw size={16} />
              توليد كود جديد
            </button>
            <button
              className="text-button"
              onClick={() =>
                store.updateProject(p.id, { inviteActive: !p.inviteActive })
              }
            >
              {p.inviteActive ? "إيقاف الدعوة" : "تفعيل الدعوة"}
            </button>
          </div>
          {error && (
            <p className="error" role="status">
              {error}
            </p>
          )}
        </section>
        <section className="panel">
          <div className="eyebrow">حوار يبدأ بثقة</div>
          <h2>كيف يشارك الزبون؟</h2>
          <ol className="number-list">
            <li>يختار «أنا زبون» وينشئ ملفه.</li>
            <li>يدخل كود المشروع في شاشة الانضمام.</li>
            <li>يجيب عن الأسئلة، ويراجع ملخص إجاباته.</li>
            <li>يرسل المقابلة لتراجعها الشركة.</li>
          </ol>
          <div className="notice">
            <ShieldCheck size={20} />
            في هذا النموذج، الكود والملفات تعمل داخل نفس المتصفح فقط. المشاركة
            بين الأجهزة تحتاج ربط الباك إند.
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="section-title">
          <h2>
            المشاركون <span className="count">{members.length}</span>
          </h2>
        </div>
        {members.length ? (
          members.map((m) => (
            <div className="participant" key={m.id}>
              <span className="avatar">{m.name[0]}</span>
              <div>
                <b>{m.name}</b>
                <small>{m.email}</small>
              </div>
              <Badge status="success">انضم للمشروع</Badge>
            </div>
          ))
        ) : (
          <Empty
            title="بانتظار أول مشارك"
            body="بعد إدخال الكود سيظهر ملف الزبون هنا."
          />
        )}
      </section>
      {confirm && (
        <Modal title="تجديد كود الدعوة؟" close={() => setConfirm(false)}>
          <p>
            سيتوقف الكود القديم، ويصبح الجديد صالحًا لمدة ٧ أيام. تبقى الإجابات
            المحفوظة كما هي.
          </p>
          <div className="form-footer">
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              إلغاء
            </button>
            <button
              className="button primary"
              onClick={() => {
                store.updateProject(p.id, {
                  code: createCode(),
                  inviteActive: true,
                  expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
                });
                setConfirm(false);
              }}
            >
              تجديد الكود
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function InterviewReview({ project: p }: { project: Project }) {
  const update = useWorkspace((s) => s.updateProject);
  const [note, setNote] = useState(p.notes);
  const [saved, setSaved] = useState(false);
  return (
    <div className="review-layout">
      <section>
        <div className="section-title">
          <h2>الحوار الأصلي</h2>
          <Badge status={p.submitted ? "success" : "draft"}>
            {p.submitted ? "أُرسلت للمراجعة" : "قيد الإجابة"}
          </Badge>
        </div>
        {Object.entries(p.answers).length ? (
          QUESTIONS.filter((q) => p.answers[q.id]).map((q, i) => (
            <article className="transcript panel" key={q.id}>
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} / {q.topic}
              </span>
              <h3>{q.question}</h3>
              <blockquote>
                {p.answers[q.id].deferred
                  ? `أجّل الزبون هذه النقطة للمناقشة.${p.answers[q.id].text ? ` ملاحظته: ${p.answers[q.id].text}` : ""}`
                  : p.answers[q.id].text}
              </blockquote>
              {p.answers[q.id].audioId && (
                <AudioPlayback id={p.answers[q.id].audioId!} />
              )}
              <small className="muted">
                آخر تعديل: {date(p.answers[q.id].updatedAt)}
              </small>
            </article>
          ))
        ) : (
          <Empty
            title="الحوار لم يبدأ بعد"
            body="أرسل كود الدعوة للزبون لتبدأ الإجابات بالظهور هنا."
          />
        )}
      </section>
      <aside className="panel sticky-panel">
        <h2>ملاحظات المحلل</h2>
        <p>سجّل الملاحظات التي ستأخذها للاجتماع القادم.</p>
        <label>
          <span className="sr-only">ملاحظات المحلل</span>
          <textarea
            rows={9}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
            placeholder="نقطة تحتاج توضيحًا، استثناء مهم..."
          />
        </label>
        <button
          className="button secondary full"
          onClick={() => {
            update(p.id, { notes: note });
            setSaved(true);
          }}
        >
          حفظ الملاحظات
        </button>
        <span role="status" className="success-text">
          {saved ? "تم حفظ الملاحظات" : ""}
        </span>
        {p.submitted && (
          <button
            className="text-button"
            onClick={() =>
              update(p.id, {
                submitted: false,
                activity: ["أعاد المحلل فتح المقابلة للتوضيح", ...p.activity],
              })
            }
          >
            إعادة فتح المقابلة للزبون <RefreshCw size={15} />
          </button>
        )}
        <div className="notice">
          الإجابات الأصلية تبقى مرجعًا؛ صياغة المتطلبات تتم في شاشة المتطلبات.
        </div>
      </aside>
    </div>
  );
}
export function Requirements({ project: p }: { project: Project }) {
  const store = useWorkspace();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [newReq, setNewReq] = useState(false);
  const rows = p.requirements.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      `${r.title} ${r.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  const approved = p.requirements.filter((r) => r.status === "approved").length;
  return (
    <>
      <div className="section-title">
        <div>
          <h2>
            المتطلبات <span className="count">{p.requirements.length}</span>
          </h2>
          <p>كل متطلب قابل للتتبّع. وكل اعتماد قرار منك.</p>
        </div>
        <button className="button secondary" onClick={() => setNewReq(true)}>
          <Plus size={17} />
          إضافة متطلب
        </button>
      </div>
      <div className="requirements-summary">
        <span>
          <i className="legend-dot approved" />
          {approved} معتمد
        </span>
        <span>
          <i className="legend-dot review" />
          {p.requirements.filter((r) => r.status === "review").length} قيد
          المراجعة
        </span>
        <span>
          <i className="legend-dot draft" />
          {p.requirements.filter((r) => r.status === "draft").length} مسودة
        </span>
        <span className="muted">
          {p.requirements.length
            ? Math.round((approved / p.requirements.length) * 100)
            : 0}
          % جاهز للتسليم
        </span>
      </div>
      <div className="toolbar">
        <div className="tabs">
          {[["all", "الكل"], ...Object.entries(statusLabels)].map(
            ([id, label]) => (
              <button
                key={id}
                aria-pressed={filter === id}
                className={filter === id ? "active" : ""}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ),
          )}
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="البحث في المتطلبات"
            placeholder="ابحث بالرقم أو الوصف..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {rows.length ? (
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>المعرّف</th>
                <th>المتطلب</th>
                <th>الأولوية</th>
                <th>الحالة</th>
                <th>المصدر</th>
                <th>
                  <span className="sr-only">تفاصيل</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button
                      className="mono text-button"
                      onClick={() => setSelected(r)}
                    >
                      {r.id}
                    </button>
                  </td>
                  <td>
                    <button
                      className="requirement-title"
                      onClick={() => setSelected(r)}
                    >
                      {r.title}
                    </button>
                    <small>
                      {r.type === "functional" ? "متطلب وظيفي" : "متطلب جودة"}
                    </small>
                  </td>
                  <td>
                    <span className={"priority " + r.priority}>
                      {priorityLabels[r.priority]}
                    </span>
                  </td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                  <td>
                    <button
                      className="source-button"
                      onClick={() => setSelected(r)}
                    >
                      <Link2 size={15} />
                      {r.source === "analyst" ? "المحلل" : "إجابة الزبون"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`تفاصيل ${r.id}`}
                      onClick={() => setSelected(r)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title="لا توجد متطلبات في هذه القائمة"
          body="عدّل التصفية، أو أضف متطلبًا يدويًا، أو انتظر إرسال المقابلة."
        />
      )}
      <div className="notice">
        <ShieldCheck size={18} />
        المسودات المستخرجة في هذا النموذج مبنية على الإجابات مباشرة. راجع
        الصياغة ومعيار القبول قبل الاعتماد.
      </div>
      {(selected || newReq) && (
        <RequirementEditor
          key={selected?.id || "new"}
          requirement={selected}
          close={() => {
            setSelected(null);
            setNewReq(false);
          }}
          save={(patch) => {
            if (selected) store.updateRequirement(p.id, selected.id, patch);
            else {
              const r: Requirement = {
                id: `REQ-${String(p.requirements.length + 1).padStart(3, "0")}`,
                title: patch.title!,
                type: patch.type!,
                priority: patch.priority!,
                acceptance: patch.acceptance!,
                status: "draft",
                source: "analyst",
                sourceText:
                  patch.sourceText ||
                  "أضافه المحلل يدويًا؛ يحتاج التحقق مع الزبون.",
                history: ["أضيف يدويًا بواسطة المحلل"],
              };
              store.updateProject(p.id, {
                requirements: [...p.requirements, r],
              });
            }
            setSelected(null);
            setNewReq(false);
          }}
        />
      )}
    </>
  );
}
function RequirementEditor({
  requirement: r,
  close,
  save,
}: {
  requirement: Requirement | null;
  close: () => void;
  save: (patch: Partial<Requirement>) => void;
}) {
  const [title, setTitle] = useState(r?.title || "");
  const [acceptance, setAcceptance] = useState(r?.acceptance || "");
  const [type, setType] = useState<Requirement["type"]>(
    r?.type || "functional",
  );
  const [priority, setPriority] = useState<Requirement["priority"]>(
    r?.priority || "medium",
  );
  const [status, setStatus] = useState<Status>(r?.status || "draft");
  const [source, setSource] = useState("");
  return (
    <Modal title={r ? `مراجعة ${r.id}` : "متطلب جديد"} close={close}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim())
            save({
              title: title.trim(),
              acceptance: acceptance.trim(),
              type,
              priority,
              status,
              ...(!r ? { sourceText: source } : {}),
            });
        }}
      >
        <label>
          وصف المتطلب
          <textarea
            required
            rows={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={3000}
          />
        </label>
        <div className="two-fields">
          <label>
            النوع
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Requirement["type"])}
            >
              <option value="functional">وظيفي</option>
              <option value="quality">جودة / غير وظيفي</option>
            </select>
          </label>
          <label>
            الأولوية
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as Requirement["priority"])
              }
            >
              {Object.entries(priorityLabels).map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          معيار القبول
          <textarea
            value={acceptance}
            onChange={(e) => setAcceptance(e.target.value)}
            required={status === "approved"}
            rows={3}
            placeholder="متى نعتبر هذا المتطلب منفذًا بشكل صحيح؟"
          />
        </label>
        {r ? (
          <>
            <div className="source-block">
              <span className="eyebrow">
                <Link2 size={14} />
                المصدر الأصلي
              </span>
              <blockquote>{r.sourceText}</blockquote>
            </div>
            <label>
              حالة المراجعة
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                {Object.entries(statusLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            {r.status === "approved" && (
              <div className="notice">
                تعديل محتوى متطلب معتمد يعيده إلى المراجعة. تبقى النسخ المرجعية
                السابقة محفوظة.
              </div>
            )}
            <details>
              <summary>سجل المراجعة ({r.history.length})</summary>
              <ul className="history-list">
                {r.history.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </details>
          </>
        ) : (
          <label>
            مرجع أو ملاحظة المصدر
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              rows={2}
              placeholder="من طلب هذا المتطلب؟"
            />
          </label>
        )}
        <div className="form-footer">
          <button type="button" className="button secondary" onClick={close}>
            إلغاء
          </button>
          <button className="button primary">
            <Check size={17} />
            حفظ المراجعة
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function Decisions({ project: p }: { project: Project }) {
  const update = useWorkspace((s) => s.updateProject);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("open");
  const list = p.decisions.filter(
    (d) => filter === "all" || (filter === "open" ? !d.resolved : d.resolved),
  );
  return (
    <>
      <div className="section-title">
        <div>
          <h2>نقاط تستحق اتفاقًا</h2>
          <p>اترك الغموض ظاهرًا حتى يُحسم، بدل تحويله إلى افتراض.</p>
        </div>
        <div className="tabs">
          {[
            ["open", "معلّقة"],
            ["resolved", "محسومة"],
            ["all", "الكل"],
          ].map(([v, l]) => (
            <button
              key={v}
              className={filter === v ? "active" : ""}
              aria-pressed={filter === v}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <form
        className="add-decision"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) {
            update(p.id, {
              decisions: [
                ...p.decisions,
                {
                  id: newId(),
                  title: title.trim(),
                  resolved: false,
                  resolution: "",
                },
              ],
            });
            setTitle("");
          }
        }}
      >
        <input
          aria-label="نقطة جديدة للنقاش"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أضف سؤالًا للاجتماع القادم..."
          required
          maxLength={500}
        />
        <button className="button secondary">
          <Plus size={18} />
          إضافة
        </button>
      </form>
      {list.length ? (
        <div className="decision-list">
          {list.map((d, i) => (
            <form
              className="panel decision-card"
              key={d.id + String(d.resolved)}
              onSubmit={(e) => {
                e.preventDefault();
                const resolution = String(
                  new FormData(e.currentTarget).get("resolution"),
                ).trim();
                if (resolution)
                  update(p.id, {
                    decisions: p.decisions.map((item) =>
                      item.id === d.id
                        ? { ...item, resolution, resolved: true }
                        : item,
                    ),
                  });
              }}
            >
              <div className="decision-index">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="decision-content">
                <div className="section-title">
                  <h3>{d.title}</h3>
                  <Badge status={d.resolved ? "success" : "warning"}>
                    {d.resolved ? "محسوم" : "بحاجة إلى قرار"}
                  </Badge>
                </div>
                {d.resolved ? (
                  <>
                    <p>{d.resolution}</p>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() =>
                        update(p.id, {
                          decisions: p.decisions.map((item) =>
                            item.id === d.id
                              ? { ...item, resolved: false }
                              : item,
                          ),
                        })
                      }
                    >
                      إعادة فتح النقاش
                    </button>
                  </>
                ) : (
                  <>
                    <label>
                      <span className="sr-only">القرار المتفق عليه</span>
                      <textarea
                        name="resolution"
                        defaultValue={d.resolution}
                        required
                        rows={2}
                        placeholder="اكتب القرار المتفق عليه مع الزبون..."
                      />
                    </label>
                    <button className="button secondary">
                      <CheckCheck size={17} />
                      تسجيل القرار
                    </button>
                  </>
                )}
              </div>
            </form>
          ))}
        </div>
      ) : (
        <Empty
          title={
            filter === "open" ? "لا توجد قرارات معلّقة" : "لا توجد قرارات هنا"
          }
          body="أضف النقاط التي تحتاج نقاشًا، وسجّل نتيجة الاتفاق عندما تتضح."
        />
      )}
    </>
  );
}
export function Reports({ project: p }: { project: Project }) {
  const snapshot = useWorkspace((s) => s.snapshot);
  const [version, setVersion] = useState("current");
  const current = p.requirements.filter((r) => r.status === "approved");
  const chosen = p.versions.find((v) => v.id === version);
  const requirements = chosen ? chosen.requirements : current;
  const reportProject = { ...p, requirements };
  return (
    <>
      <div className="section-title no-print">
        <div>
          <h2>جاهز ليكون مرجعًا.</h2>
          <p>
            التصدير يضم المتطلبات المعتمدة فقط؛ القرارات المعلقة تبقى واضحة.
          </p>
        </div>
        <div className="actions">
          <button
            disabled={!current.length}
            className="button secondary"
            onClick={() => snapshot(p.id)}
          >
            <FileCheck2 size={17} />
            حفظ إصدار مرجعي
          </button>
          <button
            disabled={!requirements.length}
            className="button secondary"
            onClick={() =>
              download(
                csv(reportProject),
                "text/csv;charset=utf-8",
                `LogicRift-${p.id}-requirements.csv`,
              )
            }
          >
            <Download size={17} />
            CSV
          </button>
          <button className="button primary" onClick={() => window.print()}>
            <Printer size={17} />
            طباعة / PDF
          </button>
        </div>
      </div>
      <div className="report-layout">
        <aside className="panel no-print">
          <h3>الإصدارات</h3>
          <button
            className={
              "version-button " + (version === "current" ? "selected" : "")
            }
            onClick={() => setVersion("current")}
          >
            <FileText size={17} />
            <span>
              المراجعة الحالية<small>{current.length} متطلبات معتمدة</small>
            </span>
          </button>
          {p.versions.map((v) => (
            <button
              className={
                "version-button " + (version === v.id ? "selected" : "")
              }
              onClick={() => setVersion(v.id)}
              key={v.id}
            >
              <FileCheck2 size={17} />
              <span>
                {v.id}
                <small>
                  {date(v.date)} · {v.requirements.length} متطلبات
                </small>
              </span>
            </button>
          ))}
          <div className="notice">
            الإصدارات تحفظ نسخة ثابتة من المتطلبات المعتمدة. ملخص المشروع
            والقرارات يعكسان الوضع الحالي.
          </div>
        </aside>
        <article className="report-paper">
          <div className="report-brand">
            <b dir="ltr">
              LogicRift<span> / PROJECT BRIEF</span>
            </b>
            <span>{version === "current" ? "نسخة المراجعة" : version}</span>
          </div>
          <div className="eyebrow">وثيقة متطلبات المشروع</div>
          <h1>{p.name}</h1>
          <p className="report-meta">
            {p.client} · {chosen ? date(chosen.date) : "الوضع الحالي"}
          </p>
          <h2>01 / الهدف والنطاق</h2>
          <p>{p.description}</p>
          <p>{p.scope || "لم يُحدد النطاق النهائي بعد."}</p>
          <h2>
            02 / المتطلبات المعتمدة <span>({requirements.length})</span>
          </h2>
          {requirements.length ? (
            requirements.map((r) => (
              <section className="report-requirement" key={r.id}>
                <b>
                  {r.id} — {r.title}
                </b>
                <p>معيار القبول: {r.acceptance || "بحاجة إلى استكمال"}</p>
                <small>المصدر: {r.sourceText}</small>
              </section>
            ))
          ) : (
            <p>لا توجد متطلبات معتمدة في هذه النسخة.</p>
          )}
          <h2>03 / أجندة الاجتماع القادم</h2>
          {p.decisions.some((d) => !d.resolved) ? (
            <ul>
              {p.decisions
                .filter((d) => !d.resolved)
                .map((d) => (
                  <li key={d.id}>{d.title}</li>
                ))}
            </ul>
          ) : (
            <p>لا توجد قرارات معلّقة حاليًا.</p>
          )}
          <h2>04 / القرارات المتفق عليها</h2>
          {p.decisions
            .filter((d) => d.resolved)
            .map((d) => (
              <p key={d.id}>
                <b>{d.title}</b>
                <br />
                {d.resolution}
              </p>
            ))}
          {!p.decisions.some((d) => d.resolved) && <p>لم تُسجّل قرارات بعد.</p>}
          <footer>
            أُعدت باستخدام LogicRift · نموذج واجهات تجريبي · اعتماد المتطلبات
            مسؤولية فريق المشروع
          </footer>
        </article>
      </div>
    </>
  );
}
export function Settings({ project: p }: { project: Project }) {
  const update = useWorkspace((s) => s.updateProject);
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="panel settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        update(p.id, {
          name: String(data.get("name")).trim(),
          client: String(data.get("client")).trim(),
          description: String(data.get("description")).trim(),
          scope: String(data.get("scope")).trim(),
        });
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
    >
      <div className="section-title">
        <h2>تفاصيل المشروع</h2>
        <ShieldCheck className="copper" />
      </div>
      <label>
        اسم المشروع
        <input
          required
          name="name"
          defaultValue={p.name}
          pattern=".*\S.*"
          maxLength={100}
        />
      </label>
      <label>
        الزبون أو الجهة
        <input
          required
          name="client"
          defaultValue={p.client}
          pattern=".*\S.*"
          maxLength={100}
        />
      </label>
      <label>
        الفكرة والهدف
        <textarea
          required
          name="description"
          defaultValue={p.description}
          rows={4}
        />
      </label>
      <label>
        نطاق النسخة الأولى
        <textarea name="scope" defaultValue={p.scope} rows={4} />
      </label>
      <div className="form-footer">
        <span role="status" className="success-text">
          {saved ? "تم حفظ التعديلات" : ""}
        </span>
        <button className="button primary">
          <CheckCircle2 size={18} />
          حفظ التعديلات
        </button>
      </div>
    </form>
  );
}
