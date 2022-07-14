import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import { Button } from 'antd';

import { Cell } from './util';

// active the antd style
import '../style/index.css';

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

  constructor(props: any) {
    super(props);

    this.state = {
      isMediaOn: false,
      currentSelects: [],
      cells: props.cells
    };
  }

  componentDidMount() {
    console.log('CodeOverview cells', this.props.cells, this.state.cells);
  }

  render(): JSX.Element {
    return (
      <div className="code-overview">
        <Button type="primary">Media</Button>
        <RectChart cells={this.props.cells} width="50px" height="300px" />
      </div>
    );
  }
}

export function RectChart(props: any) {
  let drawChartByCells = () => {
    console.log('RectChart drawChartByCells is on');

    const data = props.cells;
    const w = props.width;
    const h = props.height;

    const svg = d3
      .select('#code-overview')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    let selectByWeight = function () {
      svg.selectAll('rect').transition().duration(1000).style('fill', 'red');
    };

    let calY = function (i) {
      return _.sumBy(_.slice(data, 0, i), o => o.inputLines) + i * 10;
    };

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => calY(i))
      .attr('width', 40)
      .attr('height', (d, i) => d.inputLines)
      .attr('fill', 'green')
      .on('click', selectByWeight);
  };

  useEffect(drawChartByCells, []);

  return (
    <div>
      <div id="code-overview"></div>
    </div>
  );
}
