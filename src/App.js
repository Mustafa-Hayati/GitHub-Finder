import React, { Component, Fragment } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import About from "./components/Pages/About";
import Navbar from "./components/Layout/Navbar/Navbar";
import Search from "./components/Users/Search";
import Alert from "./components/Layout/Alert";
import Users from "./components/Users/Users";
import "./App.css";

class App extends Component {
  state = {
    users: [],
    loading: false,
    alert: null,
  };

  searchUsers = async username => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${username}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    const users = res.data.items;

    this.setState({
      loading: false,
      users,
    });
  };

  clearUsers = () => this.setState({ users: [], loading: false });

  setAlert = (msg, type) => {
    this.setState({
      alert: {
        msg,
        type,
      },
    });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  render() {
    const { loading, users, alert } = this.state;
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Fragment>
                    <Search
                      setAlert={this.setAlert}
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={!!users.length}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
