"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpLeft, Check, Copy, Layers3, X } from "lucide-react";
import { useState } from "react";
import { statusLabels, type Status } from "@/lib/workspace";
export function go(path: string) {
  window.location.hash = path;
}
export function Brand() {
  return (
    <a className="brand" href="#/">
      <span className="brand-icon">
        <Layers3 size={23} />
      </span>
      <span dir="ltr">
        Logic<span className="copper">Rift</span>
        <small>IDEAS INTO CLARITY</small>
      </span>
    </a>
  );
}
export function Badge({
  status,
  children,
}: {
  status?: Status | "success" | "warning";
  children?: ReactNode;
}) {
  return (
    <span className={`badge ${status || ""}`}>
      <span className="dot" />
      {children ||
        (status && status in statusLabels
          ? statusLabels[status as Status]
          : "")}
    </span>
  );
}
export function Empty({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <Layers3 size={36} />
      <h3>{title}</h3>
      <p>{body}</p>
      {children}
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      <div className="actions">{children}</div>
    </div>
  );
}
export function CopyButton({
  value,
  label = "نسخ",
}: {
  value: string;
  label?: string;
}) {
  const [state, setState] = useState("");
  return (
    <>
      <button
        className="button subtle"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setState("تم النسخ");
          } catch {
            setState("تعذّر النسخ؛ حدد النص وانسخه يدويًا.");
          }
        }}
      >
        {state === "تم النسخ" ? <Check size={16} /> : <Copy size={16} />}
        {label}
      </button>
      <span className="sr-only" role="status">
        {state}
      </span>
      {state && state !== "تم النسخ" && <small role="alert">{state}</small>}
    </>
  );
}
export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="إغلاق" onClick={close}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Forward({
  children,
  path,
  secondary = false,
}: {
  children: ReactNode;
  path: string;
  secondary?: boolean;
}) {
  return (
    <a
      className={`button ${secondary ? "secondary" : "primary"}`}
      href={"#" + path}
    >
      {children}
      <ArrowUpLeft size={18} />
    </a>
  );
}
export function download(content: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
