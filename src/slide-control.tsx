import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import { Input, Select, Button, Space, Switch } from 'antd';
import '../style/index.css'; // active the antd style
import { BarChartOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { SlideContentsCell } from './util';

export function SlideControlView(props: any) {
  const [counter, setCounter] = useState(0);

  //   useEffect(drawChartByCells, [props.cells, props.cellsRelation]);

  return (
    <Space
      className="control-panel"
      align="center"
      direction="vertical"
      size="middle"
    >
      <SlideMetaView />
      <SlideMetaView />
    </Space>
  );
}

export function SlideMetaView(props: any) {
  const [counter, setCounter] = useState(0);

  //   useEffect(drawChartByCells, [props.cells, props.cellsRelation]);
  const { Option } = Select;

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <Space align="start" direction="vertical" size="small">
      <Input size="small" placeholder="input slide title" prefix="Title" />
      <Input size="small" placeholder="input author name" prefix="Author" />
      <Select
        placeholder="select theme"
        style={{ width: 200 }}
        size="small"
        suffixIcon="Theme"
        onChange={handleChange}
      >
        <Option value="light">light</Option>
        <Option value="dark">dark</Option>
      </Select>
    </Space>
  );
}
