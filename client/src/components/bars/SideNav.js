import React, { Component } from "react";
import { getCompanies } from "../../actions/companyActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Popup from "../popups/Popup";
import isEmpty from "../../validation/is-empty";

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      open: null,
      popupState: false,
      title: "",
      loaded: false
    };

    this.togglePopupDashboard = this.togglePopupDashboard.bind(this);
    this.togglePopupCompany = this.togglePopupCompany.bind(this);

    if (!this.state.loaded) {
      this.props.getCompanies();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.company.company.companies) {
      this.setState({
        list: nextProps.company.company.companies,
        loaded: true
      });
    }
  }

  addCompany = () => {
    this.setState({ popupState: !this.state.popupState });
  };
  togglePopupDashboard = title => {
    this.setState({ popupState: !this.state.popupState, title });
  };
  togglePopupCompany = title => {
    this.setState({
      popupState: !this.state.popupState,
      title
    });
  };
  renderCompanyList = () => {
    return (
      <ul className="list">
        {this.state.list.map((company, i) => {
          return (
            <li key={i}>
              {company.name}
              {this.renderDashboardList(company)}
            </li>
          );
        })}
      </ul>
    );
  };

  renderDashboardList = company => {
    let elements;
    if (company["dashboards"].length <= 0) {
      elements = <li>No dashboards</li>;
    } else {
      elements = company["dashboards"].map((dashboard, i) => {
        return <li key={i}>{dashboard.name}</li>;
      });
    }

    return <ul className="subList">{elements}</ul>;
  };

  render() {
    let popupState;
    if (this.state.popupState) {
      popupState = (
        <Popup
          title={this.state.title}
          closePopup={this.togglePopupCompany}
          companyList={this.state.list}
        />
      );
    }

    let companyList;
    if (isEmpty(this.state.list)) {
      companyList = (
        <div className="companyList">
          <ul className="list">
            <li>
              <div className="listTitle" />
              <ul className="subList">
                <li />
                <li />
                <li />
              </ul>
            </li>
            <li>
              <div className="listTitle" />
              <ul className="subList">
                <li />
                <li />
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      companyList = (
        <div className="companyList">{this.renderCompanyList()}</div>
      );
    }

    return (
      <div>
        {/* Top buttons */}
        <button
          className="btn icon"
          onClick={this.togglePopupCompany.bind(this, "Add Company")}
        >
          <i className="material-icons">add</i>
          <span>Add company</span>
        </button>
        <button
          className="btn icon"
          onClick={this.togglePopupDashboard.bind(this, "Add Dashboard")}
        >
          <i className="material-icons">add</i>
          <span>Add dashboard</span>
        </button>

        {/* List */}
        {companyList}

        {popupState}
      </div>
    );
  }
}
SideNav.propTypes = {
  getCompanies: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  company: state.company
});
export default connect(
  mapStateToProps,
  { getCompanies }
)(SideNav);
