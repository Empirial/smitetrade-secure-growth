import { useStore } from '@/context/StoreContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { UserRole } from '@/types';

interface AuthGuardProps {
  children: ReactNode;
  role: UserRole;
}

const loginPaths: Record<UserRole, string> = {
  owner: '/owner/login',
  cashier: '/cashier/login',
  customer: '/customer/login',
  driver: '/driver/login',
  admin: '/admin/login',
  lender: '/lender/login',
};

const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const { user, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPaths[role] || '/login'} replace />;
  }

  // Allow access if user role matches, or if user is admin (admin can access everything)
  if (user.role !== role && user.role !== 'admin') {
    return <Navigate to={loginPaths[user.role] || '/login'} replace />;
  }

  // Block unverified owners and customers
  if ((user.role === 'owner' || user.role === 'customer') && user.emailVerified === false) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
