import React, { Component } from 'react'
import TableHeader from './TableHeader.js'
import './Table.scss'
import TableData from './TableData.js'
import PropTypes from 'prop-types';

export default class Table extends Component {
  render() {

    return (
      <div>
        <TableHeader />
        <div className="table">
          <TableData data={this.props.data} />
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired
}