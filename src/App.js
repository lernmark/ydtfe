import React, { Component } from "react";
import Modal from "./components/Modal";
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import {firebase} from './initFirebase';
import {
  Table
} from "reactstrap";
const db = firebase.database();
// const beHost = "http://localhost:8080/";
const beHost = "http://188.166.113.225/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',      
      activeItem: {
        id: "",
        title: "",
        description: "",
        author: "",
        responsible: "",
        isCompleted: false        
      },      
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch(beHost +  'current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        if (res.status !== 200) {
          this.handle_logout();
        }
        return res.json()
      })
      .then(json => {
        if (!!json) {
          this.setState({ username: json.username });
          const ref = db.ref('/')
          ref.on("value", (snapshot) => {
            const values = snapshot.val()
            if (!!values) {
              const todoList = Object.keys(values).map( ( item ) => {
                return snapshot.val()[item];
              } )
              this.setState({ todoList: todoList });
            }
          });
          return () => ref.off();
        }
      });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch(beHost + 'token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (data) => {
    this.toggle();
    const isUpdate = !!data.id;
    const url = beHost + 'api/todos/' + (isUpdate ? data.id + '/' : '');

    fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        //console.log(json);
      });
  };

  handleDelete = (data) => {
    const url = beHost + 'api/todos/' + data.id + '/'; 
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(json => {
        //console.log(json);
      });    
  };

  createItem = () => {
    const item = { title: "", description: "", isCompleted: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };  

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Complete
        </span>
        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;

    const newItems = this.state.todoList.filter(
      (item) => {
        return item.isCompleted === viewCompleted
      }
    );

    return newItems.map((item) => (
      <tr key={item.id}>
        <td>
          {item.title}
        </td>
        <td>
          {item.description}
        </td>        
        <td>
          {item.author}
        </td>        
        <td>
          {item.responsible}
        </td>        
        <td>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {

    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      // case 'signup':
      //   form = <SignupForm handle_signup={this.handle_signup} />;
      //   break;
      default:
        form = null;
    }

    return (
      <main className="container">
        <Navigation
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
          handle_login={this.handle_login}
          user_name={this.state.username}
        />     
        {form}   
        <h1 className="text-center my-4">🔖</h1>
        <div className="row">
          <div className="col-md-10 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <Table borderless>
                <thead>
                  <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                  <th>Responsible</th>
                  <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderItems()}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}        
      </main>
    );
  }
}

export default App;