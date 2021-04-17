import React from 'react';
import { Text, View, Button } from 'react-native';
import PropTypes from 'prop-types';

export default class Footer extends React.Component {
  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return(
        <Text>
          {name}
        </Text>
      );
    }
    return(
      <Button style={{color: 'blue'}} onPress={() => {this.props.onFilterChange(filter)}} title={name} />
    )
  }

  render() {
    return(
      <View>
        {this.renderFilter('SHOW_ALL', 'All')}
        {this.renderFilter('SHOW_COMPLETED', 'Completed')}
        {this.renderFilter('SHOW_ACTIVE', 'Active')}
      </View>
    );
  }
}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
}
