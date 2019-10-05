import React from 'react'
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';

export default function ProgressBar(props) {
  const percent = ((props.curr ) / (props.total + 1) * 100).toFixed(2);
  const alignmentStyle = props.align === 'left' ? { margin: '0' } : {};
  return (
    <div className='progress_bar' style={alignmentStyle}>
      <pre>
        进度: {props.curr} / {props.total + 1} ({percent}%)
      </pre>
      <Line
        percent={percent}
        strokeWidth={props.strokeWidth}
        trailWidth={props.strokeWidth}
        strokeColor = '#3bb8ce'
        trailColor='#363732'
      />
    </div>
  );
}

ProgressBar.propTypes = {
  curr: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  align: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};
