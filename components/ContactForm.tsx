"use client";

import { useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

interface Values {
  name: string;
  email: string;
  topic: string;
  message: string;
  website: string; // honeypot — real people never see or fill this
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 80, email: 120, message: 4000 };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Add your name";
  if (!v.email.trim()) e.email = "Add an email so I can reply";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Check the email address";
  if (v.message.trim().length < 10) e.message = "Write at least a sentence";
  return e;
}

export default function ContactForm() {
  const { topics, form } = site.contact;
  const uid = useId();

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    topic: topics[0] ?? "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const set =
    (key: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [key]: value }));
      if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    const first = (["name", "email", "message"] as const).find((k) => found[k]);
    if (first) {
      refs[first].current?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 15000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "The note didn't go through.");
      setStatus("sent");
      setValues((v) => ({ ...v, name: "", email: "", message: "", website: "" }));
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof DOMException && err.name === "AbortError"
          ? "The connection timed out."
          : err instanceof Error
            ? err.message
            : "The note didn't go through.",
      );
    } finally {
      window.clearTimeout(timer);
    }
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `${values.topic} — ${values.name || "hello"}`,
  )}&body=${encodeURIComponent(values.message)}`;

  /* ------------------------------------------------------------ sent */
  if (status === "sent") {
    return (
      <div className="letter letter--done" role="status">
        <span className="letter__mark" aria-hidden="true">
          {form.postmark}
        </span>
        <p className="letter__script">{form.sentKicker}</p>
        <h3 className="letter__sent-title">{form.sentTitle}</h3>
        <p className="letter__sent-text">{form.sentText}</p>
        <button type="button" className="letter__again" onClick={() => setStatus("idle")}>
          {form.again}
        </button>
      </div>
    );
  }

  /* ------------------------------------------------------------ form */
  const busy = status === "sending";

  return (
    <div className="letter">
      <span className="letter__mark" aria-hidden="true">
        {form.postmark}
      </span>

      <form onSubmit={onSubmit} noValidate aria-busy={busy}>
        <fieldset className="topics">
          <legend className="field__label">{form.topicLabel}</legend>
          <div className="topics__row">
            {topics.map((t) => (
              <label className="topic" key={t}>
                <input
                  type="radio"
                  name={`${uid}-topic`}
                  value={t}
                  checked={values.topic === t}
                  onChange={() => setValues((v) => ({ ...v, topic: t }))}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-name`}>
              {form.nameLabel}
              {errors.name && (
                <span className="field__err" id={`${uid}-name-err`}>
                  {errors.name}
                </span>
              )}
            </label>
            <input
              ref={refs.name}
              id={`${uid}-name`}
              type="text"
              autoComplete="name"
              maxLength={LIMITS.name}
              value={values.name}
              onChange={set("name")}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${uid}-name-err` : undefined}
              disabled={busy}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${uid}-email`}>
              {form.emailLabel}
              {errors.email && (
                <span className="field__err" id={`${uid}-email-err`}>
                  {errors.email}
                </span>
              )}
            </label>
            <input
              ref={refs.email}
              id={`${uid}-email`}
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={LIMITS.email}
              value={values.email}
              onChange={set("email")}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${uid}-email-err` : undefined}
              disabled={busy}
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${uid}-message`}>
            {form.messageLabel}
            {errors.message && (
              <span className="field__err" id={`${uid}-message-err`}>
                {errors.message}
              </span>
            )}
          </label>
          <textarea
            ref={refs.message}
            id={`${uid}-message`}
            rows={5}
            maxLength={LIMITS.message}
            placeholder={form.messagePlaceholder}
            value={values.message}
            onChange={set("message")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${uid}-message-err` : undefined}
            disabled={busy}
          />
        </div>

        {/* honeypot: hidden from people and screen readers, tempting to bots */}
        <div className="sr-only" aria-hidden="true">
          <label>
            Leave this empty
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={set("website")}
            />
          </label>
        </div>

        <div className="letter__foot">
          <button className="letter__send" type="submit" disabled={busy}>
            {busy ? form.sending : form.send}
          </button>
          <p className="letter__hint">{site.contact.reply}</p>
        </div>

        {status === "error" && (
          <p className="letter__error" role="alert">
            {serverError} You can{" "}
            <a href={mailto}>send it from your own email app</a> instead.
          </p>
        )}
      </form>
    </div>
  );
}