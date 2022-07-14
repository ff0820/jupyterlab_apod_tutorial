import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';

import { Cell } from './util';

/**
 * A CodeOverview widget.
 * React 会将以小写字母开头的组件视为原生 DOM 标签
 * state state 是私有的，并且完全受控于当前组件.
 *             组件内部自己管理的变量, 构造函数是唯一可以给 this.state 赋值的地方
 * probs 所有 React 组件都必须保护它们的 props 不被更改
 *       组件外部传入组件内部的变量
 */
export class CodeOverview extends Component<any, any> {
  // probs: cells
  // state: any

  /**
   * Constructs a new Widget.
   */
  constructor(props) {
    super(props);

    this.state = {
      isMediaOn: false,
      currentSelects: []
    };
  }

  render(): JSX.Element {
    return (
      <div>
        <button>Toggle Media</button>
        <RectChart />
        test state: {this.state.isMediaOn == false ? 'false' : 'true'}
        test props: {this.props.name}
      </div>
    );
  }
}

export function RectChart(probs: any) {
  useEffect(() => {
    console.log('draw chart is on');
    const data = [12, 5, 6, 6, 9, 10];
    const h = 300;
    const w = 700;

    const svg = d3
      .select('#code-overview')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    let selectByWeight = function () {
      svg.selectAll('rect').transition().duration(1000).style('fill', 'red');
    };

    let calY = function (i) {
      return _.sum(_.slice(data, 0, i)) + i * 10;
    };

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => calY(i))
      .attr('width', 65)
      .attr('height', (d, i) => d)
      .attr('fill', 'green')
      .on('click', selectByWeight);
  }, []);

  return (
    <div>
      <div id="code-overview"></div>
    </div>
  );
}
