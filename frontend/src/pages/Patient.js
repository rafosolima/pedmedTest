import React, { useState } from 'react';
import Menu from '../components/Menu';
import PatientContext from '../components/PatientContext';

export default function Patient(history) {
    return (
        <>
            <Menu component={() => <PatientContext/>}></Menu>
        </>
    );
}