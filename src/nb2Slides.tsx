import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, Component } from 'react';

import { CodeOverview, RectChart } from './code-overview';

/**
 * A NB2Slides widget.
 */
export class NB2Slides extends ReactWidget {
  props: any;
  state: any;

  /**
   * Constructs a new CounterWidget.
   */
  constructor(probs: any) {
    super(probs);
    this.props = probs;
    this.state = { date: new Date() };
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return (
      <div className="main-layout">
        <CodeOverview cells={this.props.cells} />
        <div className="control-panel"> part 2</div>
        <div className="slide-panel"> part 3</div>
      </div>
    );
  }
}
