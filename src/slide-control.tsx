import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import { Input, Select, Card, Button, Space, Switch } from 'antd';
import '../style/index.css'; // active the antd style
import { BarChartOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { SlideContentsCell } from './util';

export function ControlPanel(props: any) {
  const [counter, setCounter] = useState(0);

  //   useEffect(drawChartByCells, [props.cells, props.cellsRelation]);

  return (
    <div className="control-panel">
      <Space align="center" direction="vertical" size="middle">
        <MetaView onMetaChange={props.onMetaChange} />
      </Space>
    </div>
  );
}

export function MetaView(props: any) {
  const [counter, setCounter] = useState(0);

  //   useEffect(drawChartByCells, [props.cells, props.cellsRelation]);

  let title = '';
  let author = '';
  let theme = '';

  const render = () => {
    const handleTitleEnter = e => {
      // console.log('e', e);
      title = e.target.value;
    };

    const handleAuthorEnter = e => {
      author = e.target.value;
    };

    const handleThemeChange = (value: string) => {
      theme = value;

      // 更新到NB2Slides组件中
      props.onMetaChange({ title: title, author: author, theme: theme });
    };

    const { Option } = Select;
    return (
      <div className="metaview">
        <Card bodyStyle={{ padding: '8px' }}>
          <Space align="start" direction="vertical" size="small">
            <Space>
              Title &nbsp; &nbsp;
              <Input
                placeholder="input slide title"
                size="small"
                onPressEnter={handleTitleEnter}
              />
            </Space>
            <Space>
              Author
              <Input
                placeholder="input author name"
                size="small"
                onPressEnter={handleAuthorEnter}
              />
            </Space>
            <Space>
              Theme
              <Select
                placeholder="select theme"
                size="small"
                showArrow
                onChange={handleThemeChange}
              >
                <Option value="light">light</Option>
                <Option value="dark">dark</Option>
              </Select>
            </Space>
          </Space>
        </Card>
      </div>
    );
  };

  return render();
}
