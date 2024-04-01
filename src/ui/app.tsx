import { renderToStaticMarkup } from "react-dom/server";
import { FigmaCategory, IconStyle } from "@phosphor-icons/core";

import { CategoryMap } from "@common/types";
import { icons, type IconEntry } from "./util";
import "./app.css";

type CategorizedIcons = Partial<Record<FigmaCategory, IconEntry[]>>;

const categorizedIcons = icons.reduce<CategorizedIcons>((acc, curr) => {
  const category = curr.figma_category;
  if (!acc[category]) acc[category] = [];
  acc[category]!!.push(curr);
  return acc;
}, {});

const handleMakeVariants = () => {
  const weights = Object.values(IconStyle);
  const categories = Object.entries(categorizedIcons).reduce<CategoryMap>(
    (acc, [category, entries]) => {
      acc[category] = entries.map(({ Icon, pascal_name, name, tags }) => ({
        name: pascal_name,
        kebabName: name,
        tags: tags as string[],
        weights: weights.reduce<Record<string, string>>((ws, wt) => {
          ws[wt] = renderToStaticMarkup(
            <Icon size={32} color="black" weight={wt} />
          );
          return ws;
        }, {}),
      }));

      return acc;
    },
    {}
  );

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

export default function App() {
  return (
    <div className="app">
      <button onClick={handleMakeVariants}>GENERATE</button>
    </div>
  );
}
