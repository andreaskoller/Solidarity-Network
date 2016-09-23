import React from 'react';
import createHashHistory from 'history/lib/createHashHistory';

import classNames from 'classnames';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import Icon from '../General/Icon';

import { FormattedMessage } from 'react-intl';

const history = createHashHistory();

export default React.createClass({

  onClickMenuFrame( event ) {
    // do nothing but catch the click
    event.stopPropagation();
  },

  onClickUpcoming( event ) {
    this.props.closeMenuCallback();
    window.location.assign("#/activities/upcoming");
  },

  onClickCalendar( event ) {
    this.props.closeMenuCallback();
    window.location.assign("#/activities/month");
  },

  onClickJournal( event ) {
    this.props.closeMenuCallback();
    window.location.assign("#/stories/latest");
  },

  onClickPhoto( event ) {
    this.props.closeMenuCallback();
    window.location.assign("#/stories/wall");
  },

  onClickSettings( event ) {
    this.props.closeMenuCallback();
    window.location.assign("#/settings");
  },

  render() {

    //var data = this.props.data;

    return (
        <div id="menu" onClick={this.onClickMenuFrame}>

            <Button className="UpcomingButton" size="bsLarge" onClickCapture={this.onClickUpcoming}>
              <Icon type='upcoming' folder='service' size='large' isActive={true} area="start"/>
              <FormattedMessage id='upcoming' />
            </Button>

            <Button className="CalendarButton" size="bsLarge" onClickCapture={this.onClickCalendar}>
              <Icon type='calendar' folder='service' size='large' isActive={true} area="start"/>
              <FormattedMessage id='calendar' />
            </Button>

            <Button className="JournalButton" size="bsLarge" onClickCapture={this.onClickJournal}>
              <Icon type='journal' folder='service' size='large' isActive={true} area="start"/>
              <FormattedMessage id='journal' />
            </Button>

            <Button className="PhotoButton" size="bsLarge" onClickCapture={this.onClickPhoto}>
              <Icon type='photo' folder='service' size='large' isActive={true} area="start"/>
              <FormattedMessage id='photo' />
            </Button>

            <Button className="SettingsButton" size="bsLarge" onClickCapture={this.onClickSettings}>
              <Icon type='settings' folder='service' size='large' isActive={true} area="start"/>
              <FormattedMessage id='settings' />
            </Button>

        </div>
    );
  }
});

