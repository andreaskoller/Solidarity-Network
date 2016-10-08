import React from 'react';
import moment from 'moment';
import {Link}  from 'react-router';
import classNames from 'classnames';

import Reflux from 'reflux';
import StatusActions from '../../stores/StatusActions';
import StatusStore from '../../stores/StatusStore';
import Helpers from '../../stores/Helpers.js';

import DataStore from '../../stores/DataStore';

import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import Icon from '../General/Icon';
import IconActivity from '../General/IconActivity';
import Avatar from '../General/Avatar';

export default React.createClass({

  getInitialState() {
    return {
      relatedActivities: []
    };
  },

  componentWillMount() {

    // retrieving the related activities
    var data = this.props.data;
    var activity = Helpers.getActivityById(this.props.params.id, data);
    DataStore.getRelatedActivities( activity, this.onReceivedRelatedActivitiesResults );

    StatusActions.setPage('activities');
    StatusActions.showBackButton(true);
    StatusActions.setTitle(<FormattedMessage id='activity' />);
    StatusActions.setSecondaryNav(null);
    StatusActions.forceTrigger();
  },

  onReceivedRelatedActivitiesResults( results ) {
    // console.log("RELATED");
    // console.log(results);
    this.setState({ relatedActivities: results });
  },

  onClickSelectPhoto(id) {
    window.location.assign(`#/photo/${id}/zoom`);
  },

  // // for related events
  // onClickActivity(id) {
  //   window.location.assign("#/activity/" + id);
  // },

  render() {

    //
    // Currently opened activity
    //

    var data = this.props.data;

    var activity = Helpers.getActivityById(this.props.params.id, data);
    var type = Helpers.getActivityTypeById(activity.typeId, data);
    var community = Helpers.getCommunityById(activity.communityId, data);

    var owner = activity.ownerIds && activity.ownerIds.length > 0 ? Helpers.getPersonById(activity.ownerId[0], data) : undefined;

    // load photos
    activity.photoList = [];
    activity.photoIds.map(function(photoId) {
      var photo = Helpers.getPhotoById(photoId, data);
      if (!photo) {
        // this can happen if the photo exists but is not served by dataStore (e.g. if the field name was not filled out, dataStore ignores it)
        return false;        
      }
      // each photo contains an image array, as there can also be more than one attachment in Airtable.
      photo.image.map(function(image) {
        activity.photoList.push({
          description: photo.description, // store the description for each photo
          ownerId: photo.ownerId, // store the owner for each photo
          url: image.url,
          id: image.id,
          type: image.type,
          size: image.size,
          thumbnail: image.thumbnails.large.url,
          thumbnailSmall: image.thumbnails.small.url
        });
      }.bind(this))
    }.bind(this));

    var photoItem = function(photo) {
      return (
        <Row key={photo.id} className="bottom-buffer">
          <div className="photo fullsize-photo">
            <img src={photo.url} title={photo.description} onClick={this.onClickSelectPhoto.bind(this, photo.id)}/>
            <br />
            {photo.description}
          </div>
        </Row>
      );
    }.bind(this);

    // show photos if available
    // <p><FormattedMessage id="numberofphotos" values={{num: activity.photoList.length}} /></p>
    if (activity.photoList.length > 0) {
      var componentPhoto = <span>
            <Col xs={12} className="top-buffer">
              {activity.photoList.map(photoItem,this)}
            </Col>
          </span>
    }

    // show one story if available
    activity.stories = data.stories.filter(function(story) {
      if (story && story.activityId && story.activityId === activity.id) {
        return true;
      }
      return false;
    });

    if (activity.stories.length > 0) {
     
      var story = activity.stories[0]; // only take first story for now

      var componentStory = <Row>
            <Col xs={12} className="text-center buffer">

              <Button bsSize="large" onClick={function() { window.location.assign(`#/story/${story.id}`); }}>
                <FormattedMessage id='read_story'/>
              </Button>
            
            </Col>
          </Row>
      }


    // check if activity is in the past          
    var isInPast = new Date(activity.date) < new Date();
    
    var startingAt, registerToAttend;

    if (isInPast === false) {
      // event is in the future
      startingAt = <FormattedMessage id="startingat" defaultMessage=" "/>
    } 
    else {
      // event is in the past
      startingAt = <FormattedMessage id="startedat" defaultMessage=" "/>
    }

    // format start and end time
    var componentTime = <h3>
                  <Icon type='time' folder='service' size='medium' area='secondaryinfo'/>
                  {startingAt}&nbsp;<FormattedTime
                        value={activity.date}
                        minute="2-digit"
                        hour="numeric" />
                        </h3>

    if (activity.dateEnd) {
      componentTime = <h3>
                    <Icon type='time' folder='service' size='medium' area='secondaryinfo'/>
                    <FormattedMessage id="from" />&nbsp;<FormattedTime
                      value={activity.date}
                      minute="2-digit"
                      hour="numeric" />
                      &nbsp;<FormattedMessage id="to" />&nbsp;<FormattedTime
                      value={activity.dateEnd}
                      minute="2-digit"
                      hour="numeric" />
                      </h3>
    }

    var componentDate = <h3>
                    <Icon type='calendar' folder='service' size='medium' area='secondaryinfo'/>
                    <FormattedMessage id="on" defaultMessage=" "/>
                        &nbsp;<FormattedDate
                              value={activity.date}
                              weekday="long"
                              day="numeric"
                              month="long"
                              year="numeric" /> 
                        &nbsp;<span className="grey">(<FormattedRelative value={activity.date} />)</span>
                    </h3>

    var componentLocation = <h3>
                    <Icon type='location' folder='service' size='medium' area='secondaryinfo'/>
                    {activity.location}
                    </h3>


    //
    // Related activities
    //
    
    var relatedActivitiesRendered = "";
    var related = this.state.relatedActivities;

    // NB related events are already sorted by ASC date, thank you Airtable

    if (related && related.length > 0) {

      // var renderRelatedEvent = function(event, isFuture) {
      var renderRelatedEvent = function(event) {
        //console.log("is future", isFuture);
        var whenIsDateRelativeToNow = "before or after"; //event.date;
        var date = moment( event.date, "MMMM DD YYYY");
        var timeInfo = "";
        let endDate = event.dateEnd;
        if (endDate) {
          timeInfo = moment( event.date, "h:mm" ) + "-" + moment( event.dateEnd, "h:mma" );
        } else {
          timeInfo = moment( event.date, "h:mma" );
        }
        return <div id="relatedActivityListItem">
            <span id="whenIsDate">{whenIsDateRelativeToNow}</span>
            <span id="eventDate">{date}</span>
            <span id="eventTime">{timeInfo}</span>
          </div>;
      }.bind(this);

      var nowDate = new Date();
      var futureEvents = [];
      var pastEvents = [];
      for (var event of related) {
        if (moment(event.date) > moment(nowDate)) { // NB we compare to user's date, not to activity.date
          futureEvents.push( event );
        } else {
          pastEvents.push( event );
        }
      }

          // {futureEvents.map( renderRelatedEvent.bind(true), this )}
      relatedActivitiesRendered = <div>
          <div>FUTURE</div>
          {futureEvents.map( renderRelatedEvent, this )}
          <br/>
          <div>PAST</div>
          {pastEvents.map( renderRelatedEvent, this )}
        </div>;

    }


    //
    // Rendering of the component
    //

    return (
      <div className="container activities activity">

        <div className="card outline top-buffer">
        
          <Row>
            <Col xs={12}>

              <div className="text-center">

                <IconActivity type={type} area='activities' isOnSolid={false}/>

                <h1>{activity.name}</h1>

                {componentDate}

                {componentTime}

                {componentLocation}

              </div>

              <p className="content top-buffer">
               {activity.description}
              </p>

            </Col>
          </Row>

          <Row>
            {componentPhoto}
          </Row>
        </div>

        <Row>
          {componentStory}
        </Row>

        <Row>
          {relatedActivitiesRendered}
        </Row>

      </div>
    );
  }
});
