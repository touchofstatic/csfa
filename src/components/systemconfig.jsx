import { v4 as uuidv4 } from "uuid";
export const SYSTEM_CONFIG_STAGES = [
  "none",
  "queued",
  "priority",
  "working",
  "pending",
  "done",
];

export const SYSTEM_CONFIG_POMODORO = {
  // TIME SHOULD ALWAYS BE SET IN ROUND MINUTES
  // Note: bypassing that rule for development causes all kinds of strange behavior; that's completely normal
  // pomo: 1500,
  // short: 300,
  // long: 900,
  // interval: 4,
  // autoStart: false,
  // alarmSound: "sound0",
  // volume: 10,

  // TEMPORARY ONLY FOR DEVELOPMENT
  pomo: 60,
  short: 60,
  long: 60,
  interval: 4,
  autoStart: false,
  alarmSound: "sound0",
  volume: 10,
};

// TEMPORARY ONLY FOR DEVELOPMENT
export const devStages = SYSTEM_CONFIG_STAGES;
export const devItems = [
  {
    name: "item a0",
    stage: 2,
    id: "a0",
  },
  {
    name: "item a1",
    stage: 1,
    id: "a1",
  },
  { name: "item a2", stage: 5, id: "a2" },
  {
    name: "item a3",
    stage: 4,
    id: "a3",
  },
  { name: "item b0", stage: 5, id: "b0" },
  { name: "item b1", stage: 4, id: "b1" },
  { name: "item b2", stage: 1, id: "b2" },
  { name: "item c0", stage: 3, id: "c0" },
  { name: "item c1", stage: 4, id: "c1" },
];
export const devLists = [
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["a0", "a1", "a2", "a3"],
    collapsed: false,
    stages: devStages,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["b0", "b1", "b2"],
    collapsed: false,
    stages: devStages,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: [],
    collapsed: false,
    stages: devStages,
  },
  {
    name: uuidv4().substring(0, 8),
    id: uuidv4(),
    itemIds: ["c0", "c1"],
    collapsed: false,
    stages: devStages,
  },
];
