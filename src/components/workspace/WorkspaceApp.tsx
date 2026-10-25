"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  X,
} from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { Auth, Guide, Join, Landing } from "./Entry";
import { NewProject, ProjectHeader, Projects } from "./Projects";
import {
  Decisions,
  InterviewReview,
  Invites,
  Overview,
  Reports,
  Requirements,
  Settings,
} from "./Company";
import { Interview } from "./Interview";
import { Brand, Empty, Forward, go, Modal } from "./ui";
import type { Profile } from "@/lib/workspace";
const subscribe = (fn: () => void) => {
  window.addEventListener("hashchange", fn);
  return () => window.removeEventListener("hashchange", fn);
};
export default function WorkspaceApp() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash.slice(1) || "/",
    () => "/",
  );
  const store = useWorkspace();
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  useEffect(() => {
    void useWorkspace.persist.rehydrate();
  }, []);
  useEffect(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [hash]);
  const path = hash.split("?")[0];
  const query = new URLSearchParams(hash.split("?")[1]);
  const [, area, id, section, questionId] = path.split("/");
  const profile = store.profiles.find((p) => p.id === store.sessionId);
  const owned = store.projects.filter((p) => p.ownerId === profile?.id);
  if (!store.hydrated)
    return (
      <div className="loading-screen">
        <Brand />
        <div className="loading-line" />
        <p>نرتّب مساحتك…</p>
      </div>
    );
  if (path === "/") return <Landing />;
  if (area === "signup" || area === "login")
    return (
      <Auth
        key={hash}
        login={area === "login"}
        next={query.get("next") || ""}
      />
    );
  const publicPage = area === "join" || area === "guide";
  if (!profile && !publicPage) return <Auth login next={hash} />;
  let content;
  if (area === "join")
    content = (
      <Join
        key={hash}
        profile={profile}
        initialCode={query.get("code") || ""}
      />
    );
  else if (area === "guide") content = <Guide />;
  else if (area === "account" && profile)
    content = <Account profile={profile} />;
  else if (area === "projects" && id === "new" && profile?.role === "company")
    content = <NewProject />;
  else if (area === "projects" && !id && profile)
    content = <Projects profile={profile} />;
  else if (area === "project" || area === "interview") {
    const p = store.projects.find((p) => p.id === id);
    const allowed =
      p &&
      profile &&
      (area === "project"
        ? profile.role === "company" && p.ownerId === profile.id
        : profile.role === "client" && p.memberIds.includes(profile.id));
    if (!p || !allowed)
      content = (
        <Empty
          title="المشروع غير متاح لهذا الملف"
          body="ادخل بملف الشركة المالكة، أو انضم بملف زبون عبر كود الدعوة."
        >
          <Forward path={profile?.role === "company" ? "/projects" : "/join"}>
            العودة لمساحتي
          </Forward>
        </Empty>
      );
    else if (area === "interview")
      content = ["welcome", "questions", "review"].includes(section) ? (
        <Interview
          key={p.id}
          project={p}
          stage={section}
          questionId={questionId}
        />
      ) : (
        <Empty title="خطوة غير موجودة" body="ارجع إلى بداية المقابلة.">
          <Forward path={`/interview/${p.id}/welcome`}>بداية المقابلة</Forward>
        </Empty>
      );
    else {
      const pages = {
        overview: Overview,
        invites: Invites,
        interviews: InterviewReview,
        requirements: Requirements,
        decisions: Decisions,
        reports: Reports,
        settings: Settings,
      };
      const Page = pages[section as keyof typeof pages];
      content = Page ? (
        <>
          <ProjectHeader project={p} section={section} />
          <Page key={`${p.id}-${section}`} project={p} />
        </>
      ) : (
        <Empty title="صفحة المشروع غير موجودة" body="اختر نظرة عامة للمتابعة.">
          <Forward path={`/project/${p.id}/overview`}>مساحة المشروع</Forward>
        </Empty>
      );
    }
  } else
    content = (
      <Empty
        title="هذه الصفحة غير موجودة"
        body="مساحتك ما زالت هنا. ارجع للمشاريع للمتابعة."
      >
        <Forward path="/projects">المشاريع</Forward>
      </Empty>
    );
  if (!profile)
    return (
      <div className="public-shell">
        <header className="public-nav">
          <Brand />
          <Forward path="/login" secondary>
            تسجيل الدخول
          </Forward>
        </header>
        <main id="main-content" tabIndex={-1}>
          {content}
        </main>
      </div>
    );
  const links = [
    [
      "/projects",
      LayoutDashboard,
      profile.role === "company" ? "المشاريع" : "مشاريعي",
    ],
    ...(profile.role === "client"
      ? [["/join", KeyRound, "الانضمام لمشروع"]]
      : []),
    ["/guide", BookOpen, "دليل الاستخدام"],
    ["/account", Settings2, "الملف الشخصي"],
  ] as const;
  return (
    <div
      className={"app-shell " + (area === "interview" ? "client-shell" : "")}
    >
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        انتقل للمحتوى
      </a>
      {mobile && (
        <button
          className="sidebar-overlay"
          aria-label="إغلاق القائمة"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-only"
            aria-label="إغلاق القائمة"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-avatar">
            {(profile.company || profile.name)[0]}
          </span>
          <span>
            <b>{profile.company || profile.name}</b>
            <small>
              {profile.role === "company" ? "مساحة الشركة" : "مساحة الزبون"}
            </small>
          </span>
          <ChevronDown size={15} />
        </div>
        <span className="nav-heading">مساحتك</span>
        <nav className="side-nav">
          {links.map(([url, Icon, label]) => {
            const I = Icon as typeof LayoutDashboard;
            return (
              <a
                key={String(url)}
                href={"#" + url}
                className={
                  path.startsWith(String(url)) ||
                  (url === "/projects" && area === "project")
                    ? "active"
                    : ""
                }
                onClick={() => setMobile(false)}
              >
                <I size={19} />
                {String(label)}
                {url === "/projects" && (
                  <span>
                    {profile.role === "company"
                      ? owned.length
                      : store.projects.filter((p) =>
                          p.memberIds.includes(profile.id),
                        ).length}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
        {profile.role === "company" && owned.length > 0 && (
          <>
            <span className="nav-heading">وصول سريع</span>
            <div className="quick-projects">
              {owned.slice(0, 4).map((p) => (
                <a
                  key={p.id}
                  href={`#/project/${p.id}/overview`}
                  onClick={() => setMobile(false)}
                >
                  <span className="tiny-square" />
                  {p.name}
                </a>
              ))}
            </div>
          </>
        )}
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="copper">فكرة أوضح. تنفيذ أفضل.</span>
            <p>ابدأ بالسؤال الصحيح، وخلي التفاصيل تأخذ مكانها.</p>
            <a href="#/guide">
              اكتشف طريقة العمل <ArrowIcon />
            </a>
          </div>
          <button className="profile-button" onClick={() => go("/account")}>
            <span className="avatar">{profile.name[0]}</span>
            <span>
              <b>{profile.name}</b>
              <small>
                {profile.role === "company" ? "مسؤول المساحة" : "صاحب الفكرة"}
              </small>
            </span>
            <Settings2 size={17} />
          </button>
          <button
            className="logout"
            onClick={() => {
              store.signOut();
              go("/login");
            }}
          >
            <LogOut size={16} />
            تبديل الملف / خروج
          </button>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div>
            <button
              className="icon-button mobile-only"
              aria-label="فتح القائمة"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span className="topbar-breadcrumb">
              <FolderKanban size={17} />
              مساحة العمل<span>/</span>
              <b>
                {area === "interview"
                  ? "مقابلة المشروع"
                  : area === "project"
                    ? "تفاصيل المشروع"
                    : "نظرة عامة"}
              </b>
            </span>
          </div>
          <div>
            <span className="local-label">
              <span className="live-dot" />
              نسخة تجريبية محلية
            </span>
            <a className="icon-button" aria-label="المساعدة" href="#/guide">
              <CircleHelp size={19} />
            </a>
            <button
              className="icon-button notification-button"
              aria-label="آخر النشاطات"
              onClick={() => setNotifications(true)}
            >
              <Bell size={19} />
            </button>
            <span className="avatar small">{profile.name[0]}</span>
          </div>
        </header>
        {store.storageError && (
          <p role="alert" className="storage-error">
            {store.storageError}
          </p>
        )}
        <main
          id="main-content"
          tabIndex={-1}
          className="main-content"
          key={area === "interview" ? `${area}-${id}` : path}
        >
          {content}
        </main>
        <footer className="app-footer">
          <span dir="ltr">LogicRift / Built for clarity</span>
          <span>البيانات على هذا الجهاز · محاكاة استخراج المتطلبات</span>
        </footer>
      </div>
      {notifications && (
        <Modal title="آخر نشاطات مساحتك" close={() => setNotifications(false)}>
          {(profile.role === "company"
            ? owned
            : store.projects.filter((p) => p.memberIds.includes(profile.id))
          ).flatMap((p) =>
            p.activity.slice(0, 3).map((a, i) => (
              <div className="notification-item" key={p.id + i}>
                <span className="activity-dot" />
                <div>
                  <b>{p.name}</b>
                  <p>{a}</p>
                </div>
              </div>
            )),
          )}
          <p className="muted">نشاطات المشاريع المحفوظة محليًا.</p>
        </Modal>
      )}
    </div>
  );
}
function ArrowIcon() {
  return <span aria-hidden="true">←</span>;
}
function Account({ profile }: { profile: Profile }) {
  return (
    <div className="panel settings-form">
      <div className="eyebrow">الملف الشخصي</div>
      <h1>{profile.name}</h1>
      <p>
        {profile.role === "company" ? "ملف شركة" : "ملف زبون"} ·{" "}
        {profile.company}
      </p>
      <label>
        البريد الإلكتروني
        <input readOnly value={profile.email} dir="ltr" />
      </label>
      <div className="notice">
        هذه ملفات محلية للعرض وليست حسابات مصادقة. تستطيع إنشاء أكثر من ملف
        والتبديل بينها لتجربة الطرفين.
      </div>
      <Forward path="/signup" secondary>
        إضافة ملف آخر
      </Forward>
      <button
        className="button secondary"
        onClick={() => {
          useWorkspace.getState().signOut();
          go("/login");
        }}
      >
        تبديل الملف
      </button>
    </div>
  );
}
