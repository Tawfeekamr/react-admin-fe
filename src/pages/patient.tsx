import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {PatientView} from "../sections/PatientData/view";

// ----------------------------------------------------------------------

export default function PatientPage() {
  return (
    <>
      <Helmet>
        <title> {`Patient Data - ${CONFIG.appName}`}</title>
      </Helmet>

      <PatientView />
    </>
  );
}
