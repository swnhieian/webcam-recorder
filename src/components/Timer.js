import React, { useEffect, useState} from 'react'
import PropTypes from 'prop-types';

export default function Timer(props) {
  const [intervalID, setIntervalID] = useState(undefined);

  function resetTimerClick() {
    console.log('reset clicked, ', intervalID)
    clearInterval(intervalID);
    setIntervalID(createInterval(new Date()));
  }

  function createInterval(startTime) {
    return setInterval(() => {
      const start_min = startTime.getMinutes();
      const start_sec = startTime.getSeconds() % 60;

      const curr = new Date();
      const curr_min = curr.getMinutes();
      const curr_sec = curr.getSeconds() % 60;

      const diffMin = ('0' + (curr_min - start_min)).slice(-2);
      const diffSec = ('0' + (curr_sec - start_sec)).slice(-2);
      document.getElementById(props.name).innerHTML =  "Total Recording Time—" + diffMin + ":" + diffSec
    }, 100);
  }
  useEffect(() => {    
    setIntervalID(createInterval(new Date()));
  }, [])
  return (
    <div>
      <pre id={props.name}></pre>
      {/* <button onClick={resetTimerClick}>reset</button> */}
    </div>
  );
}

Timer.propTypes = {
  name: PropTypes.string.isRequired,
}