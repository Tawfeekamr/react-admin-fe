import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {LinksView} from "../sections/links/view/links-view";

// ----------------------------------------------------------------------

export default function LinksPage() {
  return (
    <>
      <Helmet>
        <title> {`Dashboard Links - ${CONFIG.appName}`}</title>
      </Helmet>

      <LinksView />
    </>
  );
}
