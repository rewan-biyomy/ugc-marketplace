const DATABASE_NAME = "ugc-marketplace-media";
const STORE_NAME = "files";
let databasePromise;

function openDatabase() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error("تخزين الملفات غير مدعوم في هذا المتصفح."));
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);

      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        databasePromise = null;
        reject(request.error || new Error("تعذر فتح مخزن الملفات."));
      };
    });
  }

  return databasePromise;
}

function createId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function storeMediaFiles(files) {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  const records = Array.from(files, (file) => {
    const id = createId();
    transaction.objectStore(STORE_NAME).put({ id, file });
    return {
      assetId: id,
      fileName: file.name,
      mediaType: file.type || "application/octet-stream",
      fileSize: file.size,
    };
  });

  await new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error("تعذر حفظ الملفات."));
    transaction.onabort = () => reject(transaction.error || new Error("تم إلغاء حفظ الملفات."));
  });

  return records;
}

export async function getStoredMediaFile(assetId) {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readonly");
  const request = transaction.objectStore(STORE_NAME).get(assetId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.file || null);
    request.onerror = () => reject(request.error || new Error("تعذر تحميل الملف."));
  });
}