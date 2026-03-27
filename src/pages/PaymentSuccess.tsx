import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(true);

  const reference = searchParams.get('m_payment_id') || searchParams.get('pf_payment_id') || '';
  const amount = searchParams.get('amount_gross') || '';
  const itemName = searchParams.get('item_name') || '';
  const portal = searchParams.get('custom_str1') || '';

  // Mark transaction as completed in Firestore
  useEffect(() => {
    const markComplete = async () => {
      if (!reference) { setUpdating(false); return; }
      try {
        const q = query(collection(db, 'transactions'), where('reference', '==', reference));
        const snap = await getDocs(q);
        snap.forEach(async (docSnap) => {
          await updateDoc(doc(db, 'transactions', docSnap.id), {
            status: 'completed',
            completedAt: new Date().toISOString(),
          });
        });
      } catch (err) {
        console.error('Failed to update transaction status:', err);
      } finally {
        setUpdating(false);
      }
    };
    markComplete();
  }, [reference]);

  const portalDashboard: Record<string, string> = {
    customer: '/customer/products',
    owner: '/owner/dashboard',
    cashier: '/cashier/dashboard',
    driver: '/driver/dashboard',
    lender: '/lender/dashboard',
    admin: '/admin/dashboard',
    subscription: '/owner/subscription',
  };

  const returnPath = portalDashboard[portal] || '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-emerald-800">
        <CardContent className="p-8 text-center space-y-6">
          {updating ? (
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto" />
          ) : (
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Payment Successful</h1>
            <p className="text-gray-400">Your payment has been processed securely via PayFast.</p>
          </div>

          {(itemName || amount) && (
            <div className="bg-emerald-900/30 border border-emerald-800 rounded-lg p-4 text-left space-y-2">
              {itemName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Item</span>
                  <span className="text-white font-medium">{decodeURIComponent(itemName)}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-emerald-400 font-bold">R {parseFloat(amount).toFixed(2)}</span>
                </div>
              )}
              {reference && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reference</span>
                  <span className="text-gray-300 text-xs font-mono">{reference}</span>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={() => navigate(returnPath)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
