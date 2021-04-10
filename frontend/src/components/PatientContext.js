import React, { useEffect, useState } from "react";
import { DataGrid, GridRow } from '@material-ui/data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from "@material-ui/core";
import api from '../services/Api';
import * as Session from '../session';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';

export default function PatientContext({ history }) {
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setDeleteModal] = useState(false);
    const [id, setID] = useState();
    const [scheduleId, setScheduleId] = useState();
    const [anotacaoText, setAnotacaoText] = useState();
    const [anotacaoTextDefaults, setAnotacaoTextDefaults] = useState([{
        id: null,
        anotation: null
    }]);
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [birthdate, setBirthdate] = useState();
    const [gender, setGender] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [toggleAnotation, setToggleAnotation] = useState(false);
    const [rows, setRows] = useState([]);
    const [anotacoes, setAnotacoes] = useState([]);
    

    const genderSelectedVals = {
        'M': 'Masculino',
        'F': 'Feminino',
        'O': 'Outros'
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nome', width: 400 },
        { 
            field: 'birthdateText',
            headerName: 'Nascimento',
            width: 150,
            valueGetter: (params) => {
                let dt = params.getValue('birthdate').split('T')[0];
                dt = dt.split('-');
                return `${dt[2]}/${dt[1]}/${dt[0]}`
            },
        },
        {
            field: 'genderText',
            headerName: 'Sexo',
            width: 100,
            valueGetter: (params) => {
                return `${genderSelectedVals[params.getValue('gender')] || ''}`
            },
        },
        {
            field: 'phone',
            headerName: 'Contato',
            width: 160,
        },
        {
            field: 'actionsButtons',
            headerName: 'Ações',
            width: 400,
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
            },
        }
    ];

    useEffect(() => {
        loadList()
    }, []);

    const formatDateTime = (date) => {
        if (!date) return '';
        let dateTime = date.split('T');
        let dt = dateTime[0].split('-');
        let time = dateTime[1].split('.')[0];
        return `${dt[2]}/${dt[1]}/${dt[0]} ${time}`
    }

    const anotacoesTitules = [
        { 
            field: 'markedText',
            headerName: 'Data agendamento',
            width: '250px',
            valueGetter: (params) => {
                return formatDateTime(params.getValue('marked'))
            }
        },
        { field: 'anotations', headerName: 'Anotação', width: '1600px' },
    ]

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const openDeleteModalClick = (row) => {
        setDeleteModal(true);
        setID(row.id);
        setName(row.name);
    };

    const openLoadEditModalClick = (row) => {
        setID(row.id);
        setName(row.name);
        setPhone(row.phone);
        setEmail(row.email);
        setBirthdate(row.birthdate.split('T')[0]);
        setGender(row.gender);
        setHeight(row.height);
        setWeight(row.weight);
        loadAnotations(row.id);
        openModal();
    }

    const changeDate = (date) => {
        setBirthdate(date)
    }

    const closeDeleteModalClick = () => {
        setDeleteModal(false);
    };

    const handleTooggleAnotation = () => {
        setToggleAnotation(!toggleAnotation);
    }

    const handleChange = (event) => {
        setGender(event.target.value);
    };

    const loadList = () => {
        api.get('/patients', {
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

    const loadAnotations = (idCurrent) => {
        api.get(`/patients/${idCurrent}/schedules`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `Bearer ${Session.get('access_token')}`
            }
        })
        .then((response) => {
            setAnotacoes(
                response.data ?? []
            )
        })
        .catch((err) => {
            if (!err.code) {
                Session.unset();
            }
        })
    }

    const clearAll = () => {
        setID(null);
        setName(null);
        setPhone(null);
        setEmail(null);
        setBirthdate(null);
        setGender(null);
        setHeight(null);
        setWeight(null);
    }

    const salvarData = () => {
        if (id) {
            api.put(`/patients/${id}`, {
                name,
                phone,
                email,
                birthdate,
                gender,
                height,
                weight
            } , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `Bearer ${Session.get('access_token')}`
                }
            })
            .then((response) => {
                console.log(
                    response.data
                )
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
            api.post(`/patients`, {
                name,
                phone,
                email,
                birthdate,
                gender,
                height,
                weight
            } , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `Bearer ${Session.get('access_token')}`
                }
            })
            .then((response) => {
                console.log(
                    response.data
                )
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

    const saveAnotation = () => {
        if(!scheduleId) return;

        api.put(`/schedules/${scheduleId}`, {
            patient_id: id,
            anotations: anotacaoText
        } , {
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `Bearer ${Session.get('access_token')}`
            }
        })
        .then((response) => {
            console.log(
                response.data
            )
            clearAll();
            closeModal();
        })
        .catch((err) => {
            if (!err.code) {
                Session.unset();
            }
        })
    }

    const remove = () => {
        api.delete(`/patients/${id}`, {
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
                    Novo Paciente
                </Button>
            </div>
            <div style={{ marginTop: '20px', height: '500px', width: '100%' }}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                />
            </div>
            <div>
                <Dialog open={open} onClose={closeModal} aria-labelledby="form-dialog-title" maxWidth='xl' style={{
                    overflow: 'hidden'
                }}>
                    <DialogTitle id="form-dialog-title">Paciente</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={7}>
                                <TextField
                                    label="Nome"
                                    type="text"
                                    variant="outlined"
                                    color="primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="Telefone"
                                    type="text"
                                    variant="outlined"
                                    color="primary"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    label="E-mail"
                                    type="text"
                                    variant="outlined"
                                    color="primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={5}>
                                    <DesktopDatePicker
                                        inputFormat="dd/MM/yyyy"
                                        label="Data Nascimento"
                                        value={birthdate}
                                        onChange={changeDate}
                                        renderInput={(params) => (
                                            <TextField
                                                id="date-picker-desktop"
                                                margin="normal"
                                                {...params}
                                                variant="standard"
                                            />
                                        )}
                                        OpenPickerButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </LocalizationProvider>
                            <Grid item xs={4}>
                                <FormControl variant="outlined" style={{ width: '100%' }}>
                                    <InputLabel id="gender">Sexo</InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender"
                                        value={gender}
                                        onChange={handleChange}
                                        label="Sexo"
                                    >
                                        <MenuItem value="">
                                            <em>Selecione</em>
                                        </MenuItem>
                                        <MenuItem value={'M'}>Masculino</MenuItem>
                                        <MenuItem value={'F'}>Feminino</MenuItem>
                                        <MenuItem value={'O'}>Outros</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Altura"
                                    type="text"
                                    variant="outlined"
                                    color="primary"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Peso"
                                    type="text"
                                    variant="outlined"
                                    color="primary"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Divider style={{ marginTop: '15px' }}/>
                        <Button 
                            variant="contained" 
                            onClick={handleTooggleAnotation}
                            style={{
                                marginTop: '20px',
                                color: '#212529',
                                backgroundColor: '#ffc107',
                                borderColor: '#ffc107'
                            }}
                        >
                            Adicionar Anotação
                        </Button>
                        <div style={{ 
                            display: toggleAnotation ? 'block' : 'none',
                            marginTop: '15px'
                        }}>
                            <FormControl variant="outlined" style={{ width: '25%' }}>
                                <InputLabel id="agendamento">Agendamentos</InputLabel>
                                <Select
                                    labelId="agendamento"
                                    id="agendamento"
                                    value={scheduleId}
                                    onChange={(e) => setScheduleId(e.target.value)}
                                    label="Agendamento"
                                >
                                    <MenuItem value="">
                                        <em>Selecione</em>
                                    </MenuItem>
                                    {anotacoes.map((data) => {
                                        return (
                                            <MenuItem key={data.id} value={data.id}>{formatDateTime(data.marked)}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <TextareaAutosize 
                                aria-label="Anotações"
                                rowsMin={10}
                                placeholder="Anotações do paciente"
                                value={anotacaoText}
                                defaultValue={anotacaoTextDefaults[scheduleId]?.anotation}
                                onChange={(e) => setAnotacaoText(e.target.value)}
                                style={{
                                    marginTop: '15px',
                                    width: '100%',
                                    height: '150px'
                                }}/>
                            <DialogActions>
                                <Button onClick={() => saveAnotation()} variant="contained" style={{
                                    color: '#fff',
                                    backgroundColor: '#28a745',
                                    borderColor: '#28a745'
                                }}>
                                    Adicionar
                                </Button>
                            </DialogActions>
                        </div>
                        <div style={{ marginTop: '20px', height: '400px', width: '100%' }}>
                            <DataGrid 
                                rows={anotacoes} 
                                columns={anotacoesTitules}
                                pageSize={5} 
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} variant="contained" style={{
                            color: '#fff',
                            backgroundColor: '#dc3545',
                            borderColor: '#dc3545'
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={() => salvarData()} variant="contained" style={{
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
                        Deseja deletar o paciente {id} - {name}?
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