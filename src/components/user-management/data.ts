export type Role = "Admin" | "User";

export const MODULES = ["Dashboard", "Products", "User Management", "Activity Log"] as const;
export type ModuleName = (typeof MODULES)[number];

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  modules: ModuleName[];
  status: "Active" | "Inactive";
};

export const INITIAL_USERS: AppUser[] = [
  { id: "u1", name: "Rohit Kumar", email: "rohit.kumar@hul.com", role: "Admin", modules: [...MODULES], status: "Active" },
  { id: "u2", name: "Amit Kumar", email: "amit.kumar@hul.com", role: "User", modules: ["Dashboard", "Products"], status: "Active" },
  { id: "u3", name: "Neha Singh", email: "neha.singh@hul.com", role: "User", modules: ["Dashboard"], status: "Active" },
  { id: "u4", name: "Rahul Verma", email: "rahul.verma@hul.com", role: "User", modules: ["Dashboard", "Activity Log"], status: "Inactive" },
  { id: "u5", name: "Amit Sharma", email: "amit.sharma@hul.com", role: "Admin", modules: [...MODULES], status: "Active" },
];
