"use client";
import { useState, type FormEvent } from "react";

type Field = { name: string; label: string; type?: "text" | "email" | "tel" | "date" | "textarea" | "select"; required?: boolean; options?: string[]; placeholder?: string };

export default function Form({ kind, fields, submitLabel = "Submit" }: { kind: string; fields: Field[]; submitLabel?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch("/api/forms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, ...data }) });
      setState(r.ok ? "sent" : "error");
    } catch { setState("error"); }
  }
  if (state === "sent") return <p role="status" className="rounded border border-rule-strong bg-cream-2 p-6 text-[1.05rem]">Thank you. Your message has been received. Our office will contact you shortly to confirm.</p>;
  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {fields.map((f) => {
        const id = `${kind}-${f.name}`;
        const cls = "w-full rounded border border-rule-strong bg-cream-2 px-4 py-3 text-ink focus:outline focus:outline-2 focus:outline-navy";
        return (
          <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="mb-2 block text-[.9rem] font-bold">{f.label}{f.required && <span aria-hidden="true"> *</span>}</label>
            {f.type === "textarea" ? <textarea id={id} name={f.name} required={f.required} rows={5} className={cls} placeholder={f.placeholder} />
              : f.type === "select" ? <select id={id} name={f.name} required={f.required} className={cls}>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>
              : <input id={id} name={f.name} type={f.type ?? "text"} required={f.required} className={cls} placeholder={f.placeholder} />}
          </div>
        );
      })}
      <div className="sm:col-span-2 flex items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn-primary cursor-pointer border-0 disabled:opacity-60">{state === "sending" ? "Sending…" : submitLabel}</button>
        {state === "error" && <p role="alert" className="m-0 text-[.9rem] text-red-800">Something went wrong. Please call the office instead.</p>}
        <p className="m-0 text-[.8rem] text-ink-subtle">Fields marked * are required. Do not include medical emergencies — call 911.</p>
      </div>
    </form>
  );
}
