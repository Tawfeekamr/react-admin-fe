import type { IPatientData } from 'src/services/patientDataService';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useAuthStore } from 'src/services/authService';
import { DashboardContent } from 'src/layouts/dashboard';
import { getPatientData } from 'src/services/patientDataService';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import PatientDialog from '../patient-dialog';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { PatientTableRow } from '../patient-table-row';
import { PatientTableHead } from '../patient-table-head';
import PatientDeleteDialog from '../patient-delete-dialog';
import { PatientTableToolbar } from '../patient-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export function PatientView() {
  const table = useTable();

  const [isEdit, setIsEdit] = useState(false);
  const [filterName, setFilterName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<IPatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<IPatientData>();
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState<boolean>(false);

  const { user, getUser } = useAuthStore();
  const isAdmin = user?.role.type.toLowerCase() === 'admin';

  const dataFiltered: IPatientData[] = applyFilter({
    inputData: patientData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const getPatientDataHandler = useCallback(async () => {
    const response = await getPatientData(1, 10);

    setPatientData(response);
  }, []);

  const notFound = !dataFiltered.length && !!filterName;

  useEffect(() => {
    getPatientDataHandler();
  }, [getPatientDataHandler]);

  useEffect(() => {
    if (selectedPatient && selectedPatient.id) {
      if (selectedPatient.isEdit) {
        setIsEdit(true);
        setIsDialogOpen(true);
      } else setIsDialogDeleteOpen(true);
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (!user) getUser();
  }, [user, getUser]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Patients Data
        </Typography>
        <Button
          color="inherit"
          variant="contained"
          onClick={() => {
            setIsEdit(false);
            setIsDialogOpen(true);
          }}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Upload New Patient Data
        </Button>
      </Box>

      <Card>
        <PatientTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <PatientTableHead
                order={table.order}
                onSort={table.onSort}
                orderBy={table.orderBy}
                rowCount={patientData.length}
                numSelected={table.selected.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    patientData.map((item) => `${item.id}`)
                  )
                }
                headLabel={[
                  { id: 'upload_date', label: 'Upload Date' },
                  { id: 'name', label: 'Name' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'approval_send', label: 'Approval Send' },
                  { id: 'approval_request', label: 'Approval Request' },
                  { id: 'data_file', label: 'Data File' },
                  { id: 'reject_reason', label: 'Reject Reason' },
                  { id: 'processed', label: 'Processed' },
                  ...(isAdmin ? [{ id: '', label: '' }] : []),
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <PatientTableRow
                      row={row}
                      key={row.id}
                      isAdmin={isAdmin}
                      setSelectedPatient={setSelectedPatient}
                      selected={table.selected.includes(`${row.id}`)}
                      onSelectRow={() => table.onSelectRow(`${row.id}`)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, patientData.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={patientData.length}
          rowsPerPage={table.rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <PatientDialog
        isEdit={isEdit}
        isAdmin={isAdmin}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        refetch={getPatientDataHandler}
        selectedPatient={selectedPatient}
      />
      <PatientDeleteDialog
        open={isDialogDeleteOpen}
        setOpen={setIsDialogDeleteOpen}
        refetch={getPatientDataHandler}
        selectedPatient={selectedPatient}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
