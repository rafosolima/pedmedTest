import axios from 'axios';
import * as Session from '../session'

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept' : 'application/json',
    'Authorization': `Bearer ${Session.get('access_token')}`
  },
});

export default api;