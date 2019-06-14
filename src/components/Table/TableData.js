import React, { Component } from 'react'
import TableRow from './TableRow.js';
import PropTypes from 'prop-types';
import './TableData.scss';

export default class TableData extends Component {
  render() {
    // let rows = [];
    let data = this.props.data;

    let rowItems = data.map((sentence) => 
      <TableRow sentence={sentence} time="00:00" read={ false } key = {sentence}/>
    );

    return <div className='table'>{rowItems}</div>;
  }
}


TableData.propTypes = {
  data: PropTypes.array.isRequired
};