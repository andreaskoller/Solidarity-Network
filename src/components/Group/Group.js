import React from 'react';

import Reflux from 'reflux';
import StatusActions from '../../stores/StatusActions';
import StatusStore from '../../stores/StatusStore';
import Helpers from '../../stores/Helpers.js';

export default React.createClass({

  componentDidMount() {
    StatusActions.setPage('group');
    StatusActions.forceTrigger();
  },

  render() {

    var data = this.props.data;

    var group = Helpers.getGroupById(this.props.params.id, data);

    return (
        <div className="jumbotron">
          <div className="container text-center">
            <h1>Group {group.name}</h1>
          </div>
        </div>
    );
  }
});
