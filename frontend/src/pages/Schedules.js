import React, { useState } from 'react';
import Menu from '../components/Menu';
import SchedulesContext from '../components/SchedulesContext';

export default function Patient(history) {
    return (
        <>
            <Menu component={() => <SchedulesContext/>}></Menu>
        </>
    );
}