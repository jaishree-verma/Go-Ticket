// GoTicket Payment Service Boundary
// Provides clean abstraction between Agent, Booking Service, and Payment Gateways.
// Strictly separates DEMO mode from production gateway adapters (e.g. Razorpay, Stripe).
// NEVER stores or processes raw credit card numbers, CVV, or banking PINs.

/**
 * Standard Payment Gateway Adapter Interface
 */
class BasePaymentAdapter {
  async processPayment(params) {
    throw new Error('processPayment must be implemented by adapter.');
  }

  async verifyPayment(transactionId) {
    throw new Error('verifyPayment must be implemented by adapter.');
  }
}

/**
 * Demo Payment Gateway Adapter
 * Simulates asynchronous payment authorization without requiring external merchant credentials.
 */
class DemoPaymentAdapter extends BasePaymentAdapter {
  async processPayment({ amount, currency = 'INR', bookingContext = {}, method = 'demo', simulateFailure = false }) {
    if (simulateFailure) {
      return {
        success: false,
        status: 'FAILED',
        error: 'Payment declined by simulated issuing bank.',
        mode: 'demo',
        timestamp: new Date().toISOString()
      };
    }

    // Generate simulated transaction ID (e.g. TXN_DEMO_9F82A1)
    const transactionId = 'TXN_DEMO_' + Math.random().toString(36).substring(2, 9).toUpperCase();

    return {
      success: true,
      transactionId,
      status: 'AUTHORIZED',
      amount,
      currency,
      paymentMethod: method === 'upi' ? 'UPI_DEMO' : 'DEMO_PAYMENT',
      mode: 'demo',
      disclaimer: 'This transaction was processed in Demo Sandbox mode. No real money was debited.',
      timestamp: new Date().toISOString()
    };
  }

  async verifyPayment(transactionId) {
    if (!transactionId || !transactionId.startsWith('TXN_DEMO_')) {
      return { verified: false, error: 'Invalid demo transaction reference.' };
    }
    return { verified: true, status: 'CAPTURED', transactionId, mode: 'demo' };
  }
}

// Active adapter instance (default to DemoPaymentAdapter)
const activeAdapter = new DemoPaymentAdapter();

/**
 * Executes payment for a travel booking through the payment boundary.
 *
 * @param {Object} opts
 * @param {number} opts.amount - Amount in INR
 * @param {string} [opts.currency='INR']
 * @param {Object} opts.bookingContext - Summary metadata of the booking
 * @param {string} [opts.method='demo'] - 'demo' | 'upi'
 * @param {boolean} [opts.simulateFailure=false]
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async ({
  amount,
  currency = 'INR',
  bookingContext = {},
  method = 'demo',
  simulateFailure = false
}) => {
  if (typeof amount !== 'number' || amount <= 0) {
    return {
      success: false,
      status: 'INVALID_AMOUNT',
      error: 'Valid non-zero payment amount is required.'
    };
  }

  return activeAdapter.processPayment({
    amount,
    currency,
    bookingContext,
    method,
    simulateFailure
  });
};

/**
 * Verifies transaction status with the payment gateway.
 * @param {string} transactionId
 * @returns {Promise<Object>}
 */
export const verifyPayment = async (transactionId) => {
  return activeAdapter.verifyPayment(transactionId);
};

/**
 * Creates a reconciliation tracking record if payment succeeded but downstream booking commitment failed.
 * Protects user funds and provides a non-hallucinatory audit state.
 *
 * @param {Object} opts
 * @param {string} opts.transactionId
 * @param {number} opts.amount
 * @param {string} opts.reason
 * @returns {Object} Reconciliation descriptor
 */
export const createReconciliationRecord = ({ transactionId, amount, reason }) => {
  const record = {
    reconciliationId: 'REC_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    transactionId,
    amount,
    reason: reason || 'Downstream booking service failed to commit reserved seats.',
    status: 'PENDING_INVESTIGATION_OR_AUTO_REFUND',
    userNotice: 'Your payment was authorized, but the bus booking could not be completed. Please do not make another payment while the transaction is being reconciled.',
    createdAt: new Date().toISOString()
  };

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('pendingReconciliations') || '[]');
      existing.push(record);
      localStorage.setItem('pendingReconciliations', JSON.stringify(existing));
    }
  } catch (e) {
    // Graceful fallback for non-browser or test environments
  }

  return record;
};

const paymentService = {
  processPayment,
  verifyPayment,
  createReconciliationRecord
};

export default paymentService;
