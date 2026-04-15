import { useStore } from "@/context/StoreContext";
import { ReactNode } from "react";
import ComingSoon from "@/pages/ComingSoon";

interface ComingSoonGuardProps {
  children: ReactNode;
  portal: string;
}

const ComingSoonGuard = ({ children, portal }: ComingSoonGuardProps) => {
  const { user } = useStore();

  if (user?.role === "admin") {
    return <>{children}</>;
  }

  return <ComingSoon portal={portal} />;
};

export default ComingSoonGuard;
