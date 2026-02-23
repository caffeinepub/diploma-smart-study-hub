# Specification

## Summary
**Goal:** Update the PhonePe UPI ID for subscription payments and hide it from users in the payment interface.

**Planned changes:**
- Update backend payment configuration to use UPI ID '9392412728-2@axl' for PhonePe payments
- Modify frontend payment UI to mask or hide the full UPI ID while keeping QR code and payment functionality intact

**User-visible outcome:** Users can subscribe via PhonePe using the updated payment method, with the UPI ID no longer displayed in full on the payment screen. The QR code and payment links will continue to work normally.
