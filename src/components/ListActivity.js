import React from 'react';
import classNames from 'classnames';

import Reflux from 'reflux';
import DataActions from '../stores/DataActions';
import DataStore from '../stores/DataStore';

import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';

export default React.createClass({

  mixins: [Reflux.connect(DataStore, 'data')],

  componentDidMount() {
    DataActions.forceTrigger();
  },

  render() {

    var divClass = classNames( 'col-md-4', 'box', 'white', 'linked', 'padded', 'text-center',
      {
        'selected': false
      }
    ); // selected may be needed later

    if (this.state.data && this.state.data.loaded.groups) {
      var groupName = this.state.data.groups[this.props.data.group].name;
      var ownerId = this.state.data.groups[this.props.data.group].owner;
      if (this.state.data.loaded.people) {
        var ownerName = this.state.data.people[ownerId].name;
      }
    }

    return (

        <div className={divClass} onClick={this.props.onClickHandler.bind(null, this.props.data.id)}>

          <h2>{this.props.data.name}</h2>

          <p><FormattedMessage id="on" defaultMessage=" "/>
              &nbsp;<FormattedDate
                    value={this.props.data.date}
                    weekday="long"
                    day="numeric"
                    month="long"
                    year="numeric" /> 
              &nbsp;<span className="grey">(<FormattedRelative value={this.props.data.date} />)</span>
          </p>

          <p><FormattedMessage id="startingat" defaultMessage=" "/>
              &nbsp;<FormattedTime
                    value={this.props.data.date}
                    minute="numeric"
                    hour="numeric" /></p>

          <p>Group {groupName} by {ownerName}</p>
          
        </div>

    );
  }
});
