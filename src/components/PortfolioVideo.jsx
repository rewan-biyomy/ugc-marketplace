import { ExternalLink } from "lucide-react";
import { getVideoEmbedUrl, isDirectVideoUrl } from "../utils/portfolio";

export default function PortfolioVideo({ src, title, poster, className = "" }) {
  const embedUrl = getVideoEmbedUrl(src);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={className}
      />
    );
  }

  if (isDirectVideoUrl(src)) {
    return <video src={src} poster={poster} controls playsInline preload="metadata" className={className} />;
  }

  return (
    <a href={src} target="_blank" rel="noreferrer" className={`flex flex-col items-center justify-center gap-2 bg-navy-950 p-4 text-center text-sm font-bold text-sage hover:text-sage-light ${className}`}>
      <ExternalLink className="h-6 w-6" />
      فتح الفيديو
    </a>
  );
}