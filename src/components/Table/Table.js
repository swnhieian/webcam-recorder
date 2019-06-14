import React, { Component } from 'react'
import TableHeader from './TableHeader.js'
import './Table.scss'
import TableData from './TableData.js'
import PropTypes from 'prop-types';
import TableFooter from './TableFooter';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curr_page: 1
    }
  }
  updatePage = () => {
    this.setState({ curr_page: 3});
  }
  render() {

    return (
      <div>
        <TableHeader />
        <TableData data={this.props.data} />
        <TableFooter updatePage={this.updatePage} someData={3}/>
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired
}