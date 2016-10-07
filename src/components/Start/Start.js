import React from 'react';

import SvgIcon from 'react-svg-icons';
import { Button, Row, Col } from 'react-bootstrap';
import { Link }  from 'react-router';
import { FormattedMessage } from 'react-intl';

import Reflux from 'reflux';
import StatusActions from '../../stores/StatusActions';
import StatusStore from '../../stores/StatusStore';
import DataActions from '../../stores/DataActions';
import DataStore from '../../stores/DataStore';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import StepBullets from '../General/StepBullets';
import Icon from '../General/Icon';

export default React.createClass({

  // Step 1: must select country
  // Step 2: country selected & must select area
  // Step 3: area selected & must press button
  // Step 4: button pressed, select section (in main menu)

  // NB in the design of the interface, we don't reflect those 4 steps
  // graphically. Instead we have 2 stepbullets.
  // First stepbullet is for steps 1
  // Second stepbullet is for steps 2 and 3
  // during step 4 we hide the stepbullets

  // shouldComponentUpdate( nextProps, nextState ) {
  //   return nextProps.session.startStep > 1;
  // },

  getInitialState() {
    return {
      // step: 1,
      aCountryIsSelected: false,
      currentlySelectedCountry: undefined,
      anAreaIsSelected: false,
      currentlySelectedArea: undefined,
    };
  },

  componentWillMount() {
    this.props.setSessionVar( "startStep", 1 );
    StatusActions.setPage('start');
    StatusActions.setTitle(null);
    StatusActions.showPrimaryNav(true);
    StatusActions.setSecondaryNav(null);
    StatusActions.forceTrigger();
  },

  onClickCountry( country ) {
    this.props.setSessionVar( "startStep", 2 );
    this.setState({
      aCountryIsSelected: true,
      currentlySelectedCountry: country,
      // step: 2
    });
  },

  onClickArea( area ) {
    
    // debug
    //console.log(area.fields.Name);
    //console.log(area.id);

    this.props.setSessionVar( "startStep", 3 );

    this.setState({
      anAreaIsSelected: true,
      currentlySelectedArea: area,
      // step: 3
    });

    StatusActions.setArea(area.id);
    StatusActions.forceTrigger();

  },

  onClickButtonNext() {
    this.props.setSessionVar( "startStep", 4 );
    // this.setState({
    //   step: 4
    // });
  },

  // onClickActivities() {
  //   StatusActions.setGotoDestination("#/activities");
  //   window.location.assign('#/activities/type');
  // },

  // onClickStories() {
  //   window.location.assign('#/stories');
  // },

  render() {

    var data = this.props.data;
    var countries = data.countries;

    var step = this.props.session.startStep;

    var areasOfSelectedCountry = step > 1 && this.state.aCountryIsSelected ? this.state.currentlySelectedCountry.areas : [];
    // var areasOfSelectedCountry = this.props.session.startCountryIsSelected ? this.props.session.startCurrentlySelectedCountry.areas : [];

    var buttonNextClasses = {

    };

    var countryItem = function(country) {
      var active = this.props.session.startStep > 1 && this.state.currentlySelectedCountry && this.state.currentlySelectedCountry.id && this.state.currentlySelectedCountry.id == country.id;
      return ( <div key={country.id} className="country" onClick={this.onClickCountry.bind(this, country)}>
          <Icon type={country.iconName} folder='countries' color='filled' size='large' isActive={active} data={data}/>
          <br />
          <span className="text">{country.name}</span>
        </div> );
    }.bind(this);
    
    var areaItem = function(area) {
      var active = this.props.session.startStep > 2 && this.state.currentlySelectedArea && this.state.currentlySelectedArea.id && this.state.currentlySelectedArea.id == area.id;
      return ( <div key={area.id} className="area" onClick={this.onClickArea.bind(this, area)}>
          <Icon type={area.fields["Icon Name"]} folder='areas' color='filled' size='small' isActive={active} data={data}/>
          <br />
          <span className="text">{area.fields.Name}</span>
        </div> );
    }.bind(this);

    var mainTitle = undefined;

    switch ( step ) {
      
      case 1:
      case 2:
      case 3:
        mainTitle = <Col sm={12} className="text-center">
          <h4>
            <FormattedMessage id='chooseAreaTitle'/>
          </h4>
        </Col>;
        break;

      case 4:
        mainTitle = <Col sm={12} className="text-center" id="hideOnMenuOpen">

          <div className="arrowUp">
            <SvgIcon name='app/arrow_up' color='#FFFFFF'/>
          </div>
          <h4>
              <FormattedMessage id='chooseSectionTitle'/>
          </h4>
        </Col>;
        break;

    }

    var chooseAreaAndCountry = undefined;

    switch ( step ) {

      case 1:
      case 2:
      case 3:

        chooseAreaAndCountry = (
          <div className="text-center">
            <div>
              <h4>
                <FormattedMessage id='chooseAreaSubtitle'/>
              </h4>
              <div className="countries">
                {countries.map(countryItem, this)}
              </div>
            </div>
            <div>
              <div className="areas">
                {areasOfSelectedCountry.map(areaItem, this)}
              </div>
            </div>
          </div>
        );

        break;

      case 4:
        
        chooseAreaAndCountry = <div></div>;
        
        break;

    }

    var buttonNext = undefined;

    switch ( step ) {
      
      case 1:
      case 2:
        buttonNext = <Col sm={12} className="text-center">
          <p>
            <Button className="next" size="bsLarge" onClick={this.onClickButtonNext} disabled>
              <FormattedMessage id='startNextChooseSection' />
            </Button>
          </p>
        </Col>;
        break;

      case 3:
        buttonNext = <Col sm={12} className="text-center">
          <p>
            <Button className="next" size="bsLarge" onClick={this.onClickButtonNext}>
              <FormattedMessage id='startNextChooseSection' />
            </Button>
          </p>
        </Col>;
        break;

      case 4:
        buttonNext = <Col sm={12} className="text-center">
        </Col>;
        break;

    }

    var stepBullets = undefined;

    switch ( step ) {
      
      case 1:
      case 2:
      case 3:
        stepBullets = <StepBullets small={false} amount={2} active={[ (step == 1), (step == 2 || step == 3) ]} height={180} />;
        break;

      case 4:
        stepBullets = null;
        break;

    }


    return (
      <div className="container-fluid start">
        <Row>
          <Col>
            {mainTitle}
          </Col>
        </Row>
        <Row>
  
          <Col className="selections">

            {stepBullets}

            {chooseAreaAndCountry}

          </Col>

        </Row>
        <Row>
          <Col className="actionButton">
            {buttonNext}
          </Col>
        </Row>
      </div>
    );


  }

});