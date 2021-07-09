figma.showUI(__html__, { width: 362, height: 52 });

let xOffset = 0;
let yOffset = 0;
let column = 0;
let fontLoaded = false;

figma.ui.onmessage = async ({ type, payload }) => {
  switch (type) {
    case "new-category":
      if (!fontLoaded) {
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        fontLoaded = true;
      }

      xOffset = 0;
      yOffset += 1;

      const { category, icons } = payload;

      const label = figma.createText();
      label.characters = category;
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
};

function ungroup(node: BaseNode, parent: ChildrenMixin) {
  if (node.type === "GROUP") {
    node.children.forEach((grandchild) => {
      ungroup(grandchild, parent);
    });
    return;
  }

  parent.appendChild(node);
}
