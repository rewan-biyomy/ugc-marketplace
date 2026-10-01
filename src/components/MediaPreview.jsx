import { useEffect, useState } from "react";
import { Download, ExternalLink, File } from "lucide-react";
import { getStoredMediaFile } from "../services/mediaStorage";
import { getVideoEmbedUrl, isDirectVideoUrl } from "../utils/portfolio";

function isImage(media, source) {
  return media.mediaType?.startsWith("image/")
    || /\.(avif|gif|jpe?g|png|webp)$/i.test(source || "");
}

function isVideo(media, source) {
  return media.mediaType?.startsWith("video/") || isDirectVideoUrl(source);
}

export default function MediaPreview({ media, title, poster, className = "", controls = true, linkFallback = true }) {
  const item = typeof media === "string" ? { url: media } : (media || {});
  const [storedMedia, setStoredMedia] = useState({ assetId: "", url: "" });
  const [failedAssetId, setFailedAssetId] = useState("");
  const storedUrl = storedMedia.assetId === item.assetId ? storedMedia.url : "";
  const loadError = failedAssetId === item.assetId;
  const source = item.url || storedUrl;
  const embedUrl = item.url ? getVideoEmbedUrl(item.url) : "";

  useEffect(() => {
    let active = true;
    let objectUrl = "";

    if (!item.assetId) return undefined;

    getStoredMediaFile(item.assetId)
      .then((file) => {
        if (!file) throw new Error("الملف غير موجود في التخزين المحلي.");
        objectUrl = URL.createObjectURL(file);
        if (active) setStoredMedia({ assetId: item.assetId, url: objectUrl });
        else URL.revokeObjectURL(objectUrl);
      })
      .catch(() => {
        if (active) setFailedAssetId(item.assetId);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [item.assetId]);

  if (embedUrl) {
    return <iframe src={embedUrl} title={title || item.title || "معاينة الوسائط"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen className={className} />;
  }

  if (!source) {
    return (
      <div role={loadError ? "alert" : undefined} className={`flex flex-col items-center justify-center gap-2 bg-navy-950 p-4 text-center text-sm text-gray-400 ${className}`}>
        {loadError ? "تعذر تحميل الملف من هذا المتصفح." : <File className="h-6 w-6" />}
        {loadError && item.fileName}
      </div>
    );
  }

  if (isImage(item, source)) {
    return <img src={source} alt={title || item.title || item.fileName || "صورة"} className={className} />;
  }

  if (isVideo(item, source)) {
    return <video src={source} poster={poster} controls={controls} muted={!controls} loop={!controls}
      autoPlay={!controls} playsInline preload="metadata" className={className} />;
  }

  if (!item.assetId && linkFallback) {
    return <a href={source} target="_blank" rel="noreferrer"
      className={`flex flex-col items-center justify-center gap-2 bg-navy-950 p-4 text-center text-sm font-bold text-sage hover:text-sage-light ${className}`}>
      <ExternalLink className="h-6 w-6" /> فتح الملف
    </a>;
  }

  if (!linkFallback) {
    return <div className={`flex flex-col items-center justify-center gap-2 bg-navy-950 p-4 text-center text-sm text-gray-400 ${className}`}>
      <File className="h-6 w-6" /> {item.title || item.fileName || "ملف"}
    </div>;
  }

  return (
    <a href={source} download={item.fileName || item.title || "download"} target="_blank" rel="noreferrer"
      className={`flex flex-col items-center justify-center gap-2 bg-navy-950 p-4 text-center text-sm font-bold text-sage hover:text-sage-light ${className}`}>
      <Download className="h-6 w-6" />
      <span className="max-w-full truncate">{item.fileName || item.title || "تنزيل الملف"}</span>
    </a>
  );
}