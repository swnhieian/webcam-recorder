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
      curr_page: 1,
      max_per_page: 8
    }
  }
  updatePage = (new_page) => {
    if (new_page === 0 ) {
      // do nothing
    } 
    this.setState({
      curr_page: (new_page >= 1) ? new_page : 1
    })
  }

  render() {

    return (
      <div>
        <TableHeader />
        <TableData
          data={this.props.data}
          curr_page={this.state.curr_page}
          max_per_page={this.state.max_per_page}
        />
        <TableFooter
          total_data={this.props.data.length}
          updatePage={this.updatePage}
          curr_page={this.state.curr_page}
          max_per_page={this.state.max_per_page}
        />
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired
}