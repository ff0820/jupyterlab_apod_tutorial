import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import { Button, Space, Switch } from 'antd';
import { BarChartOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { Cell } from './util';

// active the antd style
import '../style/index.css';
import cells from './data/cells';

/**
 * A CodeOverview widget.
 * React 会将以小写字母开头的组件视为原生 DOM 标签
 * state state 是私有的，并且完全受控于当前组件.
 *             组件内部自己管理的变量, 构造函数是唯一可以给 this.state 赋值的地方
 * probs 所有 React 组件都必须保护它们的 props 不被更改
 *       组件外部传入组件内部的变量
 */
export class CodeOverview extends Component<any, any> {
  constructor(props: any) {
    super(props); // probs: cells

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
    const onChange = (checked: boolean) => {
      console.log(`switch to ${checked}`, checked);
    };

    return (
      <Space
        className="code-overview"
        align="center"
        direction="vertical"
        size="middle"
      >
        <Switch
          size="default"
          checkedChildren={<BarChartOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
          onChange={onChange}
          style={{ marginTop: '8px' }}
        />
        <RectChart
          cells={this.props.cells}
          onCellBind={this.props.onCellBind}
        />
      </Space>
    );
  }
}

export const svgConfig = {
  width: '80px',
  height: '300px'
};

export function RectChart(props: any) {
  const [counter, setCounter] = useState(0);
  let selectCells: number[] = [];

  let drawChartByCells = () => {
    console.log('RectChart drawChartByCells is on');
    d3.select('#code-overview').select('svg').remove();

    const data = props.cells;

    const svg = d3
      .select('#code-overview')
      .append('svg')
      .style('width', svgConfig.width)
      .style('height', svgConfig.height);

    // 事件处理函数
    let mouseover = function (event, bindData) {
      // console.log('mouseover', event, bindData);
      // 控制文本的显示
      d3.select('#code-overview').selectAll('text').style('opacity', 1);

      // 更细圆点的颜色
      d3.select('#code-overview')
        .selectAll('circle')
        .filter((d, index) => {
          return (
            d.no == bindData.no && _.indexOf(selectCells, bindData.no) == -1
          );
        })
        .style('fill', 'green');
    };

    // 更细圆点的颜色
    var mouseleave = function (event, bindData) {
      // console.log('mouseleave', event, bindData);
      // 控制文本的显示
      d3.select('#code-overview').selectAll('text').style('opacity', 0);

      d3.select('#code-overview')
        .selectAll('circle')
        .filter((d, index) => {
          return (
            d.no == bindData.no && _.indexOf(selectCells, bindData.no) == -1
          );
        })
        .style('fill', 'darkgray');
    };

    let dbClick = function (event, bindData) {
      // 改变cell的值
      let no = bindData.no;
      let color = '';
      if (_.indexOf(selectCells, bindData.no) == -1) {
        selectCells.push(no);
        color = 'orange';
      } else {
        _.pull(selectCells, no);
        color = 'green';
      }
      props.onCellBind(no);

      // 设置选中节点的颜色
      d3.select('#code-overview')
        .selectAll('circle')
        .filter((d, index) => {
          return d.no == bindData.no;
        })
        .style('fill', color);

      console.log('selectCells', selectCells);
    };

    // 绘图辅助函数
    let calY = function (i) {
      return _.sumBy(_.slice(data, 0, i), o => o.inputLines) + i * 10;
    };

    // 绘制矩形：导航+标记选择状态
    const svgWidth = parseInt(svg.style('width'));
    console.log('svgWidth', svgWidth, svg);
    const rectWidth = svgWidth * 0.74;
    const reactBaseX = 8;

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', reactBaseX)
      .attr('y', (d, i) => calY(i))
      .attr('width', rectWidth)
      .attr('height', (d, i) => d.inputLines)
      .attr('fill', 'darkgray')
      .on('dblclick', dbClick)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    // 绘制点：标记是否绑定
    const radius = 2.5;
    svg
      .append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', reactBaseX + rectWidth + 8)
      .attr('cy', (d, i) => calY(i) + d.inputLines * 0.5)
      .attr('r', radius)
      .attr('fill', (d, i) => {
        if (d.bindToSlides.length > 0) return 'red';
        else return 'darkgray';
      });

    // 绘制cell序号
    const fontSize = 6;
    svg
      .append('g')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', (d, i) => calY(i) + d.inputLines * 0.5 + fontSize * 0.4)
      .text((d, i) => i + 1)
      .style('fill', 'red')
      .style('opacity', 0)
      .style('font-size', fontSize);

    // 绘制线条
  };

  useEffect(drawChartByCells, [props.cells]);

  return <div id="code-overview"></div>;
}
