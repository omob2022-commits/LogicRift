"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  newId,
  createProject,
  demoProject,
  extractDrafts,
  invitationError,
  normalizeCode,
  progress,
  reviseRequirement,
  type Profile,
  type Project,
  type Requirement,
} from "@/lib/workspace";
interface WorkspaceState {
  profiles: Profile[];
  sessionId: string | null;
  projects: Project[];
  hydrated: boolean;
  storageError: string;
  setHydrated: () => void;
  register: (profile: Omit<Profile, "id">) => string | null;
  signIn: (id: string) => void;
  signOut: () => void;
  demo: () => void;
  addProject: (
    input: Pick<
      Project,
      "name" | "client" | "sector" | "description" | "scope"
    >,
  ) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  join: (code: string) => { id?: string; error?: string };
  saveAnswer: (
    id: string,
    question: string,
    text: string,
    deferred?: boolean,
    audioId?: string,
  ) => void;
  submit: (id: string) => void;
  updateRequirement: (
    id: string,
    requirementId: string,
    patch: Partial<Requirement>,
  ) => void;
  snapshot: (id: string) => void;
}
export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      profiles: [],
      sessionId: null,
      projects: [],
      hydrated: false,
      storageError: "",
      setHydrated: () => set({ hydrated: true }),
      register: (input) => {
        if (
          get().profiles.some(
            (p) =>
              p.email.toLowerCase() === input.email.trim().toLowerCase() &&
              p.role === input.role,
          )
        )
          return "هذا البريد موجود لهذا الدور. اختر الدخول إلى ملف محلي.";
        const profile = {
          ...input,
          email: input.email.trim().toLowerCase(),
          id: newId(),
        };
        set((s) => ({
          profiles: [...s.profiles, profile],
          sessionId: profile.id,
        }));
        return null;
      },
      signIn: (id) => {
        if (get().profiles.some((p) => p.id === id)) set({ sessionId: id });
      },
      signOut: () => set({ sessionId: null }),
      demo: () =>
        set((s) => ({
          profiles: s.profiles.some((p) => p.id === "demo-company")
            ? s.profiles
            : [
                ...s.profiles,
                {
                  id: "demo-company",
                  name: "نور",
                  email: "demo@logicrift.local",
                  company: "LogicRift Studio",
                  role: "company",
                },
              ],
          sessionId: "demo-company",
          projects: s.projects.some((p) => p.id === "demo-mawed")
            ? s.projects
            : [...s.projects, demoProject()],
        })),
      addProject: (input) => {
        const profile = get().profiles.find((p) => p.id === get().sessionId);
        if (profile?.role !== "company") return "";
        const project = createProject(profile.id, input);
        set((s) => ({ projects: [...s.projects, project] }));
        return project.id;
      },
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id && p.ownerId === s.sessionId
              ? { ...p, ...patch, id: p.id, ownerId: p.ownerId }
              : p,
          ),
        })),
      join: (code) => {
        const s = get();
        const profile = s.profiles.find((p) => p.id === s.sessionId);
        if (profile?.role !== "client")
          return { error: "أنشئ ملف زبون أو ادخل إليه أولًا." };
        const project = s.projects.find(
          (p) => normalizeCode(p.code) === normalizeCode(code),
        );
        const error = invitationError(project);
        if (error || !project) return { error: error! };
        if (project.memberIds.some((id) => id !== profile.id))
          return {
            error:
              "هذه المقابلة مرتبطة بزبون آخر في النسخة التجريبية. اطلب من الشركة مشروعًا أو كودًا خاصًا بك.",
          };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === project.id
              ? {
                  ...p,
                  memberIds: [...new Set([...p.memberIds, profile.id])],
                  activity: p.memberIds.includes(profile.id)
                    ? p.activity
                    : [`انضم ${profile.name} إلى المقابلة`, ...p.activity],
                }
              : p,
          ),
        }));
        return { id: project.id };
      },
      saveAnswer: (id, question, text, deferred = false, audioId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id &&
            p.memberIds.includes(s.sessionId || "") &&
            !p.submitted
              ? {
                  ...p,
                  answers: {
                    ...p.answers,
                    [question]: {
                      text,
                      deferred,
                      audioId: audioId ?? p.answers[question]?.audioId,
                      updatedAt: new Date().toISOString(),
                    },
                  },
                }
              : p,
          ),
        })),
      submit: (id) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id &&
            p.memberIds.includes(s.sessionId || "") &&
            !p.submitted &&
            progress(p) === 100
              ? {
                  ...p,
                  ...extractDrafts(p),
                  submitted: true,
                  activity: [
                    "أرسل الزبون المقابلة للمراجعة؛ المسودات غير معتمدة",
                    ...p.activity,
                  ],
                }
              : p,
          ),
        })),
      updateRequirement: (id, requirementId, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id && p.ownerId === s.sessionId
              ? {
                  ...p,
                  requirements: p.requirements.map((r) =>
                    r.id === requirementId ? reviseRequirement(r, patch) : r,
                  ),
                  activity: [
                    `تمت مراجعة ${requirementId}`,
                    ...p.activity,
                  ].slice(0, 30),
                }
              : p,
          ),
        })),
      snapshot: (id) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id && p.ownerId === s.sessionId
              ? {
                  ...p,
                  versions: [
                    ...p.versions,
                    {
                      id: `v${p.versions.length + 1}`,
                      date: new Date().toISOString(),
                      requirements: structuredClone(
                        p.requirements.filter((r) => r.status === "approved"),
                      ),
                    },
                  ],
                }
              : p,
          ),
        })),
    }),
    {
      name: "logicrift-workspace-v1",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => ({
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch {
            if (!useWorkspace.getState().storageError)
              queueMicrotask(() =>
                useWorkspace.setState({
                  storageError:
                    "تعذّر الحفظ على الجهاز. قد تكون مساحة المتصفح ممتلئة؛ احتفظ بنسخة من إجاباتك قبل المغادرة.",
                }),
              );
          }
        },
        removeItem: (key) => localStorage.removeItem(key),
      })),
      partialize: (s) => ({
        profiles: s.profiles,
        sessionId: s.sessionId,
        projects: s.projects,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (state) state.setHydrated();
        if (error)
          useWorkspace.setState({
            hydrated: true,
            storageError:
              "تعذّر قراءة البيانات المحلية. لن نعرض بياناتك السابقة حتى تُحل مشكلة تخزين المتصفح.",
          });
      },
    },
  ),
);
