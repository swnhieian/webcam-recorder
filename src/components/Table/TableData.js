import React, { Component } from 'react'
import TableRow from './TableRow.js';
import PropTypes from 'prop-types';
import './TableData.scss';

export default class TableData extends Component {
  render() {
    let rows = [];
    let data = this.props.data;
    for (let i = 0; i < 40; i++) {
      rows.push(<TableRow sentence={data[i]} time="00:00" read={ false }/>)
    }

    return <div className="table">{rows}</div>;
  }
}


TableData.propTypes = {
  data: PropTypes.array.isRequired
};