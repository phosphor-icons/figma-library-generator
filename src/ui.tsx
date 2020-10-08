import React, { Suspense } from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./ui.css";

import Toolbar from "./components/Toolbar/Toolbar";
import ShadowGrid from "./components/ShadowGrid/ShadowGrid";

class App extends React.Component {
  render() {
    return (
      <RecoilRoot>
        <div className="app">
          <Toolbar />
          <Suspense fallback={<p>Loading...</p>}>
            <ShadowGrid />
          </Suspense>
        </div>
      </RecoilRoot>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
