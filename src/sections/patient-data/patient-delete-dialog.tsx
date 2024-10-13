import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { deleteFileService } from 'src/services/uploadService';
import { deletePatientById, type IPatientData } from 'src/services/patientDataService';

interface IPatientDeleteDialog {
  open: boolean;
  refetch(): void;
  setOpen(value: boolean): void;
  selectedPatient?: IPatientData;
}

export default function PatientDeleteDialog({
  open,
  setOpen,
  refetch,
  selectedPatient,
}: IPatientDeleteDialog) {
  const handleSave = async () => {
    if (selectedPatient && selectedPatient.id) {
      const response = await deletePatientById(selectedPatient.id);

      if (response.status === 200) {
        if (selectedPatient.attributes.data_file.data.id)
          await deleteFileService(selectedPatient.attributes.data_file.data.id);

        refetch();
        setOpen(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {selectedPatient && (
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete {selectedPatient.attributes.name}?
        </DialogTitle>
      )}

      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ bgcolor: 'error.main' }} onClick={handleSave} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
