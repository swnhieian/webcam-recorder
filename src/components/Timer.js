import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Timer(props) {
  const [intervalID, setIntervalID] = useState(undefined);

  function resetTimerClick() {
    console.log('reset clicked, ', intervalID);
    clearInterval(intervalID);
    setIntervalID(createInterval(new Date()));
  }

  function createInterval() {
    let time = [0, 0, 0];
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
    if (!intervalID) {
      setIntervalID(createInterval());
    }
  }, []);
  return (
    <div>
      <pre id={props.name}></pre>
      {/* <button onClick={resetTimerClick}>reset</button> */}
    </div>
  );
}

Timer.propTypes = {
  name: PropTypes.string.isRequired
};
