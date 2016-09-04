import React from 'react';
import moment from 'moment';

import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import ReactCssTransitionGroup from 'react-addons-css-transition-group';

import Reflux from 'reflux';
import StatusActions from '../../stores/StatusActions';
import StatusStore from '../../stores/StatusStore';
import Helpers from '../../stores/Helpers.js';

import UpcomingItem from './UpcomingItem';
import TypeSelectorButton from '../General/TypeSelectorButton';

import ViewSelectorButtons from './ViewSelectorButtons';

export default React.createClass({

  getInitialState() {
    return {
      layout: "cards"
    };
  },

  componentWillMount() {
    StatusActions.setPage('activities');
    StatusActions.showBackButton(false);
    StatusActions.setTitle(<FormattedMessage id='nav_activities' />);
    StatusActions.setSecondaryNav(<ViewSelectorButtons data={this.props.data} view='upcoming'/>);
    StatusActions.forceTrigger();
  },

  onClickActivity(id) {
    window.location.assign("#/activity/" + id);
  },

  onToggleLayoutToCards() {
    this.setState({ layout: "cards" });
  },

  onToggleLayoutToList() {
    this.setState({ layout: "list" });
  },

  render() {

    var data = this.props.data;

    var activities = [];
    var area = Helpers.getAreaById(data.status.area, data);

    var nowDate = new Date();
    
    var date_endOfToday = new Date();
    date_endOfToday.setHours(23,59,59,999);

    var date_endOfTomorrow = new Date();
    date_endOfTomorrow.setDate( date_endOfTomorrow.getDate() + 1 );
    date_endOfTomorrow.setHours(23,59,59,999);

    var date_endOfThisWeek = new Date();
    // set to Sunday (reminder: Sunday = 0 of next week)
    date_endOfThisWeek.setDate( date_endOfThisWeek.getDate() + 7 - date_endOfThisWeek.getDay() );
    date_endOfThisWeek.setHours(23,59,59,999);    

    var date_endOfNextWeek = new Date();
    // set to Sunday (reminder: Sunday = 0 of next week)
    date_endOfNextWeek.setDate( date_endOfNextWeek.getDate() + 14 - date_endOfNextWeek.getDay() );
    date_endOfNextWeek.setHours(23,59,59,999);    

    var date_endOfThisMonth = new Date();
    date_endOfThisMonth.setMonth( date_endOfThisMonth.getMonth() + 1 );
    date_endOfThisMonth.setDate( 0 );
    date_endOfThisMonth.setHours(23,59,59,999);

    var date_endOfNextMonth = new Date();
    date_endOfNextMonth.setMonth( date_endOfNextMonth.getMonth() + 2 );
    date_endOfNextMonth.setDate( 0 );
    date_endOfNextMonth.setHours(23,59,59,999);

    var date_endOfTime = new Date();
    date_endOfTime.setFullYear(3000);

    // console.log( date_endOfToday );
    // console.log( date_endOfTomorrow );
    // console.log( date_endOfThisWeek );
    // console.log( date_endOfThisMonth );

    var groupsResults = [];

    var groupsQueries = [
      { id : "today"      , label : "Aujourd'hui"           , before : date_endOfToday },
      { id : "tomorrow"   , label : "Demain"                , before : date_endOfTomorrow },
      { id : "thisweek"   , label : "Cette semaine"         , before : date_endOfThisWeek },
      { id : "nextweek"   , label : "La semaine prochaine"  , before : date_endOfNextWeek },
      { id : "thismonth"  , label : "Avant la fin du mois"  , before : date_endOfThisMonth },
      { id : "nextmonth"  , label : "Le mois prochain"      , before : date_endOfNextMonth },
      { id : "after"      , label : "Plus tard"             , before : date_endOfTime },
    ];

    // Reinit grouping status
    data.activities.forEach( function ( a ) { a.inAGroup = false; });

    groupsQueries.forEach( function( o )
    {

      var group = o;


      group.activities = data.activities.filter(

        function(activity) {
          console.log(moment(activity.date));

          // check if activity is in the future
          if (moment(activity.date) < moment()) {
            return false;
          }

          // check if activity is of selected type(s)
          if (data.status.selectedActivityTypes.length > 0 && data.status.selectedActivityTypes.indexOf(activity.typeId) === -1) {
            return false;
          }

          // check if activity under date
          if (moment(activity.date) > moment(group.before)) {
            return false;
          }

          // mark activity so it is not picked again in next subgroups
          if (activity.inAGroup) {
            return false;
          }
          activity.inAGroup = true;

          return true;

        }.bind(this)

      );

      // debugging groups
      // console.log(group);

    });

    var activityItem = function(activity) {
      return ( <UpcomingItem key={activity.id}
                activity={activity}
                data={data}
                layout={this.state.layout}
                showDate={false}
                showTime={true}
                showIcon={true}
                onClickHandler={this.onClickActivity} /> );
    }.bind(this);

    var groupItem = function(group) {
      if (groupsQueries.activities.length === 0) {
        // in case of no events we simply don't render the block

        // if you want you can render the block title and say there is no event inside
        /*
        return ( <Row key={group.id}>
                  <div>
                    {group.label}
                  </div>
                 </Row>
        );
        */

      } else {
        return ( <Row key={group.id}>
                  <div>
                    {group.label}
                  </div>
                  {group.activities.map(activityItem, this)}
                 </Row>
        );
      }
    }.bind(this);
  

    if (data.activities.length === 0) {
      var NotFound = <Col className="container text-center box white half"><h2><FormattedMessage id='noactivities' values={{areaName: area.name}}/></h2></Col>;
    }
    
    
    var toggleToCardsClasses = classNames( 'toggle', 'toggleToCards', {
      'active': this.state.layout === 'cards'
    });

    var toggleToListClasses = classNames( 'toggle', 'toggleToList', {
      'active': this.state.layout === 'list'
    });

    return (

      <div className="container activities">

        <TypeSelectorButton data={data}/>

        <div className="layoutToggle">
          <Button className={toggleToCardsClasses} size="bsLarge" onClick={this.onToggleLayoutToCards}>
            <FormattedMessage id='cards_layout' />
          </Button>
          <Button className={toggleToListClasses} size="bsLarge" onClick={this.onToggleLayoutToList}>
            <FormattedMessage id='list_layout' />
          </Button>
        </div>        

        {groups.map(groupItem, this)}

        {NotFound}

      </div>

    );
  }
});
