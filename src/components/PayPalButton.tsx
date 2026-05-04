import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getAuth } from 'firebase/auth';
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY, IS_PAYPAL_SANDBOX, createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import type { PayPalPaymentParams } from '@/lib/paypal';

interface PayPalButtonProps extends PayPalPaymentParams {
  onSuccess: (details: { paypalOrderId: string; status: string }) => void;
  onError?: (err: unknown) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

function PayPalButtonInner({
  onSuccess,
  onError,
  onCancel,
  disabled,
  ...params
}: PayPalButtonProps) {
  const getToken = async (): Promise<string> => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('Not authenticated');
    return user.getIdToken();
  };

  return (
    <PayPalButtons
      disabled={disabled}
      forceReRender={[params.amount, params.currency]}
      createOrder={async () => {
        const token = await getToken();
        return createPayPalOrder(params, token);
      }}
      onApprove={async (data) => {
        try {
          const token = await getToken();
          const capture = await capturePayPalOrder(data.orderID, token);
          onSuccess({ paypalOrderId: capture.id, status: capture.status });
        } catch (err) {
          onError?.(err);
        }
      }}
      onError={onError}
      onCancel={onCancel}
      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
    />
  );
}

export function PayPalButton(props: PayPalButtonProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: props.currency || PAYPAL_CURRENCY,
        intent: 'capture',
        ...(IS_PAYPAL_SANDBOX ? { 'buyer-country': 'ZA' } : {}),
      }}
    >
      <PayPalButtonInner {...props} />
    </PayPalScriptProvider>
  );
}
