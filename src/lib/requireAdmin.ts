import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return null;
  }
  return session;
}
