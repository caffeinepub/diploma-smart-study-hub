# Specification

## Summary
**Goal:** Integrate Razorpay as a payment method for subscriptions alongside the existing Stripe integration.

**Planned changes:**
- Add Razorpay live key configuration to the backend actor
- Add `createRazorpayOrder` backend function that calls the Razorpay Orders API and returns an order ID and amount
- Add `verifyRazorpayPayment` backend function that validates HMAC-SHA256 signature and activates the user's subscription, recording the transaction alongside existing payments
- Create a `useRazorpayPayment` frontend hook that creates a Razorpay order, dynamically loads the Razorpay checkout script, opens the payment modal, and calls verification on success with error handling for failures and dismissal
- Update `SubscriptionPage` to show a "Pay with Razorpay" button on each plan card (weekly, monthly, half-yearly) with INR amounts, loading state, and post-payment redirect to dashboard with success toast
- Update `PaymentTransactionTable` to include Razorpay in the payment method filter dropdown and display a Razorpay badge for Razorpay transactions

**User-visible outcome:** Users can pay for subscriptions using Razorpay on the subscription page, and admins can filter and view Razorpay transactions in the payment table, while the existing Stripe flow remains unchanged.
