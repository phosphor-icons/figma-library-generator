import React from "react";

import StyleInput from "./StyleInput";
import { IconCategory, IconEntry } from "../../lib";
import { icons } from "../../lib/icons";

import "./Toolbar.css";

type CategorizedIcons = Partial<Record<IconCategory, IconEntry[]>>;

const categorizedIcons = icons.reduce<CategorizedIcons>((acc, curr) => {
  curr.categories.forEach((category) => {
    if (!acc[category]) acc[category] = [];
    acc[category]!!.push(curr);
  });
  return acc;
}, {});

const handleGenerateMulticategory = () => {
  Object.entries(categorizedIcons)
    .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
    .forEach(([category, icons]) => {
      const iconObjects = icons.map(({ Icon: { displayName } }) => ({
        name: displayName,
        svg:
          document.querySelector(`[title="${displayName}"]`)?.innerHTML ?? "",
      }));
      parent.postMessage(
        {
          pluginMessage: {
            type: "new-category",
            payload: { category, icons: iconObjects },
          },
        },
        "*"
      );
    });
};

type ToolbarProps = {};

const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <menu className="toolbar" id="toolbar">
      <div className="toolbar-contents">
        <StyleInput />
        <button onClick={handleGenerateMulticategory}>Generate</button>
      </div>
    </menu>
  );
};

export default Toolbar;
