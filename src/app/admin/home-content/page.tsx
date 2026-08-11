"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Save, Loader2 } from "lucide-react";

type HomeContent = {
  hero: { title: string; subtitle: string; ctaText: string; ctaLink: string; image: string };
  story: { title: string; body: string; image: string };
  marquee: string[];
};

export default function AdminHomeContentPage() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/home-content")
      .then((r) => r.json())
      .then((d) => setContent(d.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/home-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved successfully!" : "Failed to save.");
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading || !content) {
    return (
      <AdminShell title="Home Content">
        <div className="card p-10 text-center text-neutral-400">Loading…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Home Content">
      <div className="max-w-3xl space-y-6">
        <div className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-neutral-100">Hero Section</h2>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Title</label>
            <input value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Subtitle</label>
            <textarea rows={2} value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} className="input-field resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">CTA Text</label>
              <input value={content.hero.ctaText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-400">CTA Link</label>
              <input value={content.hero.ctaLink} onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaLink: e.target.value } })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Hero Image URL (optional)</label>
            <input value={content.hero.image} onChange={(e) => setContent({ ...content, hero: { ...content.hero, image: e.target.value } })} className="input-field" placeholder="Leave blank to use logo" />
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-neutral-100">Brand Story</h2>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Title</label>
            <input value={content.story.title} onChange={(e) => setContent({ ...content, story: { ...content.story, title: e.target.value } })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Body</label>
            <textarea rows={4} value={content.story.body} onChange={(e) => setContent({ ...content, story: { ...content.story, body: e.target.value } })} className="input-field resize-none" />
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-neutral-100">Announcement Bar</h2>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Messages (one per line)</label>
          <textarea
            rows={4}
            value={content.marquee.join("\n")}
            onChange={(e) => setContent({ ...content, marquee: e.target.value.split("\n").filter(Boolean) })}
            className="input-field resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={save} disabled={saving} className="btn-gold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {msg && <span className="text-sm text-green-400">{msg}</span>}
        </div>
      </div>
    </AdminShell>
  );
}
