import { useStore } from "@/context/StoreContext";
import { ReactNode } from "react";
import ComingSoon from "@/pages/ComingSoon";

interface ComingSoonGuardProps {
  children: ReactNode;
  portal: string;
  allowAdminPreview?: boolean;
}

const ComingSoonGuard = ({ children, portal, allowAdminPreview = true }: ComingSoonGuardProps) => {
  const { user } = useStore();

  if (allowAdminPreview && user?.role === "admin") {
    return <>{children}</>;
  }

  return <ComingSoon portal={portal} />;
};

export default ComingSoonGuard;
