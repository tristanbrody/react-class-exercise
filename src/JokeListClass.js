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
      while (j.length < numJokesToGet) {
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
      }
      setState(j);
    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes() {
    setState({ jokes: [] });
  }

  vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) getJokes();
    if (jokes.length) {
      setState({
        sortedJokes: [...this.props.jokes].sort((a, b) => b.votes - a.votes),
      });
    }
  }

  componentDidUpdate() {
    if (this.state.jokes.length === 0) getJokes();
    if (jokes.length) {
      setState({
        sortedJokes: [...this.props.jokes].sort((a, b) => b.votes - a.votes),
      });
    }
  }

  componentWillUnmount() {
    //
  }

  render() {
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map(j => (
        <JokeClass
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>;
  }
}

export default JokeListClass;
