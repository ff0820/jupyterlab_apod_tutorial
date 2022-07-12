import { ReactWidget } from '@jupyterlab/apputils';

import React, { useState } from 'react';

/**
 * React component for a counter.
 *
 * @returns The React component
 */
const CounterComponent = (probs: any): JSX.Element => {
  const [counter, setCounter] = useState(0);
  const [fruit, setFruit] = useState('banana');
  //   const [todos, setTodos] = useState([{ text: '学习 Hook' }]);

  return (
    <div>
      <p>You clicked {counter} times!</p>
      <br />
      <p>{probs?.name}</p>
      <button
        onClick={(): void => {
          setCounter(counter + 1);
        }}
      >
        Increment
      </button>
      {/* <p>{todos}</p>
      <button
        onClick={(): void => {
          todos.push({ text: 'play' });
          setTodos(todos);
        }}
      >
        add todo
      </button> */}
      <p>{fruit}</p>
      <button
        onClick={(): void => {
          setFruit('todos');
        }}
      >
        add todo
      </button>
    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CounterWidget extends ReactWidget {
  state: any;

  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.state = { date: new Date() };
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return (
      <div>
        <CounterComponent name="FF is testing props." />
        <h2>现在是 {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class NB2Slides extends ReactWidget {
  state: any;

  /**
   * Constructs a new CounterWidget.
   */
  constructor(probs: any) {
    super(probs);
    this.state = { date: new Date() };
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return (
      <div className="main-layout">
        <div> part 1</div>
        <div> part 2</div>
        <div> part 3</div>
      </div>
    );
  }
}
