import React, { useEffect } from 'react'

export default function Timer(props) {
  
  useEffect(() => {
    const date = new Date();
    const min = date.getMinutes();
    const sec = date.getSeconds() % 60;
    setInterval(() => {
      const curr = new Date();
      const curr_min = curr.getMinutes();
      const curr_sec = curr.getSeconds() % 60;

      const diffMin = ('0' + (curr_min - min)).slice(-2);
      const diffSec = ('0' + (curr_sec - sec)).slice(-2);
      document.getElementById('record_time_content').innerHTML =  diffMin + ":" + diffSec
    }, 1000);
  }, [])
  return (
    <div>
      <pre id='record_time_content'></pre>
    </div>
  );
}
