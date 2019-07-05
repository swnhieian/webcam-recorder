import React, { Component } from 'react';
import './TableRow.scss';
import Actions from './Actions';
import PropTypes from 'prop-types';

export default class TableRow extends Component {
  getClassOfRowItem = () => {
    let read = this.props.read ? 'read row_item' : 'row_item';
    // let sentence = this.props.sentence;
    let is_current = this.props.curr_sentence_index === this.props.index ? ' curr_sentence' : '';
    return read + is_current;
  }


  render() {
    return (
      <div>
        <div className='table_row'>
          <div className={this.getClassOfRowItem()}>
            {this.props.sentence}
          </div>
          {/* <div className='row_item'>00:00 / {this.props.time} </div> */}
          {/* <Actions /> */}
        </div>
      </div>
    );
  }
}

TableRow.propTypes = {
  sentence: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
};
