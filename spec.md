# Specification

## Summary
**Goal:** Remove all admin panel UI elements and routes from the frontend of the Diploma Smart Study Hub website.

**Planned changes:**
- Remove the "Admin Panel" button/link from the Dashboard page (DashboardPage.tsx)
- Remove the admin dropdown menu from the Header component (Header.tsx)
- Remove all `/admin/*` routes from the router configuration in App.tsx
- Remove any admin-specific redirect logic from the Login page (LoginPage.tsx) so all users are directed to the standard dashboard after login

**User-visible outcome:** No admin panel button, link, or navigation is visible anywhere on the website, and admin URLs are no longer accessible.
