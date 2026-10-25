"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Coffee,
  FileText,
  MessageSquareText,
  Pencil,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { progress, questionsFor, type Project } from "@/lib/workspace";
import { Badge, Forward, go, Modal } from "./ui";
import { VoiceRecorder } from "./VoiceRecorder";
export function Interview({
  project: p,
  stage,
  questionId,
}: {
  project: Project;
  stage: string;
  questionId?: string;
}) {
  const store = useWorkspace();
  const [confirm, setConfirm] = useState(false);
  const questions = questionsFor(p);
  const firstIncomplete =
    questions.find(
      (q) => !p.answers[q.id]?.text.trim() && !p.answers[q.id]?.deferred,
    )?.id || questions[0].id;
  const index = Math.max(
    0,
    questions.findIndex((q) => q.id === (questionId || firstIncomplete)),
  );
  const question = questions[index];
  const answer = p.answers[question.id];
  if (p.submitted)
    return (
      <div className="completion">
        <span className="completion-icon">
          <CheckCheck size={44} />
        </span>
        <div className="eyebrow">خطوة مهمة اكتملت</div>
        <h1>وصلت فكرتك بوضوح.</h1>
        <p>
          إجاباتك محفوظة وجاهزة لمراجعة الشركة في هذا النموذج.
          <br />
          المتطلبات ما زالت مسودات، والقرار النهائي يتم معك.
        </p>
        <div className="panel">
          <div>
            <FileText />
            <b>
              {questions.filter((q) => p.answers[q.id]?.text.trim()).length}
            </b>
            <span>إجابات موثّقة</span>
          </div>
          <div>
            <MessageSquareText />
            <b>{questions.filter((q) => p.answers[q.id]?.deferred).length}</b>
            <span>نقاط للمناقشة</span>
          </div>
        </div>
        <Forward path="/projects">العودة إلى مشاريعي</Forward>
      </div>
    );
  if (stage === "welcome")
    return (
      <div className="welcome-layout">
        <section>
          <div className="eyebrow">{p.client} / مساحة المشروع</div>
          <h1>
            أنت تعرف فكرتك.
            <br />
            <span className="copper">خلّينا نفهمها معك.</span>
          </h1>
          <p className="lead">{p.name}</p>
          <p>{p.description}</p>
          <div className="welcome-features">
            <span>
              <MessageSquareText />
              احكِ بطريقتك، نصًا أو صوتًا.
            </span>
            <span>
              <Coffee />
              خذ وقتك، وارجع وقت ما تحب.
            </span>
            <span>
              <ShieldCheck />
              راجع كل شيء قبل الإرسال.
            </span>
          </div>
          <Forward
            path={
              progress(p) === 100
                ? `/interview/${p.id}/review`
                : `/interview/${p.id}/questions/${firstIncomplete}`
            }
          >
            {progress(p) === 100
              ? "مراجعة إجاباتي"
              : progress(p) > 0
                ? "استكمال المقابلة"
                : "لنبدأ الحوار"}
          </Forward>
        </section>
        <aside className="panel interview-outline">
          <div className="eyebrow">خريطة الحوار</div>
          <h2>
            تفاصيل صغيرة.
            <br />
            صورة أكبر.
          </h2>
          {questions.map((q, i) => (
            <div key={q.id}>
              <span className={p.answers[q.id] ? "done" : ""}>
                {p.answers[q.id]?.text || p.answers[q.id]?.deferred ? (
                  <Check size={16} />
                ) : (
                  `0${i + 1}`
                )}
              </span>
              <b>{q.topic}</b>
            </div>
          ))}
          <p className="muted">
            الوقت حسب تفاصيل مشروعك. لا توجد إجابة «مثالية».
          </p>
        </aside>
      </div>
    );
  if (stage === "review")
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">قبل أن نكمل</div>
            <h1>هل عبّرنا عن فكرتك صح؟</h1>
            <p>راجع إجاباتك الأصلية. صحّح أي تفصيل، أو اترك نقطة للمناقشة.</p>
          </div>
          <Badge status="review">مراجعتك أولًا</Badge>
        </div>
        <div className="review-layout">
          <section>
            {questions.map((q, i) => (
              <article className="panel answer-review" key={q.id}>
                <div className="section-title">
                  <span className="eyebrow">
                    0{i + 1} / {q.topic}
                  </span>
                  <a
                    className="text-button"
                    href={`#/interview/${p.id}/questions/${q.id}`}
                  >
                    <Pencil size={15} />
                    تعديل
                  </a>
                </div>
                <h3>{q.question}</h3>
                <p>
                  {p.answers[q.id]?.deferred
                    ? `مؤجل للنقاش مع الشركة${p.answers[q.id]?.text ? ` — ملاحظة الزبون: ${p.answers[q.id].text}` : ""}`
                    : p.answers[q.id]?.text || "لم تجب عن هذا السؤال بعد."}
                </p>
              </article>
            ))}
          </section>
          <aside className="panel sticky-panel">
            <CheckCircle2 size={30} className="copper" />
            <h2>الخطوة القادمة: المراجعة</h2>
            <p>
              سنرتّب إجاباتك كمسودات لتراجعها الشركة، ونجمع النقاط المؤجلة
              للاجتماع.
            </p>
            <div className="notice">
              هذه محاكاة للاستخراج، وليست تحليلًا بالذكاء الاصطناعي. إرسال
              الإجابات لا يعني اعتماد متطلبات أو تكلفة.
            </div>
            <button
              disabled={progress(p) < 100}
              className="button primary full"
              onClick={() => setConfirm(true)}
            >
              <Send size={17} />
              إرسال للمراجعة
            </button>
            {progress(p) < 100 && (
              <p className="error">
                أكمل الأسئلة الناقصة أو أجّلها قبل الإرسال.
              </p>
            )}
            <Forward
              path={`/interview/${p.id}/questions/${firstIncomplete}`}
              secondary
            >
              العودة إلى الحوار
            </Forward>
          </aside>
        </div>
        {confirm && (
          <Modal title="جاهز لإرسال إجاباتك؟" close={() => setConfirm(false)}>
            <p>
              ستصل الإجابات إلى لوحة الشركة المحلية. تستطيع الشركة إعادة فتح
              المقابلة إذا احتجتم توضيحًا.
            </p>
            <div className="form-footer">
              <button
                className="button secondary"
                onClick={() => setConfirm(false)}
              >
                أراجعها مرة ثانية
              </button>
              <button
                className="button primary"
                onClick={() => {
                  store.submit(p.id);
                  setConfirm(false);
                }}
              >
                تأكيد الإرسال
              </button>
            </div>
          </Modal>
        )}
      </>
    );
  const save = (text: string, deferred = false, audioId?: string) =>
    store.saveAnswer(p.id, question.id, text, deferred, audioId);
  const next = () =>
    go(
      index === questions.length - 1
        ? `/interview/${p.id}/review`
        : `/interview/${p.id}/questions/${questions[index + 1].id}`,
    );
  return (
    <div className="interview-layout">
      <aside className="interview-sidebar">
        <a className="text-button" href={`#/interview/${p.id}/welcome`}>
          <ArrowRight size={16} />
          عن المشروع
        </a>
        <h2>{p.name}</h2>
        <div className="project-progress">
          <div>
            <span>تقدمك محفوظ</span>
            <b>{progress(p)}%</b>
          </div>
          <div className="progress-track">
            <i style={{ width: progress(p) + "%" }} />
          </div>
        </div>
        <nav>
          {questions.map((q, i) => (
            <a
              className={q.id === question.id ? "active" : ""}
              href={`#/interview/${p.id}/questions/${q.id}`}
              key={q.id}
            >
              <span>
                {p.answers[q.id]?.text.trim() || p.answers[q.id]?.deferred ? (
                  <Check size={15} />
                ) : (
                  `0${i + 1}`
                )}
              </span>
              {q.topic}
              {q.id === question.id && <span className="live-dot" />}
            </a>
          ))}
        </nav>
        <div className="interview-note">
          <Coffee size={22} />
          <b>مش لازم تعرف كل شيء.</b>
          <p>«مش متأكد» بداية نقاش، مش إجابة غلط.</p>
        </div>
      </aside>
      <section className="interview-main" key={question.id}>
        <div className="question-meta">
          <span className="eyebrow">
            حوار الاكتشاف / {String(index + 1).padStart(2, "0")}
          </span>
          <span className="saved-indicator">
            <Check size={14} />
            {store.storageError ? "الحفظ متعذر" : "حفظ تلقائي على الجهاز"}
          </span>
        </div>
        <div className="assistant-avatar">
          <MessageSquareText size={24} />
        </div>
        <h1>{question.title}</h1>
        <p className="question-text">{question.question}</p>
        <p className="muted">{question.hint}</p>
        <div className="suggestions">
          <small>أفكار تساعدك تبدأ:</small>
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() =>
                save((answer?.text ? answer.text + "\n" : "") + option)
              }
            >
              <PlusIcon />
              {option}
            </button>
          ))}
        </div>
        <label className="answer-label">
          إجابتك
          <textarea
            autoFocus
            value={answer?.text || ""}
            onChange={(e) => save(e.target.value)}
            placeholder="احكِ لنا بطريقتك... التفاصيل مهمة."
            rows={6}
            maxLength={5000}
          />
          <small>{answer?.text.length || 0} / 5000</small>
        </label>
        <VoiceRecorder
          key={question.id}
          audioId={answer?.audioId}
          onSaved={(id) =>
            save(answer?.text || "", answer?.deferred || false, id)
          }
        />
        <div className="interview-actions">
          <button
            className="button primary"
            disabled={!answer?.text.trim() && !answer?.deferred}
            onClick={next}
          >
            {index === questions.length - 1 ? "مراجعة إجاباتي" : "حفظ ومتابعة"}
            <ArrowLeft size={17} />
          </button>
          <button
            className="text-button"
            onClick={() => {
              save(answer?.text || "", true);
              next();
            }}
          >
            <Clock3 size={16} />
            مش متأكد، نناقشها لاحقًا
          </button>
        </div>
        {answer?.deferred && (
          <p className="notice">هذه النقطة مؤجلة. الكتابة فيها تلغي التأجيل.</p>
        )}
        <div className="interview-bottom">
          <button
            className="text-button"
            disabled={index === 0}
            onClick={() =>
              go(`/interview/${p.id}/questions/${questions[index - 1].id}`)
            }
          >
            <ArrowRight size={16} />
            السؤال السابق
          </button>
          <a className="text-button" href="#/projects">
            حفظ وخروج
          </a>
        </div>
      </section>
    </div>
  );
}
function PlusIcon() {
  return <span aria-hidden="true">+</span>;
}
