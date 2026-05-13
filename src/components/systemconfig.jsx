export const SYSTEM_CONFIG_STAGES = [
  "none",
  "queued",
  "priority",
  "working",
  "pending",
  "done",
  "",
  "",
];

export const TEST = 5;

export const SYSTEM_CONFIG_POMODORO = {
  // TIME SHOULD ALWAYS BE SET IN ROUND MINUTES
  // Note: bypassing that rule for development causes all kinds of strange behavior; that's completely normal
  pomo: 1500,
  short: 300,
  long: 900,
  interval: 4,
  autoStart: false,
  alarmSound: "chime",
  volume: 10,

  // TEMPORARY; ONLY FOR DEVELOPMENT
  // pomo: 60,
  // short: 60,
  // long: 60,
  // interval: 4,
  // autoStart: false,
  // alarmSound: "chime",
  // volume: 10,
};

// TEMPORARY; ONLY FOR DEVELOPMENT
export const devStages = SYSTEM_CONFIG_STAGES;
// A shorter custom stages config to test per-list stage independence
const devStagesShort = ["none", "todo", "doing", "", "", "", "", ""];


export const devItems = [
  // List A — "Backlog": 8 items spread across every stage (0–5).
  // Ensures the stacked bar renders all colour segments and that stage-0
  // items (shown last/grey) are handled correctly alongside the rest.
  { name: "Research topic", stage: 0, id: "a0" },
  { name: "Draft outline", stage: 0, id: "a1" },
  { name: "Write introduction", stage: 1, id: "a2" },
  { name: "Gather resources", stage: 2, id: "a3" },
  { name: "Review notes", stage: 3, id: "a4" },
  { name: "Edit draft", stage: 4, id: "a5" },
  { name: "Final review", stage: 5, id: "a6" },
  { name: "Submit", stage: 5, id: "a7" },

  // List B — "In Progress": 4 items at mid-range stages.
  // Typical active-work list; keeps the item count low to contrast with A.
  { name: "Fix login bug", stage: 3, id: "b0" },
  { name: "Update dependencies", stage: 2, id: "b1" },
  { name: "Write unit tests", stage: 1, id: "b2" },
  { name: "Deploy to staging", stage: 4, id: "b3" },

  // List C — "Completed": all items at max stage (5 = done).
  // Tests the uniform single-colour bar and the advance button wrapping
  // back to stage 0 when already at the last stage.
  { name: "Set up repo", stage: 5, id: "c0" },
  { name: "Configure CI", stage: 5, id: "c1" },
  { name: "Write README", stage: 5, id: "c2" },

  // List E — "Archived": items that won't be visible because the list
  // starts collapsed. Confirms the bar still renders in the header and
  // that collapse/expand restores items correctly.
  { name: "Old task 1", stage: 1, id: "e0" },
  { name: "Old task 2", stage: 3, id: "e1" },
  { name: "Old task 3", stage: 2, id: "e2" },

  // List F — "Personal": uses devStagesShort (only stages 0–2 valid).
  // Tests that per-list stage configs are independent from the global
  // config, and that items stay in-bounds for their own list's stages.
  { name: "Buy groceries", stage: 0, id: "f0" },
  { name: "Call dentist", stage: 1, id: "f1" },
  { name: "Pay bills", stage: 2, id: "f2" },
  { name: "Book flights", stage: 2, id: "f3" },

  // List G — "Long Names": mixes one very long name with short ones.
  // Tests the breakword / text-wrapping rules and that the item control
  // row doesn't overflow or clip with varying content widths.
  {
    name: "This item has a very long name that tests how the layout handles text wrapping inside a narrow column",
    stage: 1,
    id: "g0",
  },
  { name: "Short", stage: 3, id: "g1" },
  {
    name: "Another moderately long item name for comparison",
    stage: 5,
    id: "g2",
  },
];

export const devLists = [
  // Large list — covers the full bar, ordering by stage, and dnd within a tall list
  {
    name: "Backlog",
    id: "list-a",
    itemIds: ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7"],
    collapsed: false,
    stageNames: devStages,
    activeStageCount: 5,
  },
  // Normal active list
  {
    name: "In Progress",
    id: "list-b",
    itemIds: ["b0", "b1", "b2", "b3"],
    collapsed: false,
    stageNames: devStages,
    activeStageCount: 5,
  },
  // All items at max stage — uniform bar, advance wraps to 0
  {
    name: "Completed",
    id: "list-c",
    itemIds: ["c0", "c1", "c2"],
    collapsed: false,
    stageNames: devStages,
    activeStageCount: 5,
  },
  // Empty list — tests the add-item form in isolation and the empty droppable drop target
  {
    name: "Empty List",
    id: "list-d",
    itemIds: [],
    collapsed: false,
    stageNames: devStages,
    activeStageCount: 5,
  },
  // Collapsed list — header and bar visible, items hidden; tests collapse toggle
  {
    name: "Archived",
    id: "list-e",
    itemIds: ["e0", "e1", "e2"],
    collapsed: true,
    stageNames: devStages,
    activeStageCount: 5,
  },
  // Custom stages (length 3) — tests per-list stage independence from global config
  {
    name: "Personal",
    id: "list-f",
    itemIds: ["f0", "f1", "f2", "f3"],
    collapsed: false,
    stageNames: devStagesShort,
    activeStageCount: 2,
  },
  // Long item names — tests text wrapping and layout stability
  {
    name: "Long Names",
    id: "list-g",
    itemIds: ["g0", "g1", "g2"],
    collapsed: false,
    stageNames: devStages,
    activeStageCount: 5,
  },
];
