import React, { Component } from 'react';
import './TableRow.scss';
import Actions from './Actions';
import PropTypes from 'prop-types';

export default class TableRow extends Component {
  getClassOfRowItem = () => {
    let read = this.props.read ? 'read row_item' : 'row_item';
    let sentence = this.props.sentence;
    let is_current = sentence === this.props.curr_sentence ? ' curr_sentence' : '';
    return read + is_current;
  }

  render() {
    // console.log(String(this.props.curr_sentence) === String(this.props.sentence));
    // for some reason, sentence has extra character at the end;
    
    return (
      <div>
        <div className='table_row'>
          <div
            className={this.getClassOfRowItem()}
          >
            {this.props.sentence}
          </div>
          <div className='row_item'>00:00 / {this.props.time} </div>
          <Actions />
        </div>
      </div>
    );
  }
}

TableRow.propTypes = {
  sentence: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
  curr_sentence: PropTypes.string.isRequired
};
