import React, { useEffect, useState, Component } from 'react';

import * as d3 from 'd3';
import * as _ from 'lodash';
import {
  Input,
  Select,
  Card,
  Tree,
  Slider,
  Button,
  Space,
  Tooltip
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import '../style/index.css'; // active the antd style
import { DownOutlined, PlusOutlined } from '@ant-design/icons';

export const ControlPanel = (props: any): JSX.Element => {
  // const [counter, setCounter] = useState(0);
  // useEffect(drawChartByCells, [props.cells, props.cellsRelation]);
  // console.log('2');
  return (
    <div className="control-panel">
      <Space align="center" direction="vertical" size="middle">
        <ContentViewTest />
        <MetaView onMetaChange={props.onMetaChange} />
        <ContentView contentsStructure={props.contentsStructure} />
        <SlideControlPanel />
      </Space>
    </div>
  );
};

class ContentViewTest extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = { title: 'begin' };

    this.handleTitleEnter = this.handleTitleEnter.bind(this);
  }

  get contentsStructure() {
    // if the params used to compute new value is changed,
    // the computed param will change acoordingly
    let temp = this.state.title + ' ff is testing.';
    // console.log('temp', temp);
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

// Do with slides
const MetaView = (props: any): JSX.Element => {
  // export function MetaView(props: any) {
  let title = '';
  let author = '';
  let theme = '';

  const handleTitleEnter = e => {
    // console.log('e', e);
    title = e.target.value;
  };

  const handleAuthorEnter = e => {
    author = e.target.value;
  };

  function handleThemeChange(value: string) {
    theme = value;

    // 更新到NB2Slides组件中
    props.onMetaChange({ title: title, author: author, theme: theme });
  }

  const render = () => {
    // console.log('2.1');
    const { Option } = Select;
    return (
      <div className="metaview">
        <Card size="small" title="Metadata" bodyStyle={{ padding: '8px' }}>
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
};

const ContentView = (props: any): JSX.Element => {
  console.log('props.contentsStructure', props.contentsStructure);
  const defaultData: DataNode[] = props.contentsStructure;

  const [gData, setGData] = useState(defaultData);
  const [expandedKeys] = useState(['0']);

  useEffect(() => {
    console.log('update');
  }, [props.contentsStructure]);

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
    <div>
      <Card size="small" title="Contents" bodyStyle={{ padding: '8px' }}>
        <Space align="start" direction="vertical" size="small">
          <Space>
            Update
            <Input
              placeholder="press enter to update contents"
              size="small"
              onPressEnter={() => {
                setGData(props.contentsStructure);
              }}
            />
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
};

// Do with one slide
class SlideControlPanel extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div>
        <Space align="center" direction="vertical" size="middle">
          <SlideControlView />
          <SlideContentView />
        </Space>
      </div>
    );
  }
}

class SlideControlView extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      tag: '',
      title: '',
      contraint: { audienceLevel: 0, detailLevel: 0 }
    };

    this.handleTagEnter = this.handleTagEnter.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAudienceLevelChange = this.handleAudienceLevelChange.bind(this);
    this.handleDetailLevelChange = this.handleDetailLevelChange.bind(this);
  }

  handleTagEnter(e) {
    console.log('value', e.target.value);
    this.setState({ tag: e.target.value });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleAudienceLevelChange(value: number) {
    this.setState({
      constraint: {
        audienceLevel: value
      }
    });
  }

  handleDetailLevelChange(value: number) {
    this.setState({
      constraint: {
        detailLevel: value
      }
    });
  }

  render(): JSX.Element {
    const { Option } = Select;

    return (
      <div>
        <Card
          size="small"
          title="Slide Control"
          bodyStyle={{ padding: '8px' }}
          extra={
            <Tooltip title="add slide">
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                size="small"
              />
            </Tooltip>
          }
        >
          <Space align="start" direction="vertical" size="small">
            <Space>
              Tag&nbsp;
              <Input
                placeholder="input tag"
                size="small"
                onPressEnter={this.handleTagEnter}
              />
            </Space>
            <Space>
              Title
              <Select
                placeholder="select theme"
                size="small"
                showArrow
                onChange={this.handleTitleChange}
              >
                <Option value="t1">t1</Option>
                <Option value="t2">t2</Option>
                <Option value="t3">t3</Option>
              </Select>
            </Space>
            <Space>
              Audience
              <Slider
                defaultValue={5}
                min={0}
                max={5}
                style={{ width: 100 }}
                onChange={this.handleAudienceLevelChange}
              />
            </Space>
            <Space>
              Detail &nbsp; &nbsp; &nbsp;
              <Slider
                defaultValue={0}
                min={0}
                max={5}
                style={{ width: 100 }}
                onChange={this.handleDetailLevelChange}
              />
            </Space>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: 'flex', width: 220 }}
            >
              <Button type="primary" size="small">
                Generate
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    );
  }
}

const SlideContentView: React.FC = (props: any): JSX.Element => {
  const tabListNoTitle = [
    {
      key: 'article',
      tab: 'article'
    },
    {
      key: 'app',
      tab: 'app'
    },
    {
      key: 'project',
      tab: 'project'
    }
  ];

  const contentListNoTitle: Record<string, React.ReactNode> = {
    article: <p>replace with my component</p>,
    app: <p>app content</p>,
    project: <p>project content</p>
  };

  const [activeTabKey2, setActiveTabKey2] = useState<string>('article');

  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };

  return (
    <>
      <Card
        size="small"
        bodyStyle={{ padding: 8 }}
        style={{ width: '100%' }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        onTabChange={key => {
          onTab2Change(key);
        }}
      >
        {contentListNoTitle[activeTabKey2]}
      </Card>
    </>
  );
};
