import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, Component } from 'react';
import * as _ from 'lodash';
import type { DataNode } from 'antd/es/tree';

import { Cell, SlideMeta, SlideData, SourceType } from './util';
import { CodeOverview } from './code-overview';
import { ControlPanel } from './slide-control';

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
  slides: SlideData[];

  constructor(props: any) {
    super(props); // cells

    // 自定义属性，便于修改
    this.cells = props.cells;
    this.slides = [];

    this.state = {
      slideMeta: { title: '', author: '', theme: 'light' },

      cells: props.cells,
      cellsRelation: [],

      currentSlide: 0,

      slides: []
    };

    // 为函数绑定组件实例
    this.handleCellsChange = this.handleCellsChange.bind(this);
    this.handleMetaChange = this.handleMetaChange.bind(this);
    this.contentsStructure = this.contentsStructure.bind(this);
  }

  componentDidMount() {
    // 1. Todo: 计算所有cell间的相关性, 向后端请求数据。relate(a, b) ?= relate(b, a)
    let cellsRelation = [
      { source: 0, target: 1, weight: 10 },
      { source: 0, target: 2, weight: 3 },
      { source: 0, target: 4, weight: 6 },
      { source: 1, target: 2, weight: 2 },
      { source: 1, target: 6, weight: 1 },
      { source: 2, target: 3, weight: 15 },
      { source: 3, target: 5, weight: 3 }
    ];

    this.setState({ cellsRelation: cellsRelation });

    // 2. 设置临时slides，构建页面
    let slide1: SlideData = {
      active: true,

      connectedCells: _.slice(this.cells, 0, 3),
      constrait: { audienceLevel: 1, detailLevel: 10 },

      tag: 'Tag1',
      titles: [
        { title: 'a', type: SourceType.Code, weight: 10, isChosen: true },
        { title: 'b', type: SourceType.Code, weight: 1, isChosen: false },
        { title: 'c', type: SourceType.Markdown, weight: 20, isChosen: false }
      ],
      bulletPoints: [
        {
          bullet: 'A is more important code.',
          type: SourceType.Code,
          weight: 10,
          isChosen: true
        },
        {
          bullet: 'B is less important code.',
          type: SourceType.Code,
          weight: 1,
          isChosen: false
        },
        {
          bullet: 'C is important markdown.',
          type: SourceType.Markdown,
          weight: 20,
          isChosen: true
        }
      ],
      layouts: [],
      navis: []
    };
    let slide2: SlideData = {
      active: false,

      connectedCells: _.slice(this.cells, 2, 4),
      constrait: { audienceLevel: 1, detailLevel: 10 },

      tag: 'Tag1',
      titles: [
        { title: 'a', type: SourceType.Code, weight: 10, isChosen: false },
        { title: 'b', type: SourceType.Code, weight: 1, isChosen: true },
        { title: 'c', type: SourceType.Markdown, weight: 20, isChosen: false }
      ],
      bulletPoints: [
        {
          bullet: 'A is more important code.',
          type: SourceType.Code,
          weight: 10,
          isChosen: true
        },
        {
          bullet: 'B is less important code.',
          type: SourceType.Code,
          weight: 1,
          isChosen: false
        },
        {
          bullet: 'C is important markdown.',
          type: SourceType.Markdown,
          weight: 20,
          isChosen: true
        }
      ],
      layouts: [],
      navis: []
    };

    this.setState({ slides: [slide1, slide2] });

    console.log('slides', this.state.slides);
  }

  handleCellsChange(no: number) {
    // 获取当前事件实例
    // console.log('event', event);

    let cells = this.cells;
    let cellIndex = _.findIndex(cells, function (o) {
      return o.no == no;
    });
    cells[cellIndex].bindToSlides.push(this.state.currentSlide);
    // console.log('handleCellsChange:', this.state.currentSlide, no, cells);
  }

  // MetaView
  handleMetaChange(meta: SlideMeta) {
    console.log('handleMetaChange', meta);
    this.setState({ slideMeta: meta });
  }

  // ContentView
  contentsStructure() {
    let slides = this.state.slides;
    let contentsStructure: DataNode[] = [];

    for (let i = 0; i < slides.length; i++) {
      let slideTemp = slides[i];

      let tag = slideTemp.tag;
      let title = _.find(slideTemp.titles, function (o) {
        return o.isChosen == true;
      }).title;

      let pos = _.findIndex(contentsStructure, o => o.title == tag);
      if (pos > -1) {
        contentsStructure[pos].children?.push({
          title: title,
          key: `${pos}-${contentsStructure[pos].children?.length}`
        });
      } else {
        contentsStructure.push({
          title: tag,
          key: `${contentsStructure.length}`,
          children: [
            {
              title: title,
              key: `${contentsStructure.length}-0`
            }
          ]
        });
      }
    }

    // console.log('contentsStructure', contentsStructure);
    return contentsStructure;
  }

  render(): JSX.Element {
    // console.log('0.render');
    return (
      <div className="main-layout">
        <CodeOverview
          cells={this.state.cells}
          cellsRelation={this.state.cellsRelation}
          onCellBind={this.handleCellsChange}
        />
        <ControlPanel
          onMetaChange={this.handleMetaChange}
          contentsStructure={this.contentsStructure()}
          slide={this.state.slides?.[this.state.currentSlide]}
        />
        <div className="slide-panel">part 3</div>
      </div>
    );
  }
}
