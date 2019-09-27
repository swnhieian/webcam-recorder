/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Timer(props) {
  const [intervalID, setIntervalID] = useState(undefined);
  let totalTime = [];

  function saveTotalTime (event) {
    // Cancel the event as stated by the standard.
    event.preventDefault();

    // console.log(totalTime);
    totalTime = totalTime.map(time => {
      return time ? time : 0;
    });

    props.socket.emit(
      'client: save total time',
      totalTime
    );
    console.log(totalTime);
    // Chrome requires returnValue to be set.
    event.returnValue = '';
  }

  function stopTimer() {
    clearInterval(intervalID);
    document.getElementById(props.name).innerHTML = '';
  }

  function createInterval(timeSaved) {
    let time = (timeSaved) ? timeSaved : [0, 0, 0];
    console.log(timeSaved);
    return setInterval(() => {
      let hour = time[0];
      let min = time[1];
      let sec = time[2];

      if (sec < 60) {
        sec += 1;
      }
      if (sec === 60) {
        min += 1;
        sec = 0;
      }
      if (min === 60) {
        hour += 1;
        min = 0;
      }
      time = [hour, min, sec];
      totalTime = time;
      try {
        document.getElementById(props.name).innerHTML =
          'Total Recording Time—' +
          ('0' + hour).slice(-2) +
          ':' +
          ('0' + min).slice(-2) +
          ':' +
          ('0' + sec).slice(-2);

      } catch (SomeError) {
        console.error(SomeError);
      }
    }, 1000);
  }

  useEffect(() => {
    window.addEventListener('beforeunload', saveTotalTime);
    
    props.socket.emit('client: get total time');
    props.socket.on('server: response for total time', timeSaved => {
      if (!timeSaved && !intervalID) {
        setIntervalID(createInterval());
      }
      console.log(timeSaved);
      stopTimer();
      setIntervalID(createInterval(timeSaved));
    });
    
  }, []);
  return (
    <div>
      <pre id={props.name}></pre>
      {/* <button onClick={resetTimerClick}>reset</button> */}
    </div>
  );
}

Timer.propTypes = {
  name: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};
