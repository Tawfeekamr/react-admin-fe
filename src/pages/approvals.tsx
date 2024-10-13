import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {ApprovalView} from "../sections/approval/view/approval-view";

// ----------------------------------------------------------------------

export default function LinksPage() {
  return (
    <>
      <Helmet>
        <title> {`Approvals - ${CONFIG.appName}`}</title>
      </Helmet>

      <ApprovalView />
    </>
  );
}
