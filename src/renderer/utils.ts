// eslint-disable-next-line import/prefer-default-export
export const getDeviceId = () => {
  const deviceId = window.localStorage.getItem('DEVICE_ID');
  if (deviceId) {
    return deviceId;
  }

  const newDeviceId = (Math.random() + 1).toString(36);

  window.localStorage.setItem('DEVICE_ID', newDeviceId);

  return newDeviceId;
};
