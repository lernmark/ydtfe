import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';


class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
    <Form inline onSubmit={e => this.props.handle_login(e, this.state)}>
        <FormControl type="text" placeholder="Username" className="mr-sm-2" name="username" onChange={this.handle_change} value={this.state.username} />
        <FormControl type="password" placeholder="Password" className="mr-sm-2" name="password" onChange={this.handle_change} value={this.state.password} />
        <Button variant="outline-success" type="submit">Login</Button>
    </Form>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};