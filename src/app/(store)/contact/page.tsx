"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hi Perfect Fit! I'm ${form.name} (${form.email}).\n\n${form.message}`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center font-display text-4xl text-neutral-50">Get in Touch</h1>
        <p className="mt-2 text-center text-neutral-400">We&apos;d love to hear from you. Reach out anytime.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Visit Us", value: "Bengaluru, Karnataka, India" },
              { icon: Phone, title: "Call Us", value: "+91 99999 99999" },
              { icon: Mail, title: "Email Us", value: "hello@perfectfit.com" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="card flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-100">{title}</p>
                  <p className="text-sm text-neutral-400">{value}</p>
                </div>
              </div>
            ))}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline w-full"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>

          <form onSubmit={submit} className="card space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">Message</label>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
            </div>
            <button type="submit" className="btn-gold w-full">
              <Send className="h-4 w-4" /> Send Message
            </button>
            {sent && <p className="text-center text-xs text-green-400">Opening WhatsApp to send your message…</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
