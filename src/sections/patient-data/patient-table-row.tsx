import type { IPatientData } from 'src/services/patientDataService';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Avatar } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { BASE_URL } from 'src/utils/statics';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  isAdmin: boolean;
  row: IPatientData;
  selected: boolean;
  onSelectRow: () => void;
  setSelectedPatient: (row: IPatientData) => void;
};

export function PatientTableRow({
  row,
  isAdmin,
  selected,
  onSelectRow,
  setSelectedPatient,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const isImage =
    row.attributes.data_file.data.attributes.ext.toLowerCase().includes('jpg') ||
    row.attributes.data_file.data.attributes.ext.toLowerCase().includes('png') ||
    row.attributes.data_file.data.attributes.ext.toLowerCase().includes('jpeg') ||
    row.attributes.data_file.data.attributes.ext.toLowerCase().includes('helc');

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditRow = useCallback(() => {
    setSelectedPatient({ ...row, isEdit: true });
    handleClosePopover();
  }, [handleClosePopover, row, setSelectedPatient]);

  const handleDeleteRow = useCallback(() => {
    setSelectedPatient({ ...row, isEdit: false });
    handleClosePopover();
  }, [handleClosePopover, row, setSelectedPatient]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {`${dayjs(row.attributes.upload_date).format('dddd, MMMM D, YYYY')} at ${dayjs(row.attributes.upload_date).format('hh:mm A')}`}
          </Box>
        </TableCell>

        <TableCell>{row.attributes.name}</TableCell>

        <TableCell>{`${row.attributes.approved}`}</TableCell>

        <TableCell>{`${row.attributes.approval_send || '-'}`}</TableCell>

        <TableCell>{`${row.attributes.approval_request.data || '-'}`}</TableCell>

        <TableCell>
          {!row.attributes.data_file.data.attributes.url ? (
            <div>{` - `}</div>
          ) : (
            <>
              {isImage ? (
                <Avatar
                  alt={row.attributes.name}
                  src={`${BASE_URL}${row.attributes.data_file.data.attributes.url}`}
                />
              ) : (
                <div
                  style={{
                    background: '#efefef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100%',
                    width: '2.5rem',
                    height: '2.5rem',
                    fontSize: '12px',
                  }}
                >{`${row.attributes.data_file.data.attributes.ext}`}</div>
              )}
            </>
          )}
        </TableCell>

        <TableCell>{`${row.attributes.reject_reason}`}</TableCell>

        <TableCell>{`${row.attributes.processed}`}</TableCell>

        {isAdmin && (
          <TableCell align="right">
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEditRow}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteRow} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
