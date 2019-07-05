import React, { Component } from 'react';
import NameField from '../NameField/NameField';
import Table from './Table';
import PropTypes from 'prop-types';

export default class DataCollection extends Component {
  

  render() {
    return (
      <div>
        <div className='name_field'>
          <NameField socket={this.props.socket} />
        </div>
        <div className='data_table'>
          <Table
            data={this.props.data}
            curr_sentence_index={
              this.props.curr_sentence_index
            }
            curr_page={this.props.curr_page}
            updatePage={this.props.updatePage}
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
  curr_page: PropTypes.number.isRequired,

};
