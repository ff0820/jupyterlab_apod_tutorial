import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, Component } from 'react';
import * as _ from 'lodash';
import { Button, Space, Switch } from 'antd';

import { Cell } from './util';
import { CodeOverview } from './code-overview';

/**
 * A NB2Slides widget.
 */
export class NB2SlidesWrapper extends ReactWidget {
  props: any;

  constructor(props: any) {
    super(props);
    this.props = props;

    // this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return <NB2Slides cells={this.props.cells}></NB2Slides>;
  }
}

const viewSize = {
  width: '1300px',
  height: '930px'
};

export class NB2Slides extends Component<any, any> {
  cells: Cell[];

  constructor(props: any) {
    super(props); // cells, currentSlide
    this.state = { cells: props.cells, currentSlide: 1 };

    // 自定义属性，便于修改
    this.cells = props.cells;

    // 为函数绑定组件实例
    this.handleCellsChange = this.handleCellsChange.bind(this);
  }

  handleCellsChange(no: number) {
    // 获取当前事件实例
    console.log('event', event);

    let cells = this.cells;
    let cellIndex = _.findIndex(cells, function (o) {
      return o.no == no;
    });
    cells[cellIndex].bindToSlides.push(this.state.currentSlide);
    console.log('handleCellsChange:', no, this.state.currentSlide, cells);
  }

  render(): JSX.Element {
    return (
      <div className="main-layout">
        <CodeOverview
          cells={this.state.cells}
          onCellBind={this.handleCellsChange}
        />
        <div className="control-panel"> part 2</div>
        <div className="slide-panel"> part 3</div>
      </div>
    );
  }
}
