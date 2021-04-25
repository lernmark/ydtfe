import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';


import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

function Navigation(props) {
  return (
    <Navbar bg="light" expand="lg">
    <Navbar.Brand>🔖TODO App</Navbar.Brand>
    {
      props.logged_in && (
      <Navbar.Text>
        Signed in as: {props.user_name}
      </Navbar.Text>            
      )
    }

    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
      </Nav>
      {
        props.logged_in ? (<Button variant="outline-success" onClick={props.handle_logout}>Logout</Button>): 
        (
          <LoginForm handle_login={props.handle_login} />
        )
      }
    </Navbar.Collapse>
  </Navbar>
  )   
}

export default Navigation;

Navigation.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  user_name: PropTypes.string.isRequired,
  handle_logout: PropTypes.func.isRequired,
  handle_login: PropTypes.func.isRequired
};