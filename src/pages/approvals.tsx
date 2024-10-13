import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {PatientView} from "../sections/patient-data/view/patient-view";

// ----------------------------------------------------------------------

export default function LinksPage() {
  return (
    <>
      <Helmet>
        <title> {`Approvals - ${CONFIG.appName}`}</title>
      </Helmet>

      <PatientView />
    </>
  );
}
