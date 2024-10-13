import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import PrivateRoute from './components/PrivateRoute';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const HomeTwoPage = lazy(() => import('src/pages/homeTwo'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const PatientPage = lazy(() => import('src/pages/patient'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const LinksPage = lazy(() => import('src/pages/links'));
export const ApprovalsPage = lazy(() => import('src/pages/approvals'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

export function Router() {
    return useRoutes([
        {
            path: '/',
            element: (
                <AuthLayout>
                    <SignInPage />
                </AuthLayout>
            ),
            index: true,
        },
        {
            element: (
                <PrivateRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback}>
                            <Outlet />
                        </Suspense>
                    </DashboardLayout>
                </PrivateRoute>
            ),
            children: [
                { path: 'dashboard', element: <LinksPage /> },
                { path: 'home', element: <HomeTwoPage /> },
                { path: 'patient', element: <PatientPage /> },
                { path: 'approvals', element: <ApprovalsPage /> },
            ],
        },
        {
            path: 'sign-in',
            element: (
                <AuthLayout>
                    <SignInPage />
                </AuthLayout>
            ),
        },
        {
            path: '404',
            element: <Page404 />,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);
}
