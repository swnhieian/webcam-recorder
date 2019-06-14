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
  updatePage = (new_page) => {
    if (new_page === 0 ) {
      // do nothing
    } 
    this.setState({
      curr_page: (new_page >= 1) ? new_page : 1
    })
    console.log(this.state.curr_page);
  }
  render() {

    return (
      <div>
        <TableHeader />
        <TableData data={this.props.data} />
        <TableFooter updatePage={this.updatePage} curr_page={this.state.curr_page}/>
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired
}