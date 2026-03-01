import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";

interface PostComposerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (imageDataUrl: string, caption: string) => void;
  partnerNickname: string;
}

const CAPTION_SUGGESTIONS = [
  "Missing you today, my love 🌹",
  "Good morning, beautiful soul ☀️",
  "Thinking of you always 💭",
  "Can't wait to hold you again 🤍",
  "You make every day brighter 🌟",
  "Forever and always, my love ♥",
];

export default function PostComposerModal({
  open,
  onClose,
  onSubmit,
  partnerNickname,
}: PostComposerModalProps) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl) return;
    setIsSubmitting(true);
    onSubmit(imageDataUrl, caption);
    // Reset
    setImageDataUrl(null);
    setCaption("");
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setImageDataUrl(null);
    setCaption("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="p-0 overflow-hidden max-w-sm w-full mx-4"
        style={{
          background: "oklch(0.11 0.03 330)",
          border: "1px solid oklch(0.40 0.10 25 / 0.30)",
          borderRadius: "1.5rem",
          boxShadow:
            "0 20px 60px oklch(0 0 0 / 0.60), 0 0 40px oklch(0.65 0.18 20 / 0.15)",
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle
            className="font-display text-xl font-bold text-center"
            style={{ color: "oklch(0.92 0.02 60)" }}
          >
            Share Your Day ♥
          </DialogTitle>
          <p
            className="text-center text-sm font-sans mt-1"
            style={{ color: "oklch(0.60 0.05 330)" }}
          >
            Let {partnerNickname} see your world
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-5">
          {/* Photo Upload Area */}
          <button
            type="button"
            className="relative rounded-2xl overflow-hidden cursor-pointer transition-all w-full text-left"
            style={{
              background: imageDataUrl ? "transparent" : "oklch(0.14 0.03 330)",
              border: `2px dashed ${dragOver ? "oklch(0.72 0.14 25 / 0.70)" : imageDataUrl ? "oklch(0.50 0.12 25 / 0.30)" : "oklch(0.30 0.06 330)"}`,
              minHeight: imageDataUrl ? "auto" : "180px",
            }}
            onClick={() => !imageDataUrl && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            aria-label="Upload photo"
          >
            {imageDataUrl ? (
              <div className="relative">
                <img
                  src={imageDataUrl}
                  alt="Your chosen moment to share"
                  className="w-full rounded-2xl object-cover"
                  style={{ maxHeight: "260px" }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageDataUrl(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "oklch(0.08 0.02 300 / 0.85)",
                    color: "oklch(0.85 0.02 60)",
                    border: "1px solid oklch(0.35 0.05 330)",
                  }}
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-44 gap-3 select-none">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: "oklch(0.18 0.04 330)",
                    border: "1px solid oklch(0.35 0.07 330)",
                  }}
                >
                  📷
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-sans font-medium"
                    style={{ color: "oklch(0.78 0.06 60)" }}
                  >
                    Tap to choose a photo
                  </p>
                  <p
                    className="text-xs font-sans mt-1"
                    style={{ color: "oklch(0.45 0.03 330)" }}
                  >
                    or drag and drop here
                  </p>
                </div>
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          {/* Caption */}
          <div className="space-y-2">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`Say something to ${partnerNickname}...`}
              className="input-romantic w-full resize-none"
              rows={3}
              maxLength={280}
              style={{
                background: "oklch(0.14 0.03 330 / 0.8)",
                borderRadius: "0.875rem",
              }}
            />
            {/* Quick suggestions */}
            <div
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {CAPTION_SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCaption(s)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-sans flex-shrink-0 transition-all"
                  style={{
                    background: "oklch(0.18 0.04 330 / 0.8)",
                    border: "1px solid oklch(0.28 0.05 330)",
                    color: "oklch(0.65 0.05 330)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!imageDataUrl || isSubmitting}
            className="btn-rose-gold w-full py-4 rounded-2xl font-sans font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Sending with love..." : "Send with Love ♥"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
