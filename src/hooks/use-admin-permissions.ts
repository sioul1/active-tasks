import { useAuth } from "@/hooks/useAuth";
import { AdminModule, hasModulePermission } from "@/config/admin";

export const useAdminPermission = (moduleName: AdminModule) => {
  const { user } = useAuth();

  const hasPermission = (): boolean => {
    if (!user?.email || !moduleName) return false;
    return hasModulePermission(user.email, moduleName);
  };

  return {
    hasPermission,
    isLoading: !user,
  };
};
