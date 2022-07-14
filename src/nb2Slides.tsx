import { ReactWidget } from '@jupyterlab/apputils';

import React, { useState } from 'react';

import { Cell } from './util';

import { CodeOverview, RectChart } from './code-overview';

/**
 * React component for a counter.
 *
 * @returns The React component
 */
const CounterComponent = (probs: any): JSX.Element => {
  const [counter, setCounter] = useState(0);
  const [fruit, setFruit] = useState('banana');

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
 * A NB2Slides widget.
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
        <CodeOverview name="FF" />
      </div>
    );
  }
}
