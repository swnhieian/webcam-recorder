import React, { Component } from 'react'
import TableRow from './TableRow.js';
import PropTypes from 'prop-types';

export default class TableData extends Component {
  render() {
    let rows = [];
    let data = this.props.data;
    for (let i = 0; i < 40; i++) {
      // console.log('hello');
      rows.push(<TableRow sentence={data[i]} time="32:49"/>)
    }
    console.log(rows);

    return <div>{rows}</div>;
  }
}


TableData.propTypes = {
  data: PropTypes.array.isRequired
};