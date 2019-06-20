import React, { Component } from 'react';
import NameField from '../NameField/NameField';
import Table from './Table';
import PropTypes from 'prop-types';

export default class DataCollection extends Component {
  render() {
    return (
      <div>
        <div className='name_field'>
          <NameField />
        </div>
        <div className='data_table'>
          <Table data={this.props.data} curr_sentence={this.props.curr_sentence}/>
        </div>
      </div>
    );
  }
}

DataCollection.propTypes = {
  data: PropTypes.array.isRequired,
  curr_sentence: PropTypes.string.isRequired
};
