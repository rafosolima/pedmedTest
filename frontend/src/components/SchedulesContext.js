import React, { useEffect, useState } from "react";
import { DataGrid, GridRow } from '@material-ui/data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from "@material-ui/core";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { DesktopDateTimePicker } from "@material-ui/lab";
import api from '../services/Api'
import * as Session from '../session'

export default function SchedulesContext({ history }) {
    const [open, setOpen] = useState(false);
    const [patientId, setPatientId] = useState();
    const [marked, setMarked] = useState();
    const [markedText, setMarkedText] = useState();
    const [id, setID] = useState();
    const [openDeleteModal, setDeleteModal] = useState(false);
    const [rows, setRows] = useState([
        {
            id: '',
            patient_id: '',
            marked: ''
        }
    ]);
    const [patients, setRowsPatients] = useState([]);

    const openLoadEditModalClick = (row) => {
        setID(row.id);
        setPatientId(row.patient_id);
        console.log(row.maked);
        setMarked(row.maked);
        openModal();
    }

    const formatDateTime = (date) => {
        if (!date) return '';
        let dateTime = date.split('T');
        let dt = dateTime[0].split('-');
        let time = dateTime[1].split('.')[0];
        return `${dt[2]}/${dt[1]}/${dt[0]} ${time}`
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 200 },
        { 
            field: 'patientText', 
            headerName: 'Paciente', 
            width: 200,
            valueGetter: (params) => {
                let id = params.getValue('patient_id')
                let name = '';
                patients.forEach(patient => {
                    if (patient.id == id) {
                        name = patient.name;
                        return;
                    } 
                })

                return name;
            }
        },
        { 
            field: 'markedText',
            headerName: 'Data e hora',
            width: 300,
            valueGetter: (params) => {
                return formatDateTime(params.getValue('marked'))
            }
        },
        { 
            field: 'actions',
            headerName: 'Ações',
            width: 300,
            renderCell: (params) => {
                return (
                    <>
                        <Button 
                            onClick={() => openLoadEditModalClick(
                                params.row
                            )}
                            variant="contained"
                            size="small"
                            style={{
                                color: '#fff',
                                backgroundColor: '#dbab1a',
                                borderColor: '#dbab1a',
                                marginRight: '10px'
                            }}
                        >
                            Editar
                        </Button>
                        <Button 
                            onClick={() => openDeleteModalClick(
                                params.row
                            )}
                            variant="contained" 
                            size="small"
                            style={{
                                color: '#fff',
                                backgroundColor: '#dc3545',
                                borderColor: '#dc3545',
                                marginRight: '10px'
                            }}
                        >
                            Excluir
                        </Button>
                    </>
                )
            }
        },
    ];

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const openDeleteModalClick = (row) => {
        setDeleteModal(true);
        setID(row.id);
        setMarkedText(formatDateTime(row.marked));
    };

    const loadPatients = () => {
        api.get(`/patients`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `Bearer ${Session.get('access_token')}`
            }
        })
        .then((response) => {
            setRowsPatients(
                response.data ?? []
            )
        })
        .catch((err) => {
            if (!err.code) {
                Session.unset();
            }
        })
    }

    const closeDeleteModalClick = () => {
        setDeleteModal(false);
    };

    const changeDate = (date) => {
        setMarked(date)
    }

    const remove = () => {
        api.delete(`/schedules/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `Bearer ${Session.get('access_token')}`
            }
        })
        .then((response) => {
            loadList()
            closeDeleteModalClick()
        })
        .catch((err) => {
            if (!err.code) {
                Session.unset();
            }
        })
    }

    const clearAll = () => {
        setPatientId(null)
        setMarked(null)
    }

    const loadList = () => {
        api.get(`/schedules`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `Bearer ${Session.get('access_token')}`
            }
        })
        .then((response) => {
            setRows(
                response.data ?? []
            )
        })
        .catch((err) => {
            if (!err.code) {
                Session.unset();
            }
        })
    }

    const saveSchedule = () => {
        if(id) {
            api.put(`/schedules/${id}`, {
                patient_id: patientId,
                marked: marked,
            } , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `Bearer ${Session.get('access_token')}`
                }
            })
            .then((response) => {
                clearAll();
                loadList();
                closeModal();
            })
            .catch((err) => {
                if (!err.code) {
                    Session.unset();
                }
            })
        } else {
            console.log(patientId, marked);
            api.post(`/schedules`, {
                patient_id: patientId,
                marked: marked,
            } , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `Bearer ${Session.get('access_token')}`
                }
            })
            .then((response) => {
                clearAll();
                loadList();
                closeModal();
            })
            .catch((err) => {
                if (!err.code) {
                    Session.unset();
                }
            })
        }
    }

    useEffect(() => {
        loadPatients();
        loadList();
    }, []);

    return (
        <>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={openModal}
                    style={{
                        marginTop: '20px'
                    }}
                >
                    Novo Agendamento
                </Button>
            </div>
            <div style={{ marginTop: '20px', height: '500px', width: '100%' }}>
                <DataGrid rows={rows || []} columns={columns} pageSize={5} checkboxSelection={false} />
            </div>
            <div>
                <Dialog open={open} onClose={closeModal} aria-labelledby="form-dialog-title" maxWidth='xl' style={{
                    overflow: 'hidden'
                }}>
                    <DialogTitle id="form-dialog-title">Agendamento</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" style={{ width: '100%' }}>
                                    <InputLabel id="gender">Paciente</InputLabel>
                                    <Select
                                        labelId="patientId"
                                        id="patientId"
                                        value={patientId}
                                        onChange={(e) => setPatientId(e.target.value)}
                                        label="paciente"
                                    >
                                        <MenuItem value="">
                                            <em>Selecione</em>
                                        </MenuItem>
                                        {patients.map(
                                            patient => <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Grid item xs={12}>
                                        <DesktopDateTimePicker
                                            inputFormat="dd/MM/yyyy HH:mm:ss"
                                            label="Agendamento"
                                            value={marked}
                                            onChange={changeDate}
                                            renderInput={(params) => (
                                                <TextField
                                                    id="date-picker-desktop"
                                                    margin="normal"
                                                    {...params}
                                                    variant="standard"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                />
                                            )}
                                            OpenPickerButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} variant="contained" style={{
                            color: '#fff',
                            backgroundColor: '#dc3545',
                            borderColor: '#dc3545'
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={() => saveSchedule()} variant="contained" style={{
                            color: '#fff',
                            backgroundColor: '#28a745',
                            borderColor: '#28a745'
                        }}>
                            Salvar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDeleteModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Deseja deletar o agendamento das {markedText}?
                    </DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={remove} color="primary">
                        Sim
                    </Button>
                    <Button onClick={closeDeleteModalClick} color="primary" autoFocus>
                        Não
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}