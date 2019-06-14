import React, { Component } from 'react'
import TableRow from './TableRow.js';
import PropTypes from 'prop-types';
import './TableData.scss';

export default class TableData extends Component {
  updateDataOnPageChange = () => {

  }
  render() {
    let data = this.props.data;
    let page = 1;
    let max_per_page = 8;
    let small_data = data.slice(page - 1, max_per_page);

    let rowItems = small_data.map((sentence) => 
      <TableRow sentence={sentence} time="00:00" read={ false } key = {sentence}/>
    );

    return <div className='table'>{rowItems}</div>;
  }
}


TableData.propTypes = {
  data: PropTypes.array.isRequired
};