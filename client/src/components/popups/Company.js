import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addCompany, getCompanies } from "../../actions/companyActions";
import TextFieldGroup from "../common/TextField";
import removeSpecial from "../../validation/remove-special";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      handle: "",
      handleTyped: false,
      errors: {}
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onKeyUp = e => {
    const { handleTyped } = this.state;
    let { name, value } = e.target;

    if (name === "name") {
      if (e.key !== " ") {
        value = removeSpecial(value);
        value = value.trim().replace(/\s+/g, " ");

        this.setState({ name: value });
        if (!handleTyped) {
          value = removeSpecial(value);
          value = value.trim().replace(/\s+/g, "-");

          this.setState({ handle: value });
        }
      }
    } else if (name === "handle") {
      this.setState({ handleTyped: true });

      if (e.key !== " ") {
        value = removeSpecial(value);
        value = value.trim().replace(/\s+/g, "-");

        this.setState({ handle: value });
      }
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, handle } = this.state;
    const { addCompany, closePopup, getCompanies } = this.props;

    addCompany({ name, handle }, () => closePopup());
    getCompanies();
  };

  handleClick = e => {
    const { closePopup } = this.props;
    closePopup();
  };

  render() {
    const { errors, name, handle } = this.state;

    return (
      <div className="popupContainer">
        <form onSubmit={this.onSubmit}>
          <div className="middleForm">
            <div className="formField">
              <p>Name</p>
              <TextFieldGroup
                type="text"
                name="name"
                placeholder="Name of company"
                onChange={this.onChange}
                onKeyUp={this.onKeyUp}
                value={name}
                error={errors.name}
              />
            </div>
            <div className="formField">
              <p>Handle</p>
              <TextFieldGroup
                type="text"
                name="handle"
                placeholder="Handle of company"
                onChange={this.onChange}
                onKeyUp={this.onKeyUp}
                value={handle}
                error={errors.handle}
              />
            </div>
          </div>
          <div>
            <button className="btn" type="submit">
              <span>Add</span>
            </button>
            <button className="btn" onClick={this.handleClick}>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Company.propTypes = {
  addCompany: PropTypes.func.isRequired,
  getCompanies: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addCompany, getCompanies }
)(Company);
