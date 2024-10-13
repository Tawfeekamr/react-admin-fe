import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Tooltip from "@mui/material/Tooltip";
import { fDateTime } from '../../utils/format-time';
import {BASE_URL} from "../../utils/statics";
import {ApprovalRequest, EntryData} from '../../types';

// ----------------------------------------------------------------------

type ApprovalTableRowProps = {
  row: ApprovalRequest;
  selected: boolean;
  onSelectRow: () => void;
};

export function ApprovalTableRow({ row, selected, onSelectRow }: ApprovalTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const enteryData: EntryData = row.attributes.entery.data;
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

    const handleDownloadFile = () => {
        const id: string = row?.attributes?.data_id || '';

        if (!id) {
            console.error('File ID is missing');
            return;
        }

        const url = `${BASE_URL}/api/download-file/custom-download/${id}`;

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', '');

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>{row?.id}</TableCell>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row?.attributes?.message}
          </Box>
        </TableCell>
        <TableCell align="center">{row?.attributes?.data_id}</TableCell>
        <TableCell>
          <Label color="default">{row?.attributes?.type}</Label>
        </TableCell>
        <TableCell>
          <Label color={enteryData.attributes.approved ? 'success' : 'error'}>
            {enteryData.attributes.approved ? 'approved' : 'Not Approved'}
          </Label>
        </TableCell>
        <TableCell align="center">
          <Label color={enteryData.attributes.processed ? 'success' : 'error'}>
            {enteryData.attributes.processed ? 'Yes' : 'No'}
          </Label>
        </TableCell>
        <TableCell>{fDateTime(row?.attributes?.createdAt)}</TableCell>
        <TableCell>{fDateTime(row?.attributes?.updatedAt)}</TableCell>

        <TableCell align="right">
            <Tooltip title="Download the file">
                <IconButton onClick={handleDownloadFile}>
                    <Iconify icon="eva:download-fill" />
                </IconButton>
            </Tooltip>
           <Tooltip title="Approve the file">
               <IconButton disabled={enteryData.attributes.approved} onClick={handleOpenPopover}>
                   <Iconify icon="solar:verified-check-outline" />
               </IconButton>
           </Tooltip>
            <Tooltip title="Reject the file">
                <IconButton disabled={enteryData.attributes.approved} onClick={handleOpenPopover}>
                    <Iconify icon="solar:shield-cross-linear" />
                </IconButton>
            </Tooltip>
        </TableCell>
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
          {/* <MenuItem onClick={handleClosePopover}> */}
          {/*  <Iconify icon="solar:pen-bold" /> */}
          {/*  Edit */}
          {/* </MenuItem> */}

          {/* <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}> */}
          {/*  <Iconify icon="solar:trash-bin-trash-bold" /> */}
          {/*  Delete */}
          {/* </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
