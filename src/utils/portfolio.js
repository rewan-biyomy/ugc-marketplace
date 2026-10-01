export function getCreatorWorks(creator) {
  const works = [];
  const seenUrls = new Set();
  const demoVideoUrls = new Set([
    "https://pin.it/5UKaRZiQK",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ]);

  const addWork = (work, id, title) => {
    if ((!work?.url && !work?.assetId) || demoVideoUrls.has(work.url) || seenUrls.has(work.url || work.assetId)) return;

    seenUrls.add(work.url || work.assetId);
    works.push({
      ...work,
      id: work.id ?? id,
      title: work.title?.trim() || title,
    });
  };

  (Array.isArray(creator?.works) ? creator.works : []).forEach((work, index) => {
    addWork(work, `work-${index}`, `فيديو ${index + 1}`);
  });

  (Array.isArray(creator?.videos) ? creator.videos : []).forEach((url, index) => {
    addWork({ url }, `video-${index}`, `فيديو ${works.length + 1}`);
  });

  return works;
}

export function createWorkId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `work-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeVideoUrl(value) {
  const input = String(value || "").trim();
  if (!input) return "";

  try {
    const url = new URL(input.includes("://") ? input : `https://${input}`);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.href;
  } catch {
    return "";
  }
}

export function getVideoEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const segments = url.pathname.split("/").filter(Boolean);
      const videoId = url.searchParams.get("v")
        || (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live" ? segments[1] : "");
      return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : "";
    }

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : "";
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
      return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
    }

    if (host === "drive.google.com") {
      const videoId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get("id");
      return videoId ? `https://drive.google.com/file/d/${encodeURIComponent(videoId)}/preview` : "";
    }
  } catch {
    return "";
  }

  return "";
}

export function isDirectVideoUrl(value) {
  try {
    return /\.(mp4|webm|ogg|mov|m3u8)$/i.test(new URL(value).pathname);
  } catch {
    return false;
  }
}
