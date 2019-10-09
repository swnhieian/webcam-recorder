import React from 'react'
import PropTypes from 'prop-types';
import { Line, Circle } from 'rc-progress';

export default function ProgressBar(props) {
  const percent = ((props.curr ) / (props.total + 1) * 100).toFixed(2);
  const alignmentStyle = props.align === 'left' ? { margin: '0' } : {};
  return (
    <div className="progress_bar" style={alignmentStyle}>
      <pre style={{color: props.strokeColor}}>
        {props.title}: {props.curr} / {props.total + 1} ({percent}%)
      </pre>
      {props.shape === 'line' &&
      <Line
        className="line-progress"
        percent={percent}
        strokeWidth={props.strokeWidth}
        trailWidth={props.strokeWidth}
        strokeColor = {props.strokeColor}
        trailColor='#363732'
      />}
      {props.shape === 'circle' &&
      <Circle 
        className="circle-progress"
        percent={percent}
        strokeWidth={props.strokeWidth}
        trailWidth={props.strokeWidth}
        strokeColor = {props.strokeColor}
        trailColor='#363732'
      />}
    </div>
  );
}

ProgressBar.propTypes = {
  curr: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  align: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  shape: PropTypes.string.isRequired,
  strokeColor: PropTypes.string.isRequired,
};
