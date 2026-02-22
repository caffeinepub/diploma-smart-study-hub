import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BranchSelectionPage from './pages/BranchSelectionPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ContentBrowserPage from './pages/ContentBrowserPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RemindersPage from './pages/RemindersPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import CertificatesPage from './pages/CertificatesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import { Toaster } from './components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const branchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/branches',
  component: BranchSelectionPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: SubscriptionPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content/$branch',
  component: ContentBrowserPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reminders',
  component: RemindersPage,
});

const quizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: QuizListPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz/$quizId',
  component: QuizPage,
});

const certificatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certificates',
  component: CertificatesPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboardPage,
});

const adminContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/content',
  component: ContentManagementPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UserManagementPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  branchesRoute,
  subscriptionRoute,
  contactRoute,
  loginRoute,
  dashboardRoute,
  profileRoute,
  contentRoute,
  leaderboardRoute,
  remindersRoute,
  quizzesRoute,
  quizRoute,
  certificatesRoute,
  adminDashboardRoute,
  adminContentRoute,
  adminUsersRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
