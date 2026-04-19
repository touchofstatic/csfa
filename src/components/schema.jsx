export const itemsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      stage: { type: "number" },
      id: { type: "string" },
    },
  },
};

export const listsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      id: { type: "string" },
      itemIds: {
        type: "array",
        items: [{ type: "string", uniqueItems: true }],
      },
      collapsed: { type: "boolean" },
      stages: { type: "array", items: [{ type: "string" }] },
    },
  },
};
