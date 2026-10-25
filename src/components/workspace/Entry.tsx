"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Building2,
  Check,
  CircleDot,
  Fingerprint,
  KeyRound,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { Brand, Forward, go } from "./ui";
import type { Profile, Role } from "@/lib/workspace";

export function Landing() {
  const demo = useWorkspace((s) => s.demo);
  return (
    <div className="landing">
      <header className="public-nav">
        <Brand />
        <nav>
          <a href="#/guide">كيف يعمل؟</a>
          <a href="#/login">تسجيل الدخول</a>
          <Forward path="/signup">ابدأ مساحتك</Forward>
        </nav>
      </header>
      <main className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> من الفكرة إلى اتفاق واضح
          </div>
          <h1>
            كل مشروع عظيم،
            <br />
            يبدأ <span>بفهم أعمق.</span>
          </h1>
          <p>
            مساحة مشتركة للشركات وزبائنها. حوار موجّه، متطلبات مرتبطة بمصدرها،
            وقرارات يعرف الجميع أين وصلت.
          </p>
          <div className="actions">
            <Forward path="/signup">أنشئ مساحة الشركة</Forward>
            <Forward path="/join" secondary>
              عندي كود مشروع
            </Forward>
          </div>
          <button
            className="text-button demo-link"
            onClick={() => {
              demo();
              go("/projects");
            }}
          >
            استكشف مشروعًا تجريبيًا <ArrowLeft size={17} />
          </button>
          <div className="hero-trust">
            <span>
              <Check size={15} />
              عربي من البداية
            </span>
            <span>
              <Check size={15} />
              قرار بشري، دائمًا
            </span>
            <span>
              <Check size={15} />
              كل متطلب له مصدر
            </span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="مثال يوضح تحويل الحوار إلى متطلبات"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-label" dir="ltr">
            THE SPACE BETWEEN
            <br />
            AN IDEA & A PLAN.
          </div>
          <div className="floating-card conversation">
            <div className="mini-label">
              <span className="avatar small">م</span> من حوار الزبون{" "}
              <span className="muted">01</span>
            </div>
            <p>
              «بدي المريض يختار موعده بسهولة،
              <br />
              بدون ما يضطر يتصل بالعيادة.»
            </p>
            <div className="waveform">
              {Array.from({ length: 27 }, (_, i) => (
                <i key={i} style={{ height: `${10 + ((i * 17) % 27)}px` }} />
              ))}
            </div>
          </div>
          <div className="connector-line" />
          <div className="art-node">
            <Layers3 size={28} />
          </div>
          <div className="floating-card extracted">
            <div className="mini-label">
              <span className="copper">REQ-001</span>
              <span className="badge approved">
                <Check size={12} />
                متطلب واضح
              </span>
            </div>
            <h3>حجز موعد حسب الوقت المتاح</h3>
            <p>
              يستطيع المريض اختيار الطبيب والتاريخ، ثم تأكيد أحد المواعيد
              المتاحة.
            </p>
            <div className="source-mini">
              <MessageSquareText size={14} />
              مرتبط بإجابة الزبون الأصلية
            </div>
          </div>
          <span className="art-coordinate" dir="ltr">
            LR / 01 — CLARITY BY DESIGN
          </span>
        </div>
      </main>
      <section className="landing-bottom">
        <div>
          <span>01 / استمع</span>
          <h3>مساحة للفكرة بصوت صاحبها</h3>
        </div>
        <div>
          <span>02 / افهم</span>
          <h3>أسئلة تكشف ما بين السطور</h3>
        </div>
        <div>
          <span>03 / اتفق</span>
          <h3>متطلبات قابلة للمراجعة</h3>
        </div>
      </section>
      <footer className="public-footer">
        <span dir="ltr">LogicRift © 2026</span>
        <span>نسخة واجهات تفاعلية · البيانات محفوظة في هذا المتصفح</span>
      </footer>
    </div>
  );
}
export function Auth({
  login = false,
  next = "",
}: {
  login?: boolean;
  next?: string;
}) {
  const store = useWorkspace();
  const [role, setRole] = useState<Role>(
    next.startsWith("/join") ? "client" : "company",
  );
  const [error, setError] = useState("");
  const destination = (r: Role) =>
    next || (r === "company" ? "/projects" : "/join");
  return (
    <div className="auth-page">
      <header className="public-nav">
        <Brand />
        <a className="text-button" href="#/">
          العودة للرئيسية <ArrowLeft size={16} />
        </a>
      </header>
      <main className="auth-layout">
        <aside className="auth-story">
          <div className="eyebrow">وضوح من أول خطوة</div>
          <h1>
            طرفان.
            <br />
            رؤية <span className="copper">واحدة.</span>
          </h1>
          <p>
            سواء كنت تبني الحل أو تحمل الفكرة، هنا تبدأ المساحة التي تجمعكما.
          </p>
          <div className="story-path">
            <span>
              <Building2 />
              الشركة تنشئ المشروع
            </span>
            <i />
            <span>
              <KeyRound />
              كود يفتح باب الحوار
            </span>
            <i />
            <span>
              <MessageSquareText />
              الزبون يشارك التفاصيل
            </span>
            <i />
            <span>
              <ShieldCheck />
              مراجعة واتفاق واضح
            </span>
          </div>
        </aside>
        <section className="auth-card">
          <div className="eyebrow">YOUR NEXT CHAPTER</div>
          <h2>{login ? "أهلًا بعودتك." : "خلّينا نتعرّف عليك."}</h2>
          <p className="muted">
            {login
              ? "اختر ملفًا محليًا محفوظًا على هذا المتصفح."
              : "اختر دورك لنجهّز مساحة تناسبك."}
          </p>
          <div className="notice">
            <Fingerprint size={18} />
            <span>
              تجربة فرونت إند محلية. هذه ملفات عرض دون كلمة مرور أو مصادقة
              حقيقية؛ لا تستخدم بيانات حساسة.
            </span>
          </div>
          {login ? (
            <>
              <div className="profile-list">
                {store.profiles.length ? (
                  store.profiles.map((p) => (
                    <button
                      key={p.id}
                      className="profile-option"
                      onClick={() => {
                        store.signIn(p.id);
                        go(destination(p.role));
                      }}
                    >
                      <span className="avatar">{p.name[0]}</span>
                      <span>
                        <b>{p.name}</b>
                        <small>
                          {p.role === "company" ? p.company : "زبون"} ·{" "}
                          {p.email}
                        </small>
                      </span>
                      <ArrowUpLeft size={19} />
                    </button>
                  ))
                ) : (
                  <p className="empty-inline">
                    لسه ما في ملفات على هذا المتصفح. ابدأ بإنشاء ملف جديد.
                  </p>
                )}
              </div>
              <Forward
                secondary
                path={
                  "/signup" + (next ? "?next=" + encodeURIComponent(next) : "")
                }
              >
                إنشاء ملف جديد
              </Forward>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const result = store.register({
                  name: String(data.get("name")).trim(),
                  email: String(data.get("email")).trim(),
                  company: String(data.get("company") || "").trim(),
                  role,
                });
                if (result) setError(result);
                else go(destination(role));
              }}
            >
              <div className="role-options">
                <button
                  type="button"
                  className={role === "company" ? "selected" : ""}
                  aria-pressed={role === "company"}
                  onClick={() => setRole("company")}
                >
                  <Building2 />
                  <b>أنا شركة</b>
                  <small>أدير المشاريع والمتطلبات</small>
                </button>
                <button
                  type="button"
                  className={role === "client" ? "selected" : ""}
                  aria-pressed={role === "client"}
                  onClick={() => setRole("client")}
                >
                  <UserRound />
                  <b>أنا زبون</b>
                  <small>أشارك فكرة مشروعي</small>
                </button>
              </div>
              <label>
                الاسم الكامل
                <input
                  name="name"
                  required
                  maxLength={80}
                  pattern=".*\S.*"
                  autoComplete="name"
                  placeholder="كيف تحب نناديك؟"
                />
              </label>
              {role === "company" && (
                <label>
                  اسم الشركة
                  <input
                    name="company"
                    required
                    maxLength={100}
                    pattern=".*\S.*"
                    placeholder="اسم فريقك أو شركتك"
                  />
                </label>
              )}
              <label>
                البريد الإلكتروني
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  dir="ltr"
                  placeholder="you@company.com"
                />
              </label>
              <label className="checkbox">
                <input type="checkbox" required />
                أفهم أن هذا ملف تجريبي محفوظ على هذا الجهاز فقط.
              </label>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="button primary full">
                {role === "company" ? "إنشاء مساحة الشركة" : "إنشاء ملف الزبون"}
                <ArrowLeft size={18} />
              </button>
              <p className="auth-switch">
                عندك ملف محلي؟{" "}
                <a
                  href={
                    "#/login" +
                    (next ? "?next=" + encodeURIComponent(next) : "")
                  }
                >
                  تسجيل الدخول
                </a>
              </p>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
export function Join({
  profile,
  initialCode = "",
}: {
  profile?: Profile;
  initialCode?: string;
}) {
  const join = useWorkspace((s) => s.join);
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");
  const next = "/join?code=" + encodeURIComponent(code);
  return (
    <section className="join-wrap">
      <div className="join-icon">
        <KeyRound size={30} />
      </div>
      <div className="eyebrow">دعوتك لبداية أوضح</div>
      <h1>فكرتك إلها مساحة.</h1>
      <p>
        أدخل الكود الذي وصلك من الشركة
        <br />
        لنبدأ ترتيب تفاصيل مشروعك معًا.
      </p>
      <form
        className="join-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (!profile || profile.role !== "client") {
            go("/signup?next=" + encodeURIComponent(next));
            return;
          }
          const result = join(code);
          if (result.error) setError(result.error);
          else go(`/interview/${result.id}/welcome`);
        }}
      >
        <label htmlFor="project-code">كود المشروع</label>
        <input
          id="project-code"
          className="code-input"
          autoComplete="off"
          dir="ltr"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          placeholder="LR-XXXXXXXX"
          required
          maxLength={24}
        />
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button primary full">
          {profile?.role === "client"
            ? "الدخول إلى المشروع"
            : "إنشاء ملف زبون والمتابعة"}
          <ArrowLeft size={18} />
        </button>
        {!profile && (
          <a
            className="text-button"
            href={"#/login?next=" + encodeURIComponent(next)}
          >
            عندي ملف محلي بالفعل
          </a>
        )}
        <div className="notice">
          <ShieldCheck size={19} />
          <span>
            الكود خاص بمشروعك. تحتاج الشركة لإنشائه في نفس المتصفح في هذه النسخة
            التجريبية.
          </span>
        </div>
      </form>
      <small className="muted">
        ما عندك كود؟ اطلبه من الشركة المسؤولة عن مشروعك.
      </small>
    </section>
  );
}
export function Guide() {
  return (
    <>
      <PageGuide />
      <div className="guide-grid">
        {[
          [
            Building2,
            "أنشئ مساحة الشركة",
            "سجّل ملف شركة، وأنشئ مشروعًا وحدد الهدف والنطاق.",
          ],
          [
            KeyRound,
            "شارك كود المشروع",
            "انسخ الكود من صفحة الدعوات، ثم بدّل إلى ملف زبون في نفس المتصفح لتجربة الرحلة.",
          ],
          [
            MessageSquareText,
            "ابدأ المقابلة",
            "أجب بالنص أو أرفق تسجيلًا مع نصه، وأجّل ما لا تعرفه. تحفظ الإجابات أثناء الكتابة.",
          ],
          [
            ShieldCheck,
            "راجع واتفق",
            "راجع المسودات ومصادرها، احسم القرارات، ثم اعتمد وصدر المتطلبات.",
          ],
        ].map(([Icon, title, body], i) => {
          const I = Icon as typeof Building2;
          return (
            <article className="panel" key={i}>
              <I className="copper" />
              <span className="eyebrow">0{i + 1}</span>
              <h2>{String(title)}</h2>
              <p>{String(body)}</p>
            </article>
          );
        })}
      </div>
      <div className="notice">
        <Sparkles size={20} />
        الاستخراج في هذه النسخة محاكاة بقواعد بسيطة، وليس تحليل ذكاء اصطناعي
        حقيقيًا. لا يتم إرسال بياناتك إلى مزود خارجي.
      </div>
    </>
  );
}
function PageGuide() {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">
          <CircleDot size={14} /> دليل البداية
        </div>
        <h1>من الفكرة إلى أول اتفاق.</h1>
        <p>أربع خطوات لتجربة دورة المتطلبات كاملة.</p>
      </div>
    </div>
  );
}
