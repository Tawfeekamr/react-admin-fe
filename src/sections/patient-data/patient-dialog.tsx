import type { IPatientData, IPatientUploadData } from 'src/services/patientDataService';

import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Chip, Checkbox, TextField, InputAdornment, FormControlLabel } from '@mui/material';

import { uploadFileService } from 'src/services/uploadService';
import {
  createPatientData,
  getPatientDataById,
  updatePatientDataById,
} from 'src/services/patientDataService';

import { Iconify } from 'src/components/iconify';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiFormControl-root': {
    width: '95%',
    margin: theme.spacing(1),
  },
  '& .MuiFormControlLabel-root': {
    width: '30%',
    margin: theme.spacing(1),
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface IPatientDialog {
  open: boolean;
  isEdit: boolean;
  refetch(): void;
  isAdmin: boolean;
  setOpen(value: boolean): void;
  selectedPatient?: IPatientData;
}

export default function PatientDialog({
  open,
  isEdit,
  setOpen,
  refetch,
  isAdmin,
  selectedPatient,
}: IPatientDialog) {
  const initialState = {
    name: '',
    data_file: { data: { id: 0, attributes: { url: '', ext: '' } } },
    upload_date: new Date(),
    reject_reason: '',
    uuid: '',
    approved: false,
    processed: false,
    approval_send: false,
    approval_request: {
      data: [],
      disconnect: [],
      connect: [],
    },
  };

  const [state, setState] = useState<IPatientUploadData>(initialState);
  const [uploadedFile, setUploadedFile] = useState<FileList | null | any>(null);

  const handleCancel = () => {
    setState(initialState);
    setUploadedFile(null);
    setOpen(false);
  };

  const handleSave = async () => {
    const localUUID = uuidv4();
    let response = null;

    const payload = { ...state, uuid: localUUID };

    if (isEdit && selectedPatient?.id)
      response = await updatePatientDataById(selectedPatient?.id, payload);
    else response = await createPatientData(payload);

    if (response && response.status === 200) {
      refetch();

      handleCancel();
    }
  };

  const uploadFileHandler = async (file: FileList) => {
    if (file && file[0]) {
      const formData = new FormData();

      formData.append('files', file[0]);

      const response = await uploadFileService(formData);

      if (response.status === 200)
        setState((items) => ({ ...items, data_file: response.data[0].id }));
    }
  };

  const getPatientDataByIdhandler = useCallback(async () => {
    if (selectedPatient && selectedPatient.id) {
      const response = await getPatientDataById(selectedPatient?.id);

      if (response && response.status === 200) {
        setState({
          ...response.data.data.attributes,
          data_file: response.data.data.attributes.data_file.data.id,
        });
        setUploadedFile([response.data.data.attributes.data_file.data.attributes]);
      }
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (isEdit) getPatientDataByIdhandler();
  }, [isEdit, getPatientDataByIdhandler]);

  return (
    <BootstrapDialog onClose={handleCancel} open={open} aria-hidden={false}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Upload New Patient Data</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCancel}
        sx={(theme) => ({
          top: 8,
          right: 8,
          position: 'absolute',
          color: theme.palette.grey[500],
        })}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <DialogContent dividers>
        <TextField
          label="Name"
          variant="outlined"
          value={state.name}
          onChange={(event) => {
            const { value } = event.target;

            setState((items) => ({ ...items, name: value }));
          }}
        />

        {isAdmin && (
          <TextField
            variant="outlined"
            label="Reject Reason"
            value={state.reject_reason}
            onChange={(event) => {
              const { value } = event.target;

              setState((items) => ({ ...items, reject_reason: value }));
            }}
          />
        )}

        <TextField
          disabled
          label="Data File"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:upload-line" />}
                  disabled={Boolean(uploadedFile && uploadedFile[0])}
                >
                  Upload
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => {
                      const { files } = event.target;

                      if (files) {
                        uploadFileHandler(files);

                        setUploadedFile(files);
                      }
                    }}
                  />
                </Button>
              </InputAdornment>
            ),
            startAdornment: uploadedFile && uploadedFile[0] && (
              <Chip label={uploadedFile[0].name} onDelete={() => setUploadedFile(null)} />
            ),
          }}
        />

        {isAdmin && (
          <>
            <FormControlLabel
              label="Approval Send"
              control={
                <Checkbox
                  checked={state.approval_send}
                  onChange={(event) => {
                    const { checked } = event.target;

                    setState((items) => ({ ...items, approval_send: checked }));
                  }}
                />
              }
            />

            <FormControlLabel
              label="Processed"
              control={
                <Checkbox
                  checked={state.processed}
                  onChange={(event) => {
                    const { checked } = event.target;

                    setState((items) => ({ ...items, processed: checked }));
                  }}
                />
              }
            />

            <FormControlLabel
              label="Approved"
              control={
                <Checkbox
                  checked={state.approved}
                  onChange={(event) => {
                    const { checked } = event.target;

                    setState((items) => ({ ...items, approved: checked }));
                  }}
                />
              }
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="inherit"
          variant="contained"
          onClick={handleSave}
          disabled={!state.data_file}
        >
          Save changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
