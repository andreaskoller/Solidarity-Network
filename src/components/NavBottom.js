import React from 'react';
import {Link}  from 'react-router';
import classNames from 'classnames';

import Reflux from 'reflux';
import LanguageActions from '../stores/LanguageActions';
import LanguageStore from '../stores/LanguageStore';
import StatusActions from '../stores/StatusActions';
import StatusStore from '../stores/StatusStore';
import Helpers from '../stores/Helpers.js';

import Icon from './Icon';

import { FormattedMessage } from 'react-intl';

export default React.createClass({

  mixins: [ Reflux.connect(LanguageStore, 'language'), Reflux.connect(StatusStore, 'status') ],

  getInitialState() {
    return {
      collapsed: true
    }
  },

  componentDidMount() {
    LanguageActions.forceTrigger();
    StatusActions.forceTrigger();
  },


  render() {
    
    if (Helpers.checkLanguageLoaded(this) && this.state.status) {
      var whatsnewClasses = classNames( 'whatsnew', {
        'active': this.state.status.currentPage === 'whatsnew'
      });
      var agendaClasses = classNames( 'agenda', {
        'active': this.state.status.currentPage === 'agenda'
      });
      var photosClasses = classNames( 'photos', {
        'active': this.state.status.currentPage === 'photos'
      });
    }

    return (
        <nav className="navbar navbar-bottom hidden-md hidden-lg" role="navigation">
          <div className="text-center">
            <div id="navbar">
             <ul className="nav navbar-nav">
              <li>
                <Link className={whatsnewClasses} activeClassName="active" to="/whatsnew">
                  <div><Icon type={'whatsnew'} area='whatsnew' size='small' active={this.state.status && this.state.status.currentPage === 'whatsnew'}/></div>
                  <FormattedMessage id='nav_whatsnew' defaultMessage='What&#8217;s new?'/>
                </Link>
              </li>
              <li>
                <Link className={agendaClasses} activeClassName="active" to="/agenda">
                  <div><Icon type={'agenda'} area='agenda' size='small' active={this.state.status && this.state.status.currentPage === 'agenda'}/></div>
                  <FormattedMessage id='nav_agenda' defaultMessage='Agenda'/>
                </Link>
              </li>
              <li>
                <Link className={photosClasses} activeClassName="active" to="/photos">
                  <div><Icon type={'photos'} area='photos' size='small' active={this.state.status && this.state.status.currentPage === 'photos'}/></div>
                  <FormattedMessage id='nav_photos' defaultMessage='Photos'/>
                </Link>
              </li>
            </ul>
            </div>
          </div>
        </nav>
    );
  }
});

