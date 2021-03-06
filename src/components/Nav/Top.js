import React from 'react';
import createHashHistory from 'history/lib/createHashHistory';

import classNames from 'classnames';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import MainMenu from './MainMenu';
import IconButton from '../General/IconButton';
import Icon from '../General/Icon';

import {formatMessage, FormattedMessage} from 'react-intl';

const noButton = {
  icon: null,
  label: null,
  callback: undefined,
  active: false, // whether or not the icon is highlighted
  disabled: false, // whether or not the icon is clickable or grayed (like, under a popup)
};

const history = createHashHistory();

export default React.createClass({

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      mainMenuOpened: false
    }
  },

  openMenu() {
    var data = this.props.data;
    if (data.status.page === 'start') {
      // document.getElementsByClassName('hideOnMenuOpen').style.visibility = 'hidden';
      $('.hideOnMenuOpen').hide();
    }
    this.setState({ mainMenuOpened: true });
  },

  closeMenu() {
    var data = this.props.data;
    if (data.status.page === 'start') {
      // document.getElementsByClassName('hideOnMenuOpen').style.visibility = 'visible';
      $('.hideOnMenuOpen').show();
    }
    this.setState({ mainMenuOpened: false });
  },

  onClickOutsideMainMenu() {
    this.closeMenu();
  },

  onClickMainMenuIcon() {
    this.openMenu();
  },

  // onClickMenuLink() {
  //   this.openMenu();
  // },

  onClickBack() {
    var data = this.props.data;
    var data = this.props.data;
    var popup = this.props.popup;
    if (data.status.page === 'start') {

      // in start screen the back button decrements a session variable resulting in the steps going back
      var step = this.props.session.startStep;
      if (step && Number.isInteger(step)) {
        if (step == 1) {
          history.goBack();
        } else {
          let newStep = step - 1;
          this.props.setSessionVar( "startStep", newStep );
        }
      }

    } else if (popup && popup == 'Filters') {

      // if go back is pressed when filters popup is open, then it goes back or closes it
      var screen = this.props.session.filterPopupScreen;
      switch ( screen ) {        
        case 'main':
        default:
          // just close it
          this.props.togglePopup();
          break;
        case 'activities':
          // go back to main
          this.props.setSessionVar( "filterPopupScreen", 'main' );
          break;
      }

    } else {

      // in all other cases, just go back in history
      history.goBack();

    }
  },

  onClickForward() {
    StatusActions.historyForward();
  },

  onClickSettings() {
    window.location.assign("#/settings");
  },

  onClickLogin() {
    window.location.assign("#/login");
  },

  // returns a hash with:
  //  iconType
  //  label
  //  buttonColor: color for IconButton component (white|green|default|active|passive)
  getMainMenuIconButtonData() {

    var setSessionVar = this.props.setSessionVar;
    var data = this.props.data;

    switch (data.status.page) {

      case 'start':
        return {
          iconType: 'wheel',
          menuIconColor: 'filled',
          contextualIconColor: 'start',
          backButtonColor: 'start',
          filterButtonColor: ''
        };
        break;

      case 'activities':
      case 'activity':
        return {
          iconType: 'upcoming',
          menuIconColor: 'menu',
          contextualIconColor: 'submenu',
          backButtonColor: 'default',
          filterButtonColor: 'submenu'
        };
        break;

      default:
        return {
          iconType: 'wheel',
          menuIconColor: 'menu',
          contextualIconColor: 'submenu',
          backButtonColor: 'default',
          filterButtonColor: 'submenu'
        };
        break;

    }

  },

  // returns a simple array with:
  // [0] : icon path
  // [1] : label
  getLeftTopButtonData() {

    var setSessionVar = this.props.setSessionVar;
    var data = this.props.data;
    var session = this.props.session;
    var popup = this.props.popup;
    
    let layoutPreference = "Cards";
    let thisIsThePreferredLayoutAlready = ( session.preferredLayout == layoutPreference );
    let label = this.context.intl.formatMessage({ id: 'cards_layout' });

    switch (data.status.page) {

      case 'start':
      default:
        return noButton;
        break;

      case 'activities':
        return {
          icon: 'cards',
          label: label,
          callback: thisIsThePreferredLayoutAlready ? undefined: setSessionVar.bind(null, "preferredLayout", layoutPreference),
          active: thisIsThePreferredLayoutAlready,
          disabled: popup, // if any popup is opened this goes behind
        };
        break;

      case 'activity':
        return {
          icon: 'list',
          label: label,
          callback: undefined,
          active: thisIsThePreferredLayoutAlready,
          disabled: true,
        };
        break;

      // DEBUG
      // default:
      //   return {
      //     icon: '',
      //     label: 'LEFT BUTTON',
      //     callback: undefined,
      //     active: false,
      //   };
      //   break;

    }

  },

  getRightTopButtonData() {

    var setSessionVar = this.props.setSessionVar;
    var data = this.props.data;
    var session = this.props.session;
    var popup = this.props.popup;

    let layoutPreference = "List";
    let thisIsThePreferredLayoutAlready = ( session.preferredLayout == layoutPreference );
    let label = this.context.intl.formatMessage({ id: 'list_layout' });

    switch (data.status.page) {

      case 'start':
      default:
        return noButton;
        break;

      case 'activities':
        return {
          icon: 'list',
          label: label,
          callback: thisIsThePreferredLayoutAlready ? undefined : setSessionVar.bind(null, "preferredLayout", layoutPreference),
          active: thisIsThePreferredLayoutAlready,
          disabled: popup, // if any popup is opened this goes behind
        };
        break;

      case 'activity':
        return {
          icon: 'list',
          label: label,
          callback: undefined,
          active: thisIsThePreferredLayoutAlready,
          disabled: true,
        };
        break;

      // DEBUG
      // default:
      //   return {
      //     icon: '',
      //     label: 'RIGHT BUTTON',
      //     callback: undefined,
      //     active: false,
      //   };
      //   break;

    }

  },

  getFiltersButtonData() {

    var togglePopup = this.props.togglePopup;
    var setSessionVar = this.props.setSessionVar;
    var data = this.props.data;
    var popup = this.props.popup;

    let label = this.context.intl.formatMessage({ id: 'filters' });

    switch (data.status.page) {

      case 'activities':
        return {
          icon: 'filters',
          label: label,
          callback: togglePopup, //.bind(null, "preferredLayout", "list"),
          active: ( popup && popup == 'Filters' ),
          disabled: false, // if another popup is opened that Filters, such as Help for instance
        };
        break;

      case 'activity':
        return {
          icon: 'filters',
          label: label,
          callback: undefined,
          active: false,
          disabled: true,
        };
        break;

      case 'start':
      default:
        return noButton;
        break;

    }

  },

  render() {

    var setSessionVar = this.props.setSessionVar;
    var data = this.props.data;

    if (data.status.title === '' || data.status.title === undefined) {
      return <div></div>;
    }

    //
    // Main menu
    //

    var mainMenuClasses = classNames({
      'opened': this.state.mainMenuOpened
    });

    var mainMenu = (<div id="mainmenu" className={mainMenuClasses} onClick={this.onClickOutsideMainMenu}>
      <MainMenu ref="mainMenuRef" openMenuCallback={this.openMenu} closeMenuCallback={this.closeMenu} data={data} />
    </div>);


    //
    // Primary navigation
    //
    if (data.status.showPrimaryNav) {

      let menuIconData = this.getMainMenuIconButtonData();

      var barClasses = classNames( "top-bar", data.status.page);

      //
      // Back button (top left corner)
      //

      let backIconClasses = classNames( 'backIcon', 'divLink', {
        'active': true // TODO clarify whether that means highlighted or enabled
      });

      let backButtonLabel = this.context.intl.formatMessage({ id: 'goback' });

      let backIcon = (
        <IconButton
          type='arrowleft' folder='service'
          color={menuIconData.backButtonColor}
          size='small'
          isActive={true}
          labelAlignment='left' iconPosition='left'
          label={backButtonLabel} /> );
      
      var BackComponent = ( <div className={backIconClasses} id="backIcon" onClick={this.onClickBack}>
        {backIcon}
      </div> );

      //
      // Main menu icon
      //

      var mainMenuIconClasses = classNames( 'mainMenuIcon', 'divLink', {
        'active': !this.state.mainMenuOpened,
        'hidden': (data.status.page == 'start') && (this.props.session.startStep < 4)
      });

      let menuIconType = menuIconData.iconType;
      let menuIconColor = menuIconData.menuIconColor;

      var MainMenuIcon = (
          <div className={mainMenuIconClasses} id="mainMenuIcon" onClick={this.onClickMainMenuIcon}>
            <Icon
              type={menuIconType}
              folder='nav'
              size='bigger'
              color={menuIconColor}
              isActive={this.state.mainMenuOpened}
              withBorder={!this.state.mainMenuOpened}
              data={data}/>
          </div>
      );

      //
      // Contextual icons (on top center, left and right from main menu icon)
      //

      let contextualIconClasses = classNames( 'contextualTopIcon', 'divLink', {
        'active': true // TODO clarify whether that means highlighted or enabled
      });

      let leftButtonData = this.getLeftTopButtonData();
      let rightButtonData = this.getRightTopButtonData();

      let leftIconColor = leftButtonData.disabled ? ( leftButtonData.active ? "disabled" : "disabledInactive" ) : menuIconData.contextualIconColor;
      let rightIconColor = rightButtonData.disabled ? ( rightButtonData.active ? "disabled" : "disabledInactive" ) : menuIconData.contextualIconColor;

      let leftIcon = (
        <IconButton
          type={leftButtonData.icon}
          folder='service'
          color={leftIconColor}
          size='small'
          isActive={leftButtonData.active}
          labelAlignment='left'
          iconPosition='left'
          label={leftButtonData.label} />);
      
      if (leftButtonData.icon === null && leftButtonData.label === null) {
        leftIcon = undefined;
      }

      let rightIcon = (
        <IconButton
          type={rightButtonData.icon}
          folder='service'
          color={rightIconColor}
          size='small'
          isActive={rightButtonData.active}
          labelAlignment='right'
          iconPosition='right'
          label={rightButtonData.label} />);
      
      if (rightButtonData.icon === null && rightButtonData.label === null) {
        rightIcon = undefined;
      }

      var ContextualIconLeftComponent = ( <div className={contextualIconClasses} id="leftContextualTopIcon" onClick={leftButtonData.callback}>
        {leftIcon}
      </div> );

      var ContextualIconRightComponent = ( <div className={contextualIconClasses} id="rightContextualTopIcon" onClick={rightButtonData.callback}>
        {rightIcon}
      </div> );

      //
      // Filters button (top right corner)
      //

      let filtersIconClasses = classNames( 'filtersIcon', 'divLink', {
        'active': true // TODO clarify whether that means highlighted or enabled
      });

      let filtersButtonData = this.getFiltersButtonData();

      let filtersIconColor = filtersButtonData.disabled ? ( filtersButtonData.active ? "disabled" : "disabledInactive" ) : menuIconData.filterButtonColor;

      let filtersIcon = (
        <IconButton
          type='filters'
          folder='service'
          color={filtersIconColor}
          size='small'
          isActive={filtersButtonData.active}
          labelAlignment='right'
          iconPosition='right'
          label={filtersButtonData.label} />);
      
      if (filtersButtonData.icon === null) {
        filtersIcon = undefined;
      }

      var FiltersIconComponent = ( <div className={filtersIconClasses} id="filtersIcon" onClick={filtersButtonData.callback}>
        {filtersIcon}
      </div> );

      //
      // Rendering of the primary nav
      //

      var primary = (
        <div className={barClasses}>

              <div className="top-left text-left">
                {BackComponent}
              </div>

              <div className="top-right text-right">
                {FiltersIconComponent}
              </div>

              <div className="top-middle text-center">
                <div className="topNavWidget">

                  <div className="topNavWidgetIcons">
                    {ContextualIconLeftComponent}
                    {ContextualIconRightComponent}
                  </div>

                  {MainMenuIcon}

                </div>

                <h1>{data.status.title}</h1>
              
              </div>

        </div>
      );

    };



    //
    // Login button
    //

    // <Button className="loginButton" size="bsLarge" onClick={this.onClickLogin}>
    //   <FormattedMessage id='login' />
    // </Button>


    // 
    // Rendering of the whole component
    //

    return (
      <div className="container-fluid">

        {mainMenu}

        {primary}

      </div>
    );
  }
});

