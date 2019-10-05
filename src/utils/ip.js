const os = require('os');
const ifaces = os.networkInterfaces();

const getIP = () => {
  console.log('getting ip...')
  let address = undefined;
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (ifname === 'en0') {
        address = iface.address;
      }
    });
  });
  return address;
}

module.exports = { getIP }