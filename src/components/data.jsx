// TODO: TEMPORARY FOR DEVELOPMENT
import { v4 as uuidv4 } from "uuid";
export const SYSTEM_DEFAULT_PROGS = [
  "unspecified",
  "queued",
  "priority",
  "working",
  "submitted",
  "approved",
  "done",
];

// TODO: shitty name
export const userProgsdb = SYSTEM_DEFAULT_PROGS;

export const itemsdb = [
  {
    name: "item a0",
    progress: 2,
    id: "a0",
  },
  {
    name: "item a1",
    progress: 1,
    id: "a1",
  },
  { name: "item a2", progress: 3, id: "a2" },
  {
    name: "item a3",
    progress: 4,
    id: "a3",
  },
  { name: "item b0", progress: 5, id: "b0" },
  { name: "item b1", progress: 6, id: "b1" },
  { name: "item b2", progress: 1, id: "b2" },
  { name: "item c0", progress: 6, id: "c0" },
  { name: "item c1", progress: 5, id: "c1" },
];

export const listsdb = [
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["a0", "a1", "a2", "a3"],
    visible: true,
    progs: userProgsdb,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["b0", "b1", "b2"],
    visible: true,
    progs: userProgsdb,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["c0", "c1"],
    visible: true,
    progs: userProgsdb,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: [],
    visible: true,
    progs: userProgsdb,
  },
];
