import React from "react";
import axios from "axios";
import JokeClass from "./JokeClass";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      sortedJokes: [],
    };
  }

  static defaultProps = { numJokesToGet: 10 };

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      console.log(this.props.numJokesToGet)
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
        console.log(j);
      }
      this.setState({ 
        jokes: [...j].sort((a, b) => b.votes - a.votes),
      });
    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  vote(id, delta) {
    this.setState(prevState => {
      console.log(delta);
      const jokes = prevState.jokes.map(j => {
        if( j.id === id) {
          console.log("you voted", j);
          const newobj = { ...j, votes: j.votes + delta }
          console.log(newobj);
          return newobj;
        }
        return j;
      });
      return { jokes: jokes.sort((a, b) => b.votes - a.votes) };
    }
    );
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
    if (this.state.jokes.length) {
      this.setState({
        sortedJokes: [...this.state.jokes].sort((a, b) => b.votes - a.votes),
      });
    }
  }

  componentDidUpdate() {
    console.log('jokes', this.state.jokes);
    if (this.state.jokes.length === 0) this.getJokes();
  }

  componentWillUnmount() {
    //
  }

  render() {
    return <div className="JokeList">
      <button className="JokeList-getmore" onClick={this.generateNewJokes.bind(this)}>
        Get New Jokes
      </button>

      {this.state.jokes.map(j => (
        <JokeClass
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={this.vote.bind(this)}
        />
      ))}
    </div>;
  }
}

export default JokeList;
