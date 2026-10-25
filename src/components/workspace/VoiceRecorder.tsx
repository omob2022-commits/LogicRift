"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { newId } from "@/lib/workspace";
import { deleteAudio, getAudio, saveAudio } from "@/lib/audio";
export function AudioPlayback({ id }: { id: string }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    getAudio(id)
      .then((blob) => {
        if (!active) return;
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        } else setError("التسجيل غير موجود على هذا الجهاز.");
      })
      .catch(() => {
        if (active) setError("تعذّر تحميل التسجيل.");
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);
  return error ? (
    <small role="alert" className="error">
      {error}
    </small>
  ) : url ? (
    <audio controls src={url} aria-label="تشغيل الإجابة الصوتية" />
  ) : (
    <small role="status">جارٍ تحميل التسجيل…</small>
  );
}
export function VoiceRecorder({
  audioId,
  onSaved,
}: {
  audioId?: string;
  onSaved: (id: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const savedCallback = useRef(onSaved);
  useEffect(() => { savedCallback.current = onSaved; }, [onSaved]);
  useEffect(() => {
    if (!recording && !busy) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [recording, busy]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") {
        recorder.current.stop();
      }
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(
      () =>
        setSeconds((n) => {
          if (n >= 119) recorder.current?.stop();
          return n + 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [recording]);
  async function start() {
    setError("");
    setBusy(true);
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      )
        throw new Error("unsupported");
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const chunks: BlobPart[] = [];
      const mr = new MediaRecorder(media);
      recorder.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      mr.onerror = () => {
        setError("توقف التسجيل. حاول مرة ثانية.");
        media.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };
      mr.onstop = async () => {
        media.getTracks().forEach((t) => t.stop());
        if (mounted.current) { setRecording(false); setBusy(true); }
        try {
          const id = newId();
          await saveAudio(id, new Blob(chunks, { type: mr.mimeType }));
          savedCallback.current(id);
          if (audioId) await deleteAudio(audioId);
        } catch {
          if (mounted.current)
            setError("تعذّر حفظ التسجيل. يمكنك كتابة إجابتك بدلًا منه.");
        } finally {
          if (mounted.current) setBusy(false);
        }
      };
      mr.start();
      setSeconds(0);
      setRecording(true);
    } catch (e) {
      stream.current?.getTracks().forEach(track => track.stop());
      setError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "لم يُسمح باستخدام الميكروفون. فعّله من إعدادات المتصفح أو تابع بالنص."
          : "الميكروفون غير متاح. تأكد من توصيله واستخدام متصفح يدعم التسجيل.",
      );
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <div className="voice-box">
      <div className="actions">
        <button
          type="button"
          className={"button secondary " + (recording ? "recording" : "")}
          disabled={busy}
          onClick={() => (recording ? recorder.current?.stop() : void start())}
        >
          {recording ? <Square size={16} /> : <Mic size={17} />}{" "}
          {busy
            ? "جارٍ الحفظ / فتح الميكروفون…"
            : recording
              ? `إيقاف التسجيل · ${seconds}ث`
              : audioId
                ? "إعادة التسجيل"
                : "تسجيل إجابة صوتية"}
        </button>
        {audioId && !recording && (
          <button
            type="button"
            className="icon-button"
            aria-label="حذف التسجيل"
            onClick={async () => {
              try {
                await deleteAudio(audioId);
                onSaved("");
              } catch {
                setError("تعذّر حذف التسجيل.");
              }
            }}
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
      {audioId && !recording && <AudioPlayback key={audioId} id={audioId} />}
      <small>
        حد التسجيل دقيقتان. يُحفظ على جهازك؛ اكتب ملخصه أدناه لأن التفريغ الآلي
        غير موصول بعد.
      </small>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
