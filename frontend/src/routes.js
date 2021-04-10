import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from './providers/PrivateRouter'
import GuestRoute from './providers/GuestRouter'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import Schedules from "./pages/Schedules";

export default function routes() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <PrivateRoute path="/" exact component={Dashboard}/>
          <PrivateRoute path="/dashboard" component={Dashboard}/>
          <PrivateRoute path="/paciente" component={Patient}/>
          <PrivateRoute path="/agendamento" component={Schedules}/>
          <GuestRoute path="/login" component={Login}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}