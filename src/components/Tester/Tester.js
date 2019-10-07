import React, { useState } from 'react';
import './Tester.scss';
import PropTypes from 'prop-types';
import InProcessScreen from './InProcessScreen.js';
import qs from '../../utils/qs'
import ProgressBar from '../ProgressBar'

function Tester(props) {
  const [intervalID, setIntervalID] = useState(undefined);

  function comp_inProcessScreen() {
    return (
      <InProcessScreen
        updateSentence={props.updateSentence}
        curr_sentence_index={props.curr_sentence_index}
        data_length={props.data_length}
        socket={props.socket}
        data={props.data}
        curr_sentence={props.curr_sentence}
        recordGreenLight={props.recordGreenLight}
        updateGreenLightStatus={props.updateGreenLightStatus}
        numFilesSaved={props.numFilesSaved}
        requiredNumCams={props.requiredNumCams}
        stopTimer={stopTimer}
        startTimer={startTimer}
        recordedProgress={props.recordedProgress}
        updateRecordProgress={props.updateRecordProgress}
        showFileSavingLoader={props.showFileSavingLoader}
        debugMode={props.debugMode}
        connectedToServer={props.connectedToServer}
        detectedNumCams={props.detectedNumCams}
      />
    );
  }

  function stopTimer() {
    clearInterval(intervalID);
    document.getElementById('record_time_content').innerHTML = '00:00:00';
  }

  function startTimer() {
    setIntervalID(createInterval());
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
      document.getElementById('record_time_content').innerHTML =
        ('0' + hour).slice(-2) +
        ':' +
        ('0' + min).slice(-2) +
        ':' +
        ('0' + sec).slice(-2);
      }, 10);
  }

  return (
    <div className='testing_screen'>
      {qs('name') && <ProgressBar
        curr={props.recordedProgress}
        total={props.data_length - 1}
        align={'center'}
        strokeWidth={2}
      />}
      <div className='middle'>
        <div className='inner'>{comp_inProcessScreen()}</div>
      </div>
      <pre
        hidden={
          props.recordGreenLight ||
          props.curr_sentence_index === 0 ||
          !qs('name')
        }
        className='warning_message'
      >
        如果等保存时间多余10秒钟，通知老师来从设置机器
      </pre>
    </div>
  );
}

Tester.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  curr_sentence: PropTypes.string.isRequired,
  data_length: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  recordGreenLight: PropTypes.bool.isRequired,
  updateGreenLightStatus: PropTypes.func.isRequired,
  numFilesSaved: PropTypes.number.isRequired,
  requiredNumCams: PropTypes.number.isRequired,
  recordedProgress: PropTypes.number.isRequired,
  updateRecordProgress: PropTypes.func.isRequired,
  totalTime: PropTypes.array.isRequired,
  updateTotalTime: PropTypes.func.isRequired,
  showFileSavingLoader: PropTypes.func.isRequired,
  debugMode: PropTypes.bool.isRequired,
  connectedToServer: PropTypes.bool.isRequired,
  detectedNumCams: PropTypes.number.isRequired,
}

export default Tester;
