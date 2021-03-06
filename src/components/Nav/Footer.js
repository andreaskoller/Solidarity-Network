import React from 'react';

import {Link}  from 'react-router';

import classNames from'classnames';

import IconButton from '../General/IconButton';
import Icon from '../General/Icon';

import {formatMessage, FormattedMessage} from 'react-intl';

const noButton = {
  icon: null,
  iconColor: undefined,
  callback: undefined,
};

export default React.createClass({

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getHelpButtonData() {

    var setSessionVar = this.props.setSessionVar;

    var data = this.props.data;

    switch (data.status.page) {

      case '':
      case 'splash':
        return noButton;
        break;

      case 'start':
        return {
          icon: 'help',
          iconColor: 'start',
          callback: undefined,
        };
        break;

      default:
        return {
          icon: 'help',
          iconColor: 'help',
          callback: undefined,
        };
        break;

    }

  },

  render() {

    var settings = <p><Link to="/settings">Settings</Link></p>

    // Help button

    let helpIconClasses = classNames( 'helpIcon', 'divLink', {
      'active': true // TODO clarify whether that means highlighted or enabled
    });

    let helpButtonData = this.getHelpButtonData();

    let label = this.context.intl.formatMessage({ id: 'needhelp' });

  	let helpIcon = (
      <IconButton
        type={helpButtonData.icon}
        folder='service'
        size='small'
        color={helpButtonData.iconColor} isActive={false} labelAlignment='left' iconPosition='left'
        label={label} />
    );
    
    if (helpButtonData.icon === null) {
      helpIcon = undefined;
    }

    var HelpIconComponent = ( <div className={helpIconClasses} id="helpIcon" onClick={helpButtonData.callback}>
      {helpIcon}
    </div> );

    return (
      <footer>

        <div className="bottom-flex-left text-left">
          {HelpIconComponent}
        </div>

      </footer>
    );
  }
});