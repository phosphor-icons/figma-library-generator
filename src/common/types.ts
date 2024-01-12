export type CategoryMap = Record<
  string,
  {
    name: string;
    kebabName: string;
    weights: Record<string, string>;
    tags: string[];
  }[]
>;

export type PluginMessage = {
  type: "make-variants";
  payload: { categories: CategoryMap };
};
