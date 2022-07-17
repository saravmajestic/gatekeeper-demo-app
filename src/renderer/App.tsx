// import { dialog, shell } from 'electron';
import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { API_URL, AUTH_URL, PRODUCT_ID } from './constants';
import { JobStatus } from './types';
import { getDeviceId } from './utils';

const INTERVAL = 5000;
const Hello = () => {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const deviceId = getDeviceId();

  const getJobStatus = () => {
    return fetch(
      `${API_URL}authenticate/status?deviceId=${deviceId}&productId=${PRODUCT_ID}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setStatus(response.status);

        if (
          response.status !== JobStatus.APPROVED ||
          response.status !== JobStatus.DECLINED
        ) {
          setTimeout(() => {
            getJobStatus();
          }, INTERVAL);
        }
        if (response.status === JobStatus.APPROVED) {
          // dialog.showOpenDialog({ title: 'Hooray!!! success' });
          return;
        }
        // eslint-disable-next-line promise/always-return
        if (response.status === JobStatus.DECLINED) {
          // dialog.showOpenDialog({ title: 'Oops!!! declined' });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const startLicenseConnect = async () => {
    setStatus(JobStatus.STARTED);
    const url = `${AUTH_URL}deviceId=${deviceId}&productId=${PRODUCT_ID}`;
    window.open(url, '_blank');
    setTimeout(() => {
      getJobStatus();
    }, INTERVAL);
  };

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>Gatekeeper Demo App</h1>
      <div className="Hello">
        <div>
          <div>Current status: </div>
          <div>{status} </div>
        </div>
        <button onClick={startLicenseConnect} type="button">
          Connect License
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
