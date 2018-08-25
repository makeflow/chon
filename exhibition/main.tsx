import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {applyCompConfig, applyDefaultStyleSchema} from '../src/core';
import {StyleProvider} from '../src/core/base-style';

import CompOne from './comp-one';
import CompTwo from './comp-two';
import config from './config/component-config';
import styleSchema from './config/styleschema';
import PageOne from './page-one';

applyCompConfig(config);
applyDefaultStyleSchema(styleSchema);

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <>
        <h1>C H O N</h1>
        <StyleProvider styleType="green">
          <CompOne />
        </StyleProvider>
        <StyleProvider styleType="black">
          <CompTwo />
        </StyleProvider>
        <PageOne />
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
