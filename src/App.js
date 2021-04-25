import React, { Component } from "react";
import Modal from "./components/Modal";
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
// import { FirebaseDatabaseProvider } from "@react-firebase/database";


const todoItems = [
  {
    id: 1,
    title: "Go to Market",
    description: "Buy ingredients to prepare dinner",
    isCompleted: true,
  },
  {
    id: 6,
    title: "Go to Market",
    description: "Buy ingredients to prepare dinner",
    isCompleted: true,
  },
  {
    id: 5,
    title: "Go to Marke 3",
    description: "Buy ingredients to prepare dinner 3",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Study",
    description: "Read Algebra and History textbook for the upcoming test",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Sammy's books",
    description: "Go to library to return Sammy's books",
    isCompleted: true,
  },
  {
    id: 4,
    title: "Article",
    description: "Write article on how to use Django with React",
    isCompleted: false,
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: todoItems,
      modal: false,
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',      
      activeItem: {
        title: "",
        description: "",
        isCompleted: false        
      },      
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8080/current_user/', {
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
        }
      });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8080/token-auth/', {
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

    alert("save" + JSON.stringify(data));
    fetch('http://localhost:8080/api/todos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
      });
  };

  handleDelete = (data) => {
    alert("delete" + JSON.stringify(data));
    fetch(`http://localhost:8080/api/todos/${data.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
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
      (item) => item.isCompleted === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
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
        </span>
      </li>
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
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
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