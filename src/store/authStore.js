import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedUsers } from "../data/seed";

/**
 * مخزن المصادقة
 * مسؤول عن:
 * - تسجيل الدخول
 * - إنشاء حساب
 * - تسجيل الخروج
 * - تحديث البروفايل
 * - إدارة المستخدمين
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // المستخدم الحالي
      user: null,

      // جميع المستخدمين
      users: seedUsers,

      /**
       * تسجيل الدخول
       */
      login: (email, password) => {
        const normalizedEmail = String(email || "")
          .trim()
          .toLowerCase();

        const found = get().users.find(
          (u) =>
            String(u.email).toLowerCase() === normalizedEmail &&
            u.password === password
        );

        if (!found) {
          return {
            ok: false,
            error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          };
        }

        set({
          user: found,
        });

        return {
          ok: true,
          user: found,
        };
      },

      /**
       * إنشاء حساب جديد
       */
      register: (data) => {
        const email = String(data.email || "")
          .trim()
          .toLowerCase();

        if (!email) {
          return {
            ok: false,
            error: "من فضلك أدخل البريد الإلكتروني",
          };
        }

        const exists = get().users.some(
          (u) => String(u.email).toLowerCase() === email
        );

        if (exists) {
          return {
            ok: false,
            error: "هذا البريد مسجل بالفعل",
          };
        }

        const newUser = {
          id: Date.now(),
          role: data.role || "client",
          name: data.name || "",
          password: data.password || "",
          image: data.image || "",
          bio: data.bio || "",
          works: Array.isArray(data.works) ? data.works : [],
          videos: Array.isArray(data.videos) ? data.videos : [],
          rating: 5,

          ...(data.role === "creator"
            ? {
                profession: data.profession || "",
                dialect: data.dialect || "",
                niche: data.niche || "",
                price: Number(data.price) || 0,
              }
            : {}),

          ...data,

          // نضمن أن البريد يبقى normalized
          email,
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
        }));

        return {
          ok: true,
          user: newUser,
        };
      },

      /**
       * تسجيل الخروج
       */
      logout: () => {
        set({
          user: null,
        });
      },

      /**
       * تحديث بيانات المستخدم
       */
      updateProfile: (userId, updates) => {
        const users = get().users.map((user) =>
          user.id === userId
            ? {
                ...user,
                ...updates,
              }
            : user
        );

        const currentUser = get().user;

        set({
          users,
          user:
            currentUser?.id === userId
              ? {
                  ...currentUser,
                  ...updates,
                }
              : currentUser,
        });
      },

      /**
       * حذف مستخدم
       */
      deleteUser: (userId) => {
        const currentUser = get().user;

        set({
          users: get().users.filter((user) => user.id !== userId),

          // لو الأدمن حذف نفسه أو المستخدم الحالي
          user:
            currentUser?.id === userId
              ? null
              : currentUser,
        });
      },

      /**
       * البحث عن مستخدم بواسطة ID
       */
      getUserById: (userId) => {
        return get().users.find(
          (user) => user.id === Number(userId)
        );
      },

      /**
       * البحث عن مستخدم بواسطة البريد
       */
      getUserByEmail: (email) => {
        const normalizedEmail = String(email || "")
          .trim()
          .toLowerCase();

        return get().users.find(
          (user) =>
            String(user.email).toLowerCase() === normalizedEmail
        );
      },
    }),
    {
      name: "ugc-auth",
    }
  )
);