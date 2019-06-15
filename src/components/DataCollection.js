import React, { Component } from 'react'
import NameField from '../Components/NameField/NameField';
import Table from '../Components/Table/Table';
import PropTypes from 'prop-types';

export default class DataCollection extends Component {
  render() {
    return (
      <div>
        <div className='name_field'>
          <NameField updateName={this.props.updateName}/>
        </div>
        <div className='data_table'>
          <Table data={this.props.data} />
        </div>
      </div>
    );
  }
}

DataCollection.propTypes = {
  data: PropTypes.array.isRequired,
  updateName: PropTypes.func.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired
};