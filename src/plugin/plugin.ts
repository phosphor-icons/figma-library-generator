import { IconStyle } from "@phosphor-icons/core";
import type { PluginMessage } from "@common/types";

let xOffset = 0;
let yOffset = 0;
let fontLoaded = false;

(async function main() {
  figma.showUI(__html__, { width: 362, height: 52 });

  figma.ui.onmessage = async ({ type, payload }: PluginMessage) => {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    switch (type) {
      case "make-variants": {
        const { categories } = payload;

        const componentSetIds: Record<string, string[]> = {};
        const categoryEntries = Object.entries(categories);

        for (const [category, list] of categoryEntries) {
          componentSetIds[category] = [];
          yOffset = 0;

          const label = figma.createText();
          label.characters = category;
          label.x = xOffset * 32;
          label.y = yOffset++;

          for (const entry of list) {
            let localX = xOffset;

            const outlines = Object.entries(entry.weights).reduce<
              ComponentNode[]
            >((arr, [weight, svg]) => {
              const component = figma.createComponent();
              component.resize(32, 32);
              component.x = localX * 32;
              component.y = yOffset * 64 + 48;
              component.name = `Format=Outline, Weight=${weight.replace(
                /^\w/,
                (c) => c.toUpperCase()
              )}`;

              const node = figma.createNodeFromSvg(svg);
              node.name = entry.name;
              node.constrainProportions = true;
              node.children.forEach((child) => ungroup(child, component));
              component.appendChild(node);
              node.remove();

              arr.push(component);
              localX += 1.5;
              return arr;
            }, []);

            localX = xOffset;

            const strokes: ComponentNode[] = [];
            for (const weight of Object.keys(entry.weights)) {
              const component = figma.createComponent();
              component.resize(32, 32);
              component.x = localX * 32;
              component.y = yOffset * 64;
              component.name = `Format=Stroke, Weight=${weight.replace(
                /^\w/,
                (c) => c.toUpperCase()
              )}`;

              const raw = await (
                await fetch(
                  `/raw/${weight}/${entry.kebabName}${
                    weight === "regular" ? "" : `-${weight}`
                  }.svg`
                )
              ).text();
              const node = figma.createNodeFromSvg(raw);
              node.rescale(1 / 8);
              node.name = entry.name;
              node.constrainProportions = true;
              node.children.forEach((child) => ungroup(child, component));
              component.appendChild(node);
              node.remove();

              strokes.push(component);
              localX += 1.5;
            }

            const componentSet = figma.combineAsVariants(
              [...outlines, ...strokes],
              figma.currentPage
            );
            componentSet.name = entry.name;
            componentSet.description = [...entry.tags, category].join(", ");
            componentSetIds[category].push(componentSet.id);

            yOffset += 2;
          }

          xOffset += 12;
        }

        makeInstancePages(componentSetIds);
      }
    }
  };
})();

function makeInstancePages(componentSetIds: Record<string, string[]>) {
  ["Regular", "Thin", "Light", "Bold", "Fill", "Duotone"].forEach(
    (variant, i) => {
      const page = figma.createPage();
      page.name = variant;
      figma.currentPage = page;

      yOffset = 0;

      Object.entries(componentSetIds).forEach(([category, ids]) => {
        xOffset = 0;

        const label = figma.createText();
        label.characters = category;
        label.y += yOffset++ * 64;

        ids.forEach((id) => {
          if (xOffset > 7) {
            xOffset = 0;
            yOffset += 1;
          }

          const set = figma.getNodeById(id) as ComponentSetNode;
          const variant = set.children[i] as ComponentNode;
          const instance = variant.createInstance();
          instance.x += xOffset++ * 64;
          instance.y = yOffset * 64;
        });

        yOffset += 2;
      });
    }
  );
}

function ungroup(node: BaseNode, parent: ChildrenMixin) {
  if (node.type === "GROUP") {
    node.children.forEach((grandchild) => {
      ungroup(grandchild, parent);
    });
    return;
  }

  parent.appendChild(node as SceneNode);
}
