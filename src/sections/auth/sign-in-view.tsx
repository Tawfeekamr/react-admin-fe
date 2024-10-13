import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { login } from 'src/services/authService';
import { toast } from 'react-hot-toast';

// ----------------------------------------------------------------------

export function SignInView() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    if(localStorage.getItem('jwtToken')) {
        router.push('/home');
    }

    const handleSignIn = useCallback(async () => {
        setLoading(true);
        try {
            const data = await login(email, password);
            console.log('Login successful', data);
            toast.success('Login successful!');
            router.push('/home');
        } catch (err: any) {
            console.log('XXX',err);
            if (err?.response?.data?.error) {
                const message = err.response.data.error.message || 'An error occurred';
                toast.error(message);
            } else {
                toast.error('An error occurred, please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [email, password, router]);

    const renderForm = (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
            <TextField
                fullWidth
                name="email"
                label="Email address"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
            />

            <TextField
                fullWidth
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="contained"
                loading={loading}
                onClick={handleSignIn}
            >
                Sign in
            </LoadingButton>
        </Box>
    );

    return (
        <>
            <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h5">Sign in</Typography>
            </Box>

            {renderForm}

            <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
                <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
                >
                    OR
                </Typography>
            </Divider>

            <Box gap={1} display="flex" justifyContent="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Please contact your administrator to request access.
                </Typography>
            </Box>
        </>
    );
}
