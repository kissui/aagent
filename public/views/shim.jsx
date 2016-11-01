'use strict';

const React = require('react');

module.exports = React.createClass({

  render: function render() {

      return (
	  <div> {/*  Adjacent JSX elements must be wrapped in an enclosing tag */}
          <script src="/shimsbundle.js"></script>
	  </div>
      );
  }

});
