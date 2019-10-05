const os = require('os');
const ifaces = os.networkInterfaces();

const nodeGetIP = () => {
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
  console.log(address);
  return address;
}

const clientGetIP = onNewIP => { //  onNewIp - your listener function for new IPs
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
  var pc = new myPeerConnection({
      iceServers: []
    }),
    noop = function () {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

  function ipIterate(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  pc.createDataChannel(""); //create a bogus data channel
  pc.createOffer(function (sdp) {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(ipIterate);
    });
    pc.setLocalDescription(sdp, noop, noop);
  }, noop); // create offer and set local description
  pc.onicecandidate = function (ice) { //listen for candidate events
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
  };
}

module.exports = {
  nodeGetIP,
  clientGetIP
}