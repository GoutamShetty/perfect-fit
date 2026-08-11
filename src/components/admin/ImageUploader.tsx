"use client";

import { useState } from "react";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { cloudinaryEnabled } from "@/lib/config";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const addUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !cloudName || !preset) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", preset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      }
      onChange([...images, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative h-24 w-20 overflow-hidden rounded-lg border border-neutral-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-neutral-300 hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {cloudinaryEnabled && (
        <label className="mb-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:border-gold hover:text-gold">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
            placeholder="Paste image URL"
            className="input-field !py-2 pl-9"
          />
        </div>
        <button type="button" onClick={addUrl} className="btn-outline !px-4 !py-2 !text-xs">Add</button>
      </div>
      {!cloudinaryEnabled && (
        <p className="mt-2 text-[11px] text-neutral-500">
          Tip: add Cloudinary keys to enable direct uploads, or paste image URLs above.
        </p>
      )}
    </div>
  );
}
