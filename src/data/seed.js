/**
 * البيانات الأولية للمنصة — كل المستخدمين (عملاء/صناع/أدمن) في مكان واحد
 * اللهجات: كل دول الوطن العربي
 */
export const VIDEO_SOURCES = [
  "https://pin.it/5UKaRZiQK",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

// كل اللهجات العربية
export const dialects = [
  "مصرية", "سعودية", "خليجية", "شامية", "فلسطينية", "أردنية",
  "لبنانية", "عراقية", "مغربية", "تونسية", "جزائرية", "ليبية",
  "سودانية", "يمنية",
];

export const niches = ["فاشون", "تجميل", "لايف ستايل", "أغذية", "تقنية", "رياضة", "سيارات"];

export const professions = ["موديل", "مصور", "مونتير", "كاتب سكريبت"];

// المستخدمون الأوليون — كلمات المرور للتجربة: 123456
export const seedUsers = [
  {
    id: 1, role: "client", name: "أحمد محمود", email: "client@ugc.com",
    password: "123456", image: "https://i.pravatar.cc/150?img=12",
    bio: "صاحب براند عطور شرقية، أبحث عن صناع محتوى محترفين.",
    works: [],
  },
  {
    id: 2, role: "creator", name: "سارة", email: "creator@ugc.com",
    password: "123456", image: "https://i.pravatar.cc/150?img=47",
    bio: "موديل وصانعة محتوى UGC متخصصة في الفاشون والتجميل، خبرة 4 سنوات مع كبرى البراندات.",
    profession: "موديل", dialect: "مصرية", niche: "فاشون",
    price: 700, rating: 4.9,
    videos: [VIDEO_SOURCES[0], VIDEO_SOURCES[1]],
  },
  {
    id: 3, role: "admin", name: "مدير المنصة", email: "admin@ugc.com",
    password: "123456", image: "https://i.pravatar.cc/150?img=68", bio: "", works: [],
  },
  {
    id: 4, role: "creator", name: "ليلى", email: "leila@ugc.com",
    password: "123456", image: "https://i.pravatar.cc/150?img=44",
    bio: "موديل سعودية متخصصة في محتوى التجميل باللهجة الخليجية.",
    profession: "موديل", dialect: "سعودية", niche: "تجميل",
    price: 800, rating: 4.8,
    videos: [VIDEO_SOURCES[2], VIDEO_SOURCES[3]],
  },
  {
    id: 5, role: "creator", name: "نور الهدى", email: "nour@ugc.com",
    password: "123456", image: "https://i.pravatar.cc/150?img=32",
    bio: "مصورة ومونتيرة محترفة، أحوّل الأفكار لإعلانات تجذب العملاء.",
    profession: "مونتير", dialect: "شامية", niche: "لايف ستايل",
    price: 600, rating: 4.7,
    videos: [VIDEO_SOURCES[1], VIDEO_SOURCES[2]],
  },
];

// الطلبات الأولية
export const seedOrders = [
  { id: 101, clientId: 1, clientName: "أحمد محمود", creatorId: 2, creatorName: "سارة",
    productName: "كريم ترطيب طبيعي", packageType: "edited", quantity: 2, shipping: true,
    total: 2550, status: "pending", date: "2026-09-28" },
  { id: 102, clientId: 1, clientName: "أحمد محمود", creatorId: 2, creatorName: "سارة",
    productName: "عطر شرقي فاخر", packageType: "raw", quantity: 1, shipping: false,
    total: 700, status: "in_progress", date: "2026-09-25" },
  { id: 103, clientId: 1, clientName: "أحمد محمود", creatorId: 4, creatorName: "ليلى",
    productName: "سيروم فيتامين C", packageType: "edited", quantity: 3, shipping: true,
    total: 4400, status: "completed", date: "2026-09-20" },
];

// المحادثات الأولية
export const seedConversations = [
  {
    id: 1, name: "روان", image: "https://i.pinimg.com/736x/4d/c5/fd/4dc5fde6127f1b258eb2484a155d2535.jpg",
    messages: [
      { id: 1, from: "them", text: "أهلاً بك، وصلني طلبك الخاص بالفيديو الإعلاني", time: "10:30" },
      { id: 2, from: "me", text: "أهلاً سارة، أحتاج فيديوهات بمونتاج كامل لمنتج العطر", time: "10:32" },
    ],
  },
  {
    id: 2, name: "ليلى", image: "https://i.pravatar.cc/150?img=44",
    messages: [
      { id: 1, from: "me", text: "ما هي جودة الفيديو الخام؟", time: "أمس" },
      { id: 2, from: "them", text: "4K خام بالكامل بدون أي معالجة", time: "أمس" },
    ],
  },
];

export const creators = seedUsers.filter((user) => user.role === "creator");
export const orders = seedOrders;
export const conversations = seedConversations;

export const orderPackages = {
  raw: { label: "فيديو خام", multiplier: 1 },
  edited: { label: "فيديو بمونتاج", multiplier: 1.25 },
};

export const SHIPPING_FEE = 100;

export const filterOptions = {
  dialects: ["الكل", ...dialects],
};

export const ORDER_STATUSES = {
  pending: { label: "قيد الانتظار", color: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  in_progress: { label: "جاري التنفيذ", color: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
  completed: { label: "مكتمل", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  rejected: { label: "مرفوض", color: "border-red-500/30 bg-red-500/10 text-red-300" },
};