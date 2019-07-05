import React, { Component } from 'react'
import TableHeader from './TableHeader.js'
import './Table.scss'
import TableData from './TableData.js'
import PropTypes from 'prop-types';
import TableFooter from './TableFooter';
import qs from '../../utils/qs'
export default class Table extends Component {
  constructor(props) {
    super(props);
    let per_page = 8;
    this.state = {
      // curr_page: Math.floor(this.props.curr_sentence_index / per_page) + 1,
      max_per_page: per_page
    }
  }

  render() {
    return (
      <div>
        <TableHeader />
        <TableData
          data={this.props.data}
          curr_page={this.props.curr_page}
          max_per_page={this.state.max_per_page}
          curr_sentence_index={this.props.curr_sentence_index}
        />
        <TableFooter
          total_data={this.props.data.length}
          updatePage={this.props.updatePage}
          curr_page={this.props.curr_page}
          max_per_page={this.state.max_per_page}
        />
      </div>
    );
  }
}

Table.propTypes = {
  curr_sentence_index: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
};