import React, { Component, Fragment } from "react";
import axios from "axios";

import { Header, Repositories, Offline } from "./styles";
class App extends Component {
  state = {
    newRepoInput: "",
    online: navigator.onLine,
    repositories: JSON.parse(localStorage.getItem("repositories")) || []
  };

  componentDidMount() {
    window.addEventListener("online", this.handlerNetworkChange);
    window.addEventListener("offline", this.handlerNetworkChange);
  }

  componentWillMount() {
    window.removeEventListener("online", this.handlerNetworkChange);
    window.removeEventListener("offline", this.handlerNetworkChange);
  }

  handlerNetworkChange = () => {
    this.setState({ online: navigator.onLine });
  };

  addRepository = async () => {
    if (!this.state.newRepoInput) return;

    if (!this.state.online) alert("Voce esta offline");

    const response = await axios.get(
      `https://api.github.com/repos/${this.state.newRepoInput}`
    );

    this.setState({
      newRepoInput: "",
      repositories: [...this.state.repositories, response.data]
    });
    localStorage.setItem(
      "repositories",
      JSON.stringify(this.state.repositories)
    );
  };
  render() {
    return (
      <Fragment>
        <Header>
          <input
            placeholder="Add repositorio"
            value={this.state.newRepoInput}
            onChange={e => this.setState({ newRepoInput: e.target.value })}
          />
          <button onClick={this.addRepository}>Add</button>
        </Header>

        <Repositories>
          {this.state.repositories.map(repository => (
            <li key={repository.id}>
              <img src={repository.owner.avatar_url} />
              <div>
                <strong>{repository.name}</strong>
                <p>{repository.description}</p>
                <a href={repository.html_url}>Acessar</a>
              </div>
            </li>
          ))}
        </Repositories>
        {!this.state.online && <Offline>Voce esta Offline</Offline>}
      </Fragment>
    );
  }
}

export default App;
