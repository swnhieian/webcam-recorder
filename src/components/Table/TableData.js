import React, { Component } from 'react';
import TableRow from './TableRow.js';
import PropTypes from 'prop-types';
import './TableData.scss';

export default class TableData extends Component {
  updateDataOnPageChange = () => {};
  render() {
    let data = this.props.data;
    let page = this.props.curr_page;
    let max_per_page = this.props.max_per_page;
    let beg = page * max_per_page - max_per_page;
    let end = beg + max_per_page;
    let small_data = data.slice(beg, end);
    let rowItems = small_data.map((sentence, i) => (
      <TableRow
        curr_sentence_index={this.props.curr_sentence_index}
        sentence={sentence}
        time='00:00'
        read={false}
        key={sentence}
        index={i + beg}
      />
    ));

    return <div className='table'>{rowItems}</div>;
  }
}

TableData.propTypes = {
  data: PropTypes.array.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  curr_page: PropTypes.number.isRequired,
  max_per_page: PropTypes.number.isRequired,
};
