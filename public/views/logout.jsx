'use strict';

import React from 'react';
import Auth from '../lib/auth';

module.exports = React.createClass({

  componentDidMount() {
    Auth.logout()
  },

  render() {
    return <p>You are now logged out</p>
  }

});
