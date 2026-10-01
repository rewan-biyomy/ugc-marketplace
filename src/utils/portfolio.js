export function getCreatorWorks(creator) {
  const works = [];
  const seenUrls = new Set();

  const addWork = (work, id, title) => {
    if (!work?.url || seenUrls.has(work.url)) return;

    seenUrls.add(work.url);
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
