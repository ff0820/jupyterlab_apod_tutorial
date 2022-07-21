import React, { useEffect, useState, Component } from 'react';

import * as _ from 'lodash';
import { Input, Card, Space } from 'antd';
import '../style/index.css'; // active the antd style

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
