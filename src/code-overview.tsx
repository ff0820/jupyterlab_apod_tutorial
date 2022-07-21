import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import { Button, Space, Switch } from 'antd';
import '../style/index.css'; // active the antd style
import { BarChartOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { CellState } from './util';

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
      isMediaOn: false
    };
  }

  componentDidMount() {
    // console.log('CodeOverview cells', this.props.cells);
  }

  render(): JSX.Element {
    // console.log('1.render');

    const onChange = (checked: boolean) => {
      // console.log(`switch to ${checked}`, checked);
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
          cellsRelation={this.props.cellsRelation}
          onCellBind={this.props.onCellBind}
        />
      </Space>
    );
  }
}

export const svgConfig = {
  width: 85,
  height: 300
};

export function RectChart(props: any) {
  let selectCells: number[] = [];

  let drawChartByCells = () => {
    // console.log('RectChart drawChartByCells is on');
    d3.select('#code-overview').select('svg').remove();

    const cells = props.cells;
    const cellsRelation = props.cellsRelation;
    // console.log('cells', cells);
    // console.log('cellsRelation', cellsRelation);

    const svg = d3
      .select('#code-overview')
      .append('svg')
      .style('width', svgConfig.width)
      .style('height', svgConfig.height);

    // 事件处理函数
    // 鼠标悬浮事件
    let mouseover = function (event, bindData) {
      // console.log('mouseover', event, bindData);
      // 控制文本的显示
      // d3.select('#code-overview').selectAll('text').style('opacity', 1);

      // 设置线条样式
      d3.select('#code-overview')
        .selectAll('path')
        .filter((d, index) => {
          return d.source == bindData.no || d.target == bindData.no;
        })
        .style('stroke', CellState.CurrentOn)
        .style('stroke-width', 2)
        .style('opacity', 1);

      // 矩形框描边
      d3.select('#code-overview')
        .selectAll('rect')
        .filter((d, index) => {
          return d.no == bindData.no;
        })
        .style('stroke', CellState.CurrentOn)
        .style('stroke-width', 1);

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

    // 鼠标离开事件
    var mouseleave = function (event, bindData) {
      // console.log('mouseleave', event, bindData);
      // 控制文本的显示
      // d3.select('#code-overview').selectAll('text').style('opacity', 0);

      // 设置线条样式
      d3.select('#code-overview')
        .selectAll('path')
        .style('stroke', CellState.Default)
        .style('stroke-width', 1)
        .style('opacity', 0.3);

      // 矩形框描边
      d3.select('#code-overview')
        .selectAll('rect')
        .filter((d, index) => {
          return d.no == bindData.no;
        })
        .style('stroke', CellState.CurrentOn)
        .style('stroke-width', 0);

      // 更细圆点的颜色
      d3.select('#code-overview')
        .selectAll('circle')
        .filter((d, index) => {
          return (
            d.no == bindData.no && _.indexOf(selectCells, bindData.no) == -1
          );
        })
        .style('fill', 'darkgray');
    };

    let oneclick = function (event, bindData) {
      // 矩形框上色
      // 恢复默认颜色
      d3.select('#code-overview')
        .selectAll('rect')
        .style('fill', CellState.Default);

      // 高亮当前方块
      d3.select('#code-overview')
        .selectAll('rect')
        .filter((d, index) => {
          return d.no == bindData.no;
        })
        .style('fill', CellState.CurrentOn);

      // 绘制相关色块的颜色
      let relationScale = d3
        .scaleLinear()
        .domain([
          d3.min(cellsRelation, d => d.weight),
          d3.max(cellsRelation, d => d.weight)
        ])
        .range(['#cce6ff', '#66b3ff']);

      let relateCells = _.filter(cellsRelation, o => {
        return o.source == bindData.no || o.target == bindData.no;
      });

      for (let i = 0; i < relateCells.length; i++) {
        let temp = relateCells[i];
        let drawNo = temp.source == bindData.no ? temp.target : temp.source;
        d3.select('#code-overview')
          .selectAll('rect')
          .filter((d, index) => {
            return d.no == drawNo;
          })
          .style('fill', relationScale(temp.weight));
      }
    };

    // 双击事件
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
    // 计算矩形的y坐标
    let calY = function (i) {
      return _.sumBy(_.slice(cells, 0, i), o => o.inputLines) + i * 10;
    };

    // 图形绘制
    const svgWidth = svgConfig.width;
    // console.log('svgWidth', svgWidth);

    // 绘制矩形：导航+标记选择状态
    const rectWidth = svgWidth * 0.7;
    const rectBaseX = 15;

    svg
      .append('g')
      .selectAll('rect')
      .data(cells)
      .enter()
      .append('rect')
      .attr('x', rectBaseX)
      .attr('y', (d, i) => calY(i))
      .attr('width', rectWidth)
      .attr('height', (d, i) => d.inputLines)
      .attr('fill', CellState.Default)
      .on('click', oneclick)
      .on('dblclick', dbClick)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    // 绘制序号
    const fontSize = 6;
    svg
      .append('g')
      .selectAll('text')
      .data(cells)
      .enter()
      .append('text')
      .attr('x', rectBaseX + rectWidth * 0.5)
      .attr('y', (d, i) => calY(i) + d.inputLines * 0.5 + fontSize * 0.4)
      .text((d, i) => i + 1)
      .style('font-size', fontSize)
      .style('fill', 'black')
      .style('opacity', 1);

    // 绘制点：标记cell状态
    const radius = 2.5;
    svg
      .append('g')
      .selectAll('circle')
      .data(cells)
      .enter()
      .append('circle')
      .attr('cx', rectBaseX + rectWidth + 6)
      .attr('cy', (d, i) => calY(i) + d.inputLines * 0.5)
      .attr('r', radius)
      .attr('fill', (d, i) => {
        if (d.bindToSlides.length > 0) return CellState.Bind;
        else return CellState.Default;
      });

    // 绘制线条
    svg
      .append('g')
      .selectAll('path')
      .data(cellsRelation)
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        let souceIndex = _.findIndex(cells, function (o) {
          return o.no == d.source;
        });
        let sourceCell = cells[souceIndex];
        let sourceY = calY(souceIndex) + sourceCell.inputLines * 0.5;

        let targetIndex = _.findIndex(cells, function (o) {
          return o.no == d.target;
        });
        let targetCell = cells[targetIndex];
        let targetY = calY(targetIndex) + targetCell.inputLines * 0.5;

        return [
          'M',
          rectBaseX,
          sourceY,
          'Q',
          -rectBaseX * 0.8,
          (sourceY + targetY) / 2,
          rectBaseX,
          targetY
        ].join(' ');
      })
      .style('fill', 'transparent')
      .style('stroke', CellState.Default)
      .style('stroke-width', 1)
      .style('opacity', 0.3);
  };

  useEffect(drawChartByCells, [props.cells, props.cellsRelation]);

  return <div id="code-overview"></div>;
}
