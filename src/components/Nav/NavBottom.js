import React from 'react';
import {Link}  from 'react-router';
import classNames from 'classnames';

import Icon from '../General/Icon';

import { FormattedMessage } from 'react-intl';

export default React.createClass({

  getInitialState() {
    return {
      collapsed: true
    }
  },

  render() {

    var data = this.props.data;
    
    if (data.status) {
      var newsClasses = classNames( 'news', {
        'active': data.status.currentPage === 'news'
      });
      var activitiesClasses = classNames( 'activities', {
        'active': data.status.currentPage === 'activities'
      });
      var storiesClasses = classNames( 'stories', {
        'active': data.status.currentPage === 'stories'
      });
    }

    return (
        <nav className="navbar navbar-bottom hidden-md hidden-lg" role="navigation">
          <div className="text-center">
            <div id="navbar">
             <ul className="nav navbar-nav">
              <li>
                <Link className={newsClasses} activeClassName="active" to="/news">
                  <div><Icon type='nav-news' area='news' size='small' active={data.status && data.status.currentPage === 'news'}/></div>
                  <FormattedMessage id='nav_news' defaultMessage='News'/>
                </Link>
              </li>
              <li>
                <Link className={activitiesClasses} activeClassName="active" to="/activities">
                  <div><Icon type='nav-activities' area='activities' size='small' active={data.status && data.status.currentPage === 'activities'}/></div>
                  <FormattedMessage id='nav_activities' defaultMessage='Activities'/>
                </Link>
              </li>
              <li>
                <Link className={storiesClasses} activeClassName="active" to="/stories">
                  <div><Icon type='nav-stories' area='stories' size='small' active={data.status && data.status.currentPage === 'stories'}/></div>
                  <FormattedMessage id='nav_stories' defaultMessage='Stories'/>
                </Link>
              </li>
            </ul>
            </div>
          </div>
        </nav>
    );
  }
});

