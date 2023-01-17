import { useSession, signOut } from "next-auth/react";
import { useCallback, useEffect } from "react";

export function useSignOut() {
  const session = useSession();
  const handleSignout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  useEffect(() => {
    if (session.status !== "authenticated" && session.status !== "loading") {
      handleSignout();
    }
  }, [session, handleSignout]);

  return { handleSignout } as const;
}
