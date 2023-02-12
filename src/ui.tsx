import React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { FigmaCategory, IconStyle } from "@phosphor-icons/core";

import { IconEntry } from "./lib";
import { icons } from "./lib/icons";

import "./ui.css";

type CategorizedIcons = Partial<Record<FigmaCategory, IconEntry[]>>;

const categorizedIcons = icons.reduce<CategorizedIcons>((acc, curr) => {
  const category = curr.figma_category;
  if (!acc[category]) acc[category] = [];
  acc[category]!!.push(curr);
  return acc;
}, {});

const handleMakeVariants = () => {
  const weights = Object.values(IconStyle);

  const categories = Object.entries(categorizedIcons).reduce<
    Record<
      string,
      { name: string; weights: Record<string, string>; tags: string[] }[]
    >
  >((acc, [category, entries]) => {
    acc[category] = entries.map(({ Icon, pascal_name, tags }) => ({
      name: pascal_name,
      tags,
      weights: weights.reduce<Record<string, string>>((ws, wt) => {
        ws[wt] = renderToStaticMarkup(
          <Icon size={32} color="black" weight={wt} />
        );
        return ws;
      }, {}),
    }));

    return acc;
  }, {});

  parent.postMessage(
    {
      pluginMessage: {
        type: "make-variants",
        payload: { categories },
      },
    },
    "*"
  );
};

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <button onClick={handleMakeVariants}>GENERATE</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
