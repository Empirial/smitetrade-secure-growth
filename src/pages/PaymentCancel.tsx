import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const portal = searchParams.get('custom_str1') || '';

  const portalDashboard: Record<string, string> = {
    customer: '/customer/checkout',
    owner: '/owner/subscription',
    cashier: '/cashier/checkout',
    driver: '/driver/wallet',
    lender: '/lender/loans',
    subscription: '/owner/subscription',
  };

  const returnPath = portalDashboard[portal] || '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-red-900">
        <CardContent className="p-8 text-center space-y-6">
          <XCircle className="w-16 h-16 text-red-400 mx-auto" />

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
            <p className="text-gray-400">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate(returnPath)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
