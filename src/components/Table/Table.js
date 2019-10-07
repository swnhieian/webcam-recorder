import React, { Component } from 'react'
import TableHeader from './TableHeader.js'
import './Table.scss'
import TableData from './TableData.js'
import PropTypes from 'prop-types';
import TableFooter from './TableFooter';
export default class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TableHeader />
        <TableData
          data={this.props.data}
          curr_page={this.props.curr_page}
          max_per_page={this.props.sentencesPerPageInTable}
          curr_sentence_index={this.props.curr_sentence_index}
        />
        <TableFooter
          total_data={this.props.data.length}
          updatePage={this.props.updatePage}
          curr_page={this.props.curr_page}
          max_per_page={this.props.sentencesPerPageInTable}
        />
      </div>
    );
  }
}

Table.propTypes = {
  curr_sentence_index: PropTypes.number.isRequired,
  curr_page: PropTypes.number.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  sentencesPerPageInTable: PropTypes.number.isRequired,
};