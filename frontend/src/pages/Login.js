import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField"
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Button, CircularProgress, Grid } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import api from "../services/Api";
import * as Session from '../session'

export default function Login({ history }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [erros, setErros] = useState([]);

  async function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleLogin() {
    setIsLoading(true);
    setErros([]);
    
    api.post('/auth/login', {
      email: login,
      password: password
    }).then((response) => {
          Session.store(response.data);
          history.push('/dashboard');
          setIsLoading(false)
    }).catch((err) => {
        setErros(
          Object.values(err.response.data.message)
        );
        setIsLoading(false)
    })
  }

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        {
        erros.map(
          (messages, i) => messages.map(
            (message, j) => 
              <Alert 
                key={j}
                severity="error" 
                onClose={
                  () => { 
                    let newErros = [...erros];
                    delete newErros[i][j];
                    setErros(newErros)
                  }
                }
                style={{
                  width: '25%',
                  marginTop: '15px'
                }}
              >{message}</Alert>
          )
        )}
        <img 
          src="https://media-exp1.licdn.com/dms/image/C4E0BAQHXDZ6gKdDIdg/company-logo_200_200/0/1604414904793?e=1625702400&amp;v=beta&amp;t=knwTMjpjzvokGSJUiI8ieeN5lk4ih4SHMlu3EJ_DeeU"
        />
        <Grid item xs={3}>
          <TextField
            label="Login"
            type="text"
            variant="outlined"
            color="primary"
            value={login}
            onChange={event => setLogin(event.target.value)}
            onKeyPress={e => e.key === 'Enter' ? handleLogin() : null}
            fullWidth
          />
          <FormControl
            variant="outlined"
            style={{
              width: '100%',
              marginTop: '20px'
            }}
          >
            <InputLabel htmlFor="password">Senha</InputLabel>
            <OutlinedInput
              fullWidth
              id="password"
              type={showPassword === true ? "text" : "password"}
              value={password}
              onChange={event => setPassword(event.target.value)}
              onKeyPress={e => e.key === 'Enter' ? handleLogin() : null}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword === true ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
            <Button
              onClick={handleLogin}
              variant="contained"
              color="primary"
              style={{
                marginTop: '20px',
                height: '52px'
              }}
            >
              {isLoading === true ? (
                <CircularProgress />
              ) : (
                "Começar"
              )}
            </Button>
          </FormControl>
        </Grid>

      </Grid>

    </>
  );
}