import { useState, useCallback } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { menuItemClasses } from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Tooltip from "@mui/material/Tooltip";
import { fDateTime } from '../../utils/format-time';
import {BASE_URL} from "../../utils/statics";
import {EntryData, IApproval} from '../../types';

// ----------------------------------------------------------------------

type ApprovalTableRowProps = {
    row: IApproval;
    refetch: () => void;
    selected: boolean;
    onSelectRow: () => void;
};

export function ApprovalTableRow({ row, selected, onSelectRow , refetch}: ApprovalTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const enteryData: EntryData = row.attributes.entery.data;
    const patientsDataId = enteryData.id;

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);
    console.log('row **', row);
    const handleDownloadFile = () => {
        const id: string = row?.attributes?.data_id || '';

        if (!id) {
            console.error('File ID is missing');
            return;
        }

        // Construct the direct download URL
        const fileName = row.attributes?.path; // Assuming file_name attribute is available
        console.log('fileName', row);
        const url = `${BASE_URL}${fileName}`;
        if (!fileName) {
            console.error('File Name is missing');
            return;
        }
        const link = document.createElement('a');
        link.href = url;

        // Set download attribute to suggest a filename
        link.setAttribute('download', fileName);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };


    const handleApprove = () => {
        setOpenApproveDialog(true);
    };

    const handleReject = () => {
        setOpenRejectDialog(true);
    };

    const handleApproveConfirm = async () => {
        setOpenApproveDialog(false);
        try {
            await axios.put(`${BASE_URL}/api/patients-data/${patientsDataId}`, {
                data: {
                    approved: true,
                    reject_reason: '',
                },
            });

            refetch()
        } catch (error) {
            console.error('Failed to approve the file', error);
        }
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason) {
            console.error('Reject reason is required');
            return;
        }
        setOpenRejectDialog(false);
        try {
            await axios.put(`${BASE_URL}/api/patients-data/${row.id}`, {
                data: {
                    approved: false,
                    reject_reason: rejectReason,
                },
            });
            refetch()
        } catch (error) {
            console.error('Failed to reject the file', error);
        }
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
                        <IconButton disabled={enteryData.attributes.approved} onClick={handleApprove}>
                            <Iconify icon="solar:verified-check-outline" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject the file">
                        <IconButton disabled={enteryData.attributes.approved} onClick={handleReject}>
                            <Iconify icon="solar:shield-cross-linear" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>

            {/* Approve Dialog */}
            <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
                <DialogTitle>Approve File</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to approve the file?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenApproveDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleApproveConfirm} color="inherit" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
                <DialogTitle>Reject File</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide a reason for rejecting the file.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reject Reason"
                        type="text"
                        fullWidth
                        variant="outlined"
                        sx={{mt: 1}}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRejectDialog(false)} color="inherit" >Cancel</Button>
                    <Button onClick={handleRejectConfirm} variant="contained" color="error" >Reject</Button>
                </DialogActions>
            </Dialog>

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