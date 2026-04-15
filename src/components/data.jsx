// TEMPORARY FILE FOR DEVELOPMENT
import { v4 as uuidv4 } from "uuid";
export const SYSTEM_DEFAULT_PROGS = [
  "unspecified",
  "queued",
  "priority",
  "working",
  "pending",
  "done",
];

export const SYSTEM_DEFAULT_POMO = {
  // pomo: 1500,
  // short: 300,
  // long: 900,
  // interval: 4,
  // autoStart: false,
  // volume: 10,

  // NORMALLY TIME SHOULD ALWAYS BE SET IN ROUND MINUTES
  // Only for development to test faster
  pomo: 60,
  short: 60,
  long: 60,
  interval: 1,
  autoStart: true,
  volume: 10,
};

export const devProgsConfig = SYSTEM_DEFAULT_PROGS;
export const devItems = [
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
  { name: "item a2", progress: 5, id: "a2" },
  {
    name: "item a3",
    progress: 4,
    id: "a3",
  },
  { name: "item b0", progress: 5, id: "b0" },
  { name: "item b1", progress: 4, id: "b1" },
  { name: "item b2", progress: 1, id: "b2" },
  { name: "item c0", progress: 3, id: "c0" },
  { name: "item c1", progress: 4, id: "c1" },
];

export const devLists = [
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["a0", "a1", "a2", "a3"],
    visible: true,
    progs: devProgsConfig,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["b0", "b1", "b2"],
    visible: true,
    progs: devProgsConfig,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: [],
    visible: true,
    progs: devProgsConfig,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["c0", "c1"],
    visible: true,
    progs: devProgsConfig,
  },
];
