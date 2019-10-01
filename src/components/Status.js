import React, { useEffect } from 'react';
import qs from '../utils/qs';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';

export default function Status(props) {
  useEffect(() => {
    showTime()
  }, [])

  const helper_showTime = () => {
    props.socket.emit('client: ask for start time');
  };
  const showTime = () => {
    try {
      document.getElementById('askForStartTimeBtn').click();
      document.getElementById('askForStartTimeBtn').disabled = true;
    } catch (NotYetLoadedException) {
      //
    }
  };
  return (
    <div>
      <h4>Connection Status</h4>
      <ProgressBar
        curr={props.recordedProgress}
        total={props.data_length - 1}
        align={'left'}
        strokeWidth={3}
      />
      <pre id='total_time_elapsed'>00:00:00</pre>
      <pre id='connection_status'></pre>
      <pre id='num_files_saved'></pre>
      <pre
        hidden={
          props.recordGreenLight ||
          props.helper_checkIfMobileView() ||
          !qs('name')
        }
        className='warning_message'
      >
        Please Click Reset!
      </pre>
      <button
        onClick={helper_showTime}
        id='askForStartTimeBtn'
        className='hidden_button'
      ></button>
    </div>
  );
}

Status.propTypes = {
  recordedProgress: PropTypes.number.isRequired,
  data_length: PropTypes.number.isRequired,
  recordGreenLight: PropTypes.bool.isRequired,
  helper_checkIfMobileView: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
};