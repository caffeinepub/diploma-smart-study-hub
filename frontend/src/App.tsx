import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BranchSelectionPage from './pages/BranchSelectionPage';
import SemesterSelectionPage from './pages/SemesterSelectionPage';
import ContentBrowserPage from './pages/ContentBrowserPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import CertificatesPage from './pages/CertificatesPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import { useInternetIdentity } from './hooks/useInternetIdentity';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  if (!identity) {
    return <LoginPage />;
  }
  return <>{children}</>;
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <AuthGuard><DashboardPage /></AuthGuard>,
});

const branchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/branches',
  component: () => <AuthGuard><BranchSelectionPage /></AuthGuard>,
});

const semestersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/semesters/$branch',
  component: () => <AuthGuard><SemesterSelectionPage /></AuthGuard>,
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content/$branch/$semester',
  component: () => <AuthGuard><ContentBrowserPage /></AuthGuard>,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: () => <AuthGuard><SubscriptionPage /></AuthGuard>,
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

const certificatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certificates',
  component: () => <AuthGuard><CertificatesPage /></AuthGuard>,
});

const quizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: () => <AuthGuard><QuizListPage /></AuthGuard>,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz/$quizId',
  component: () => <AuthGuard><QuizPage /></AuthGuard>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  branchesRoute,
  semestersRoute,
  contentRoute,
  subscriptionRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  certificatesRoute,
  quizzesRoute,
  quizRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
