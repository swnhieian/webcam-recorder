import React, { Component } from 'react'
import Table_Header from './TableHeader.js'
import './Table.scss'
import Table_Data from './TableData.js'
import PropTypes from 'prop-types';

export default class Table extends Component {
  render() {

    return (
      <div>
        <Table_Header />
        <Table_Data data={ this.props.data }/>
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired
}