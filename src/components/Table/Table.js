import React, { Component } from 'react'
import TableHeader from './TableHeader.js'
import './Table.scss'
import TableData from './TableData.js'
import PropTypes from 'prop-types';
import TableFooter from './TableFooter';

export default class Table extends Component {
  render() {

    return (
      <div>
        <TableHeader />
          <TableData data={this.props.data} />
        <TableFooter />
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired
}