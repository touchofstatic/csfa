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
    required: [
      "name",
      "id",
      "itemIds",
      "collapsed",
      "stageNames",
      "stageActive",
    ],
    properties: {
      name: { type: "string" },
      id: { type: "string" },
      itemIds: {
        type: "array",
        items: [{ type: "string", uniqueItems: true }],
      },
      collapsed: { type: "boolean" },
      stageNames: {
        type: "array",
        minItems: 8,
        maxItems: 8,
        items: { type: "string" },
      },
      stageActive: {
        type: "number",
        minimum: 0,
        maximum: 7,
      },
    },
  },
};
