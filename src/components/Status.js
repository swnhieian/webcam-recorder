import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Status(props) {
  const [remainingWords, setRemainingWords] = useState(Infinity)

  let intervalID = undefined

  useEffect(() => {
    // console.log('status page loaded');
    clearInterval(intervalID);
    props.socket.on('server: response for start time', startTime => {
      try {
        // alert('setting starttime');
        startTime = new Date(startTime);
        const startTimeTotalSecs = getSeconds(startTime);
        const nowSecs = getSeconds(new Date());
        let diffSecs = nowSecs - startTimeTotalSecs;
        // let expectedTime = diffSecs / (props.recordedProgress / props.data_length - 1)
        // console.log(diffSecs);
        const hours = Math.floor(diffSecs / 3600)
        diffSecs -= hours * 3600;
        const mins = Math.floor(diffSecs / 60);
        diffSecs -= mins * 60;
        const secs = diffSecs
        const totalRecordingTime = [hours, mins, secs];
        displayTime(totalRecordingTime);
        intervalID = setInterval(() => tick(totalRecordingTime), 1000);
      } catch (NotYetLoadedException) {
        console.error(NotYetLoadedException);
      }
    });
    showTime();
    setRemainingWords(0);
    console.log(remainingWords);
    // setRemainingWords(totalWords - wordsCompleted)
  }, [])

  const displayTime = time => {
    try {
      document.getElementById('total_time_elapsed').style.color = 'rgba(255,255,255,0.8';
      document.getElementById('total_time_elapsed').innerText =
        '总记录时间: ' +
        ('0' + time[0]).slice(-2) +
        ':' +
        ('0' + time[1]).slice(-2) +
        ':' +
        ('0' + time[2]).slice(-2);
    } 
    catch(NotYetLoadedException) {
      //
    }
  }

  let time = undefined
  const tick = initTime => {
    if (!time) {
      time = initTime;
    } 
    // console.log('ticking')
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
    // console.log(time);
    try {
      displayTime(time);
    } catch (SomeError) {
      console.error(SomeError);
    }
  };

  const getSeconds = date => 
    date.getHours() * 60 * 60 +
    date.getMinutes() * 60 +
    date.getSeconds();

  const helper_showTime = () => {
    // console.log('asking for start time now');
    props.socket.emit('client: ask for start time');
  };

  const showTime = () => {
    try {
      document.getElementById('showTimeBtn').click();
      document.getElementById('showTimeBtn').disabled = true;
    } catch (NotYetLoadedException) {
      //
    }
  };



  return (
    <div>
      <pre id='total_time_elapsed' style={{color: 'rgba(255,255,255,0.8'}}>总记录时间: 00:00:00</pre>
      <button
        onClick={helper_showTime}
        id='showTimeBtn'
        className='hidden_button'
      ></button>
    </div>
  );
}

Status.propTypes = {
  // recordedProgress: PropTypes.number.isRequired,
  // data_length: PropTypes.number.isRequired,
  // recordGreenLight: PropTypes.bool.isRequired,
  // helper_checkIfMobileView: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  // totalWords: PropTypes.number.isRequired

};