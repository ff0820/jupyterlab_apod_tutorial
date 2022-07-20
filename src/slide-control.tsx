import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import { Input, Select, Card, Tree, Button, Space, Switch } from 'antd';
import type { DataNode } from 'antd/es/tree';
import '../style/index.css'; // active the antd style
import { SmileOutlined, DownOutlined } from '@ant-design/icons';

import {} from './util';

export function ControlPanel(props: any) {
  // const [counter, setCounter] = useState(0);
  //   useEffect(drawChartByCells, [props.cells, props.cellsRelation]);

  return (
    <div className="control-panel">
      <Space align="center" direction="vertical" size="middle">
        <MetaView onMetaChange={props.onMetaChange} />
        <ContentView contentsStructure={props.contentsStructure} />
        <ContentViewTest slides={props.slides} />
      </Space>
    </div>
  );
}

export function MetaView(props: any) {
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

export class ContentViewTest extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = { title: 'begin' };

    this.handleTitleEnter = this.handleTitleEnter.bind(this);
  }

  get contentsStructure() {
    // if the params used to compute new value is changed,
    // the computed param will change acoordingly
    let temp = this.state.title + ' ff is testing.';
    console.log('temp', temp);
    return temp;
  }

  handleTitleEnter(e) {
    this.setState({ title: e.target.value });
    console.log('value', e.target.value);
  }

  render(): JSX.Element {
    return (
      <div className="metaview">
        <Card bodyStyle={{ padding: '8px' }}>
          <Space align="start" direction="vertical" size="small">
            <Space>
              Author
              <Input
                placeholder="input author name"
                size="small"
                onPressEnter={this.handleTitleEnter}
              />
            </Space>
            {this.contentsStructure + ''}
          </Space>
        </Card>
      </div>
    );
  }
}

export function ContentView(props: any) {
  console.log('props.contentsStructure', props.contentsStructure);
  const defaultData: DataNode[] = props.contentsStructure;

  const defaultData1: DataNode[] = [
    {
      title: 'parent 1',
      key: '0',
      icon: <SmileOutlined />,
      children: [
        {
          title: 'leaf1',
          key: '0-0',
          icon: <SmileOutlined />
        },
        {
          title: `leaf2`,
          key: '0-1',
          icon: ({ selected }) =>
            selected ? <SmileOutlined /> : <DownOutlined />
        }
      ]
    },
    {
      title: 'parent 1',
      key: '1',
      icon: <SmileOutlined />,
      children: [
        {
          title: 'leaf1',
          key: '1-0',
          icon: <SmileOutlined />
        },
        {
          title: 'leaf2',
          key: '1-1',
          icon: ({ selected }) =>
            selected ? <SmileOutlined /> : <DownOutlined />
        }
      ]
    }
  ];

  const defaultData2: DataNode[] = [
    {
      title: 'Tag1',
      key: '0',
      children: [
        {
          title: 'a',
          key: '0-0'
        },
        {
          title: 'a',
          key: '0-1'
        }
      ]
    }
  ];

  console.log('defaultData', defaultData);

  const [gData, setGData] = useState(defaultData);
  const [expandedKeys] = useState(['0']);

  const onDragEnter = info => {
    console.log(info); // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop = info => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }

        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...gData]; // Find dragObject

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

        item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any[] = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setGData(data);
  };

  return (
    <div className="metaview">
      <Card bodyStyle={{ padding: '8px' }}>
        <Space align="start" direction="vertical" size="small">
          <Space>
            Author
            <Input placeholder="input author name" size="small" />
          </Space>
          <Tree
            defaultExpandedKeys={expandedKeys}
            switcherIcon={<DownOutlined />}
            draggable
            blockNode
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            treeData={gData}
          />
        </Space>
      </Card>
    </div>
  );
}
