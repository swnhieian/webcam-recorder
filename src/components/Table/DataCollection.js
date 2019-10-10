import React, { Component } from 'react';
import Table from './Table';
import PropTypes from 'prop-types';

export default class DataCollection extends Component {


  render() {
    return (
      <div>
        <div className='data_table'>
          <Table
            data={this.props.data}
            curr_sentence_index={
              this.props.curr_sentence_index
            }
            curr_page={this.props.curr_page}
            updatePage={this.props.updatePage}
            sentencesPerPageInTable={this.props.sentencesPerPageInTable}
          />
        </div>
      </div>
    );
  }
}

DataCollection.propTypes = {
  data: PropTypes.array.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  updatePage: PropTypes.func.isRequired,
  curr_page: PropTypes.number.isRequired,
  sentencesPerPageInTable: PropTypes.number.isRequired,
};
