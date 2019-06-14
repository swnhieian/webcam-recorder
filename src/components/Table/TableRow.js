import React, { Component } from 'react'
import './TableRow.scss'
import Actions from './Actions'
import PropTypes from 'prop-types';

export default class TableRow extends Component {
  
  render() {
    return (
      <div>
        <div className='table_row'>
          <div className={ (this.props.read) ? "read row_item" : "row_item" }>{ this.props.sentence}</div>
          <div className='row_item'>00:00 / { this.props.time } </div>
          <Actions />
        </div>
      </div>
    );
  }
}

TableRow.propTypes =  {
  sentence: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  read: PropTypes.bool.isRequired
}