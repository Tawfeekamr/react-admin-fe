import {useEffect} from "react";
import { Helmet } from 'react-helmet-async';

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CONFIG } from 'src/config-global';

import {useAuthStore} from "../services/authService";
import {DashboardContent} from "../layouts/dashboard";

// ----------------------------------------------------------------------

export default function Page() {
    const {user, getUser} = useAuthStore();

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user, getUser]);
  return (
    <>
      <Helmet>
        <title> {`Home - ${CONFIG.appName}`}</title>
        <meta
          name="Home"
          content="React application dashboard admin data visualization"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Hi, Welcome back 👋
            </Typography>
           <Stack>
               <Typography fontWeight="bold" component="h2" color="blueviolet">Hey {user?.username}:</Typography>
               <Typography>
                   Here's what's happening with your data today
               </Typography>
           </Stack>
        </DashboardContent>
    </>
  );
}
