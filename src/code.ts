import { IconStyle } from "@phosphor-icons/core";

figma.showUI(__html__, { width: 362, height: 52 });

let xOffset = 0;
let yOffset = 0;
let fontLoaded = false;

figma.ui.onmessage = async ({ type, payload }) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  switch (type) {
    case "new-category": {
      if (!fontLoaded) {
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        fontLoaded = true;
      }

      xOffset = 0;
      yOffset += 1;

      const { figma_category, icons } = payload;

      const label = figma.createText();
      label.characters = figma_category;
      label.y += yOffset++ * 64;

      icons.forEach(({ name, svg }) => {
        if (xOffset > 7) {
          xOffset = 0;
          yOffset += 1;
        }

        const component = figma.createComponent();
        component.resize(32, 32);
        component.x += xOffset++ * 64;
        component.y = yOffset * 64;
        component.name = name;

        const node = figma.createNodeFromSvg(svg);
        node.name = name;
        node.constrainProportions = true;
        node.children.forEach((child) => ungroup(child, component));

        node.remove();
      });
      break;
    }
    case "make-variants": {
      const {
        categories,
      }: {
        categories: Record<
          string,
          { name: string; weights: Record<IconStyle, string>; tags: string[] }[]
        >;
      } = payload;

      const componentSetIds: Record<string, string[]> = {};

      Object.entries(categories).forEach(([category, list]) => {
        componentSetIds[category] = [];
        yOffset = 0;

        const label = figma.createText();
        label.characters = category;
        label.x = xOffset * 32;
        label.y = yOffset++;

        list.forEach((entry) => {
          let localX = xOffset;

          const components = Object.entries(entry.weights).reduce<
            ComponentNode[]
          >((arr, [weight, svg]) => {
            const component = figma.createComponent();
            component.resize(32, 32);
            component.x = localX * 32;
            component.y = yOffset * 64;
            component.name = `Weight=${weight.replace(/^\w/, (c) =>
              c.toUpperCase()
            )}`;

            const node = figma.createNodeFromSvg(svg);
            node.name = entry.name;
            node.constrainProportions = true;
            node.children.forEach((child) => ungroup(child, component));
            component.appendChild(node);
            node.remove();

            arr.push(component);
            // instanceCategories[weight][category].
            localX += 1.5;
            return arr;
          }, []);

          const componentSet = figma.combineAsVariants(
            components,
            figma.currentPage
          );
          componentSet.name = entry.name;
          componentSet.description = [...entry.tags, category].join(", ");
          componentSetIds[category].push(componentSet.id);

          yOffset += 1;
        });

        xOffset += 12;
      });

      makeInstancePages(componentSetIds);
    }
  }
};

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
