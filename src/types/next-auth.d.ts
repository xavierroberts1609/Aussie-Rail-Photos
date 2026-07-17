import type { Role } from "@/lib/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      pendingName?: string | null;
    };
  }

  interface User {
    id: string;
    role: Role;
    pendingName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    pendingName?: string | null;
  }
}
