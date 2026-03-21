export const itemsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      progress: { type: "number" },
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
      visible: { type: "boolean" },
      progs: { type: "array", items: [{ type: "string" }] },
    },
  },
};
