import React from 'react';
import classNames from 'classnames';
import { Col } from 'react-bootstrap';

import Helpers from '../../stores/Helpers.js';

import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';

import IconActivity from '../General/IconActivity';

export default React.createClass({

  render() {

    var data = this.props.data;
    var story = this.props.story;
    var layout = this.props.layout;

    if (this.props.showDate) {
      var componentDate = <p className="date">
          <FormattedMessage id="publishedon" defaultMessage="Published on"/><br />
          &nbsp;
          <FormattedDate
                    value={story.date}
                    weekday="long"
                    day="numeric"
                    month="long"
                    year="numeric" /><br />
          &nbsp;<span className="grey">(<FormattedRelative value={story.date} />)</span>
        </p>
    }

    switch (layout) {

      case "List":
        
        return (

          <div className="        card       listElem outline linked padded text-center" onClick={this.props.onClickHandler.bind(null, story.id)}>

            <h2>{story.title}</h2>

            {componentDate}

          </div>

        );
        break;
        
      case "Cards":
      default:
        
        return (

          <Col md={4} sm={6} className="bottom-buffer" onClick={this.props.onClickHandler.bind(null, story.id)}>

            <div className="card outline fixedheight linked padded text-center">

              <h2>{story.title}</h2>

              {componentDate}

            </div>
          </Col>

        );
        break;

    }

  }
});
