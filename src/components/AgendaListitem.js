import React from 'react';
import classNames from 'classnames';

import Reflux from 'reflux';
import DataActions from '../stores/DataActions';
import DataStore from '../stores/DataStore';
import Helpers from '../stores/Helpers.js';

import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';

import Icon from './Icon';

export default React.createClass({

  mixins: [ Reflux.connect(DataStore, 'data') ],

  componentDidMount() {
    DataActions.forceTrigger();
  },

  render() {

    var divClass = classNames( 'col-md-4', 'box', 'white', 'linked', 'padded', 'text-center', 'agenda',
      {
        'selected': false
      }
    ); // selected may be needed later

    var group = Helpers.getGroupById(this.props.data.groupId, this);
    var owner = Helpers.getPersonById(group.ownerId, this);

    return (
      <span>

        <div className={divClass} onClick={this.props.onClickHandler.bind(null, this.props.data.id)}>

          <Icon type={'activity-' + this.props.data.type} area='agenda' shape='hexagon'/>

          <h2>{this.props.data.name}</h2>

          <p><FormattedMessage id="on" defaultMessage="on"/>
              &nbsp;<FormattedDate
                    value={this.props.data.date}
                    weekday="long"
                    day="numeric"
                    month="long"
                    year="numeric" /> 
              &nbsp;<span className="grey">(<FormattedRelative value={this.props.data.date} />)</span>
          </p>

          <p><FormattedMessage id="startingat" defaultMessage="Starting at"/>
              &nbsp;<FormattedTime
                    value={this.props.data.date}
                    minute="2-digit"
                    hour="numeric" /></p>

          <p><FormattedMessage id="group" defaultMessage="Group"/> {group.name}
             &nbsp;<FormattedMessage id="by" defaultMessage="by"/> {owner.name}</p>
          
        </div>
      </span>
    );
  }
});
