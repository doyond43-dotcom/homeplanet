import { useMemo, useState } from "react";
import {
  Clock3,
  Users,
  ShieldCheck,
  Camera,
  Sparkles,
  MapPin,
  KeyRound,
  Siren,
  Lock,
  CheckCircle2,
  AlertCircle,
  TimerReset,
  Trophy,
  MessageSquareMore,
  Flame,
  GraduationCap,
  Search,
  PartyPopper,
  Trees,
  X,
  PanelRightOpen,
  Link2,
  ClipboardList,
  UserRound,
  History,
  Wand2,
} from "lucide-react";

type BoardStatus = "in_progress" | "completed" | "failed";

type ExperienceType =
  | "escape_room"
  | "classroom_challenge"
  | "scavenger_hunt"
  | "birthday_quest"
  | "team_building"
  | "haunted_route";

type TeamMemberStatus = "active" | "focused" | "hint-caller" | "guide" | "leader";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  status: TeamMemberStatus;
};

type PuzzleStage = {
  id: string;
  label: string;
  solved: boolean;
  solvedAt?: string;
  icon: "entry" | "puzzle" | "door" | "lock" | "final" | "checkpoint" | "team";
};

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone?: "neutral" | "success" | "warning";
};

type HintLog = {
  id: string;
  time: string;
  hint: string;
};

type ExperienceConfig = {
  type: ExperienceType;
  switcherLabel: string;
  badgeLabel: string;
  boardTitle: string;
  boardSubtitle: string;
  roomLabel: string;
  roomName: string;
  teamLabel: string;
  teamName: string;
  stageGroupLabel: string;
  actionPanelTitle: string;
  timelineTitle: string;
  outcomePanelTitle: string;
  hintsPanelTitle: string;
  expansionTitle: string;
  progressSummaryLabel: string;
  progressUnitLabel: string;
  hintUnitLabel: string;
  completedLabel: string;
  failedLabel: string;
  inProgressLabel: string;
  stageCompleteWord: string;
  stageWaitingWord: string;
  fastestMetricLabel: string;
  fastestMetricValue: string;
  fastestMetricSubtext: string;
  pressureMetricLabel: string;
  pressureMetricValue: string;
  pressureMetricSubtext: string;
  whyItMattersText: string;
  expansionText: string;
  actionPrimaryLabel: string;
  actionPrimaryDescription: string;
  actionHintLabel: string;
  actionHintDescription: string;
  actionMomentLabel: string;
  actionMomentDescription: string;
  actionExtendLabel: string;
  actionExtendDescription: string;
  primaryAdvanceEventTitle: string;
  primaryAdvanceEventDetail: string;
  finalAdvanceEventDetail: string;
  momentEventTitle: string;
  momentEventDetail: string;
  extensionEventTitle: string;
  extensionEventDetail: string;
  extraHintText: string;
  team: TeamMember[];
  initialStages: PuzzleStage[];
  initialTimeline: TimelineEvent[];
  initialHints: HintLog[];
  defaultTimeUsed: string;
  totalTime: string;
};

type StageDrawerData = {
  stageId: string;
  title: string;
  description: string;
  ownerName: string;
  ownerRole: string;
  supportUsed: boolean;
  supportLabel: string;
  linkedTimelineTitle: string;
  linkedTimelineTime: string;
  linkedTimelineDetail: string;
  note: string;
  attachmentLabel: string;
};

type TimelineDrawerData = {
  eventId: string;
  title: string;
  time: string;
  detail: string;
  tone: "neutral" | "success" | "warning";
  eventTypeLabel: string;
  sourceLabel: string;
  triggeredByName: string;
  triggeredByRole: string;
  linkedStageLabel: string;
  linkedStageStatus: string;
  reasonLabel: string;
  note: string;
  attachmentLabel: string;
};

type ActiveDrawer =
  | { type: "stage"; id: string }
  | { type: "timeline"; id: string }
  | null;

const EXPERIENCE_CONFIGS: Record<ExperienceType, ExperienceConfig> = {
  escape_room: {
    type: "escape_room",
    switcherLabel: "Escape Room",
    badgeLabel: "Live Experience Board",
    boardTitle: "The Bunker — Escape Board Demo",
    boardSubtitle:
      "A live board for escape rooms, scavenger hunts, birthdays, and challenge-based experiences. Every stage, hint, moment, and final outcome becomes a replayable timeline.",
    roomLabel: "Room",
    roomName: "Cold War Bunker",
    teamLabel: "Team Phoenix",
    teamName: "Team Phoenix",
    stageGroupLabel: "Session Progress",
    actionPanelTitle: "Live Actions",
    timelineTitle: "Session Timeline",
    outcomePanelTitle: "Hint + Outcome Panel",
    hintsPanelTitle: "Hint Log",
    expansionTitle: "Expansion Path",
    progressSummaryLabel: "stages cleared",
    progressUnitLabel: "complete",
    hintUnitLabel: "Hints Used",
    completedLabel: "Escaped",
    failedLabel: "Time Expired",
    inProgressLabel: "In Progress",
    stageCompleteWord: "Solved at",
    stageWaitingWord: "Waiting",
    fastestMetricLabel: "Fastest Cleared Stage",
    fastestMetricValue: "Breaker Panel",
    fastestMetricSubtext: "06:14 from room start",
    pressureMetricLabel: "Pressure Point",
    pressureMetricValue: "Cipher Sequence",
    pressureMetricSubtext: "Most likely place for teams to request support.",
    whyItMattersText:
      "This turns an escape room into a replayable system. The board is not just a timer. It becomes a live session record, a shareable story, and a proof-driven experience log.",
    expansionText:
      "This same board pattern can power birthday challenges, classroom puzzle days, scavenger hunts, haunted house routes, team-building events, and creator-made challenge experiences inside HomePlanet.",
    actionPrimaryLabel: "Mark Next Puzzle Solved",
    actionPrimaryDescription: "Advance the room and push the timeline forward.",
    actionHintLabel: "Request Hint",
    actionHintDescription: "Log a hint, track usage, and anchor the moment.",
    actionMomentLabel: "Add Moment",
    actionMomentDescription: "Capture a photo or milestone inside the session story.",
    actionExtendLabel: "Add Time Extension",
    actionExtendDescription: "Extend the experience and document why it happened.",
    primaryAdvanceEventTitle: "Stage Cleared",
    primaryAdvanceEventDetail: "The team advanced the room after solving the next puzzle chain.",
    finalAdvanceEventDetail: "The team unlocked the final vault and completed the room.",
    momentEventTitle: "Moment Captured",
    momentEventDetail: "Team photo pinned to the live session board.",
    extensionEventTitle: "Time Extension Added",
    extensionEventDetail: "Game master added a 5-minute extension for the final sequence.",
    extraHintText:
      "Look for what repeats three times. The pattern matters more than the numbers.",
    team: [
      { id: "1", name: "Mason", role: "Clue Spotter", status: "active" },
      { id: "2", name: "Ava", role: "Code Breaker", status: "focused" },
      { id: "3", name: "Daniel", role: "Lead Solver", status: "active" },
      { id: "4", name: "Sophia", role: "Hint Caller", status: "hint-caller" },
    ],
    initialStages: [
      { id: "s1", label: "Entered Room", solved: true, solvedAt: "00:00", icon: "entry" },
      { id: "s2", label: "Breaker Panel Opened", solved: true, solvedAt: "06:14", icon: "puzzle" },
      { id: "s3", label: "Hidden Drawer Found", solved: true, solvedAt: "12:31", icon: "door" },
      { id: "s4", label: "Cipher Lock Solved", solved: false, icon: "lock" },
      { id: "s5", label: "Final Vault Opened", solved: false, icon: "final" },
    ],
    initialTimeline: [
      {
        id: "t1",
        time: "00:00",
        title: "Session Started",
        detail: "Team entered The Bunker and the board anchored the session.",
        tone: "neutral",
      },
      {
        id: "t2",
        time: "03:42",
        title: "First Hidden Marking Found",
        detail: "A wall symbol triggered the first clue chain.",
        tone: "success",
      },
      {
        id: "t3",
        time: "06:14",
        title: "Breaker Panel Opened",
        detail: "Puzzle stage advanced after the voltage pattern was matched.",
        tone: "success",
      },
      {
        id: "t4",
        time: "09:58",
        title: "Hint Requested",
        detail: "Team asked for one directional hint on the keypad sequence.",
        tone: "warning",
      },
      {
        id: "t5",
        time: "12:31",
        title: "Hidden Drawer Found",
        detail: "A false wall panel revealed the cipher wheel.",
        tone: "success",
      },
    ],
    initialHints: [
      {
        id: "h1",
        time: "09:58",
        hint: "The keypad symbols match the wall order, not the drawer order.",
      },
    ],
    defaultTimeUsed: "18:46",
    totalTime: "45:00",
  },

  classroom_challenge: {
    type: "classroom_challenge",
    switcherLabel: "Classroom Challenge",
    badgeLabel: "Learning Experience Board",
    boardTitle: "Room 204 — Classroom Challenge Demo",
    boardSubtitle:
      "A live board for classroom stations, academic challenges, and teacher-guided progress. Every checkpoint, support moment, and completion path becomes a replayable timeline.",
    roomLabel: "Classroom",
    roomName: "Room 204",
    teamLabel: "Group Orion",
    teamName: "Group Orion",
    stageGroupLabel: "Station Progress",
    actionPanelTitle: "Teacher Actions",
    timelineTitle: "Learning Timeline",
    outcomePanelTitle: "Support + Outcome Panel",
    hintsPanelTitle: "Support Log",
    expansionTitle: "Expansion Path",
    progressSummaryLabel: "stations cleared",
    progressUnitLabel: "complete",
    hintUnitLabel: "Supports Used",
    completedLabel: "Completed",
    failedLabel: "Expired",
    inProgressLabel: "In Progress",
    stageCompleteWord: "Completed at",
    stageWaitingWord: "Pending",
    fastestMetricLabel: "Fastest Completed Station",
    fastestMetricValue: "Vocabulary Sprint",
    fastestMetricSubtext: "05:22 from challenge start",
    pressureMetricLabel: "Support Focus",
    pressureMetricValue: "Fraction Lab",
    pressureMetricSubtext: "Most likely point for teacher guidance.",
    whyItMattersText:
      "This turns a classroom activity into a living progress board. Teachers can see who completed what, when support was needed, and how the full challenge unfolded without hunting through paper or memory.",
    expansionText:
      "This same board can power station rotations, classroom quests, group labs, reading challenges, intervention blocks, and paperless student progress flows inside HomePlanet.",
    actionPrimaryLabel: "Mark Next Station Complete",
    actionPrimaryDescription: "Advance the group and log the next completed checkpoint.",
    actionHintLabel: "Log Teacher Support",
    actionHintDescription: "Track guidance, support moments, and intervention help.",
    actionMomentLabel: "Add Classroom Moment",
    actionMomentDescription: "Capture a project photo, milestone, or student win.",
    actionExtendLabel: "Add Work Time",
    actionExtendDescription: "Extend the challenge window and record the reason.",
    primaryAdvanceEventTitle: "Station Completed",
    primaryAdvanceEventDetail: "The group completed the next learning station.",
    finalAdvanceEventDetail: "The group completed the final station and finished the challenge.",
    momentEventTitle: "Classroom Moment Added",
    momentEventDetail: "A student work sample was pinned to the board timeline.",
    extensionEventTitle: "Work Time Extended",
    extensionEventDetail: "The teacher added extra work time for the final task.",
    extraHintText:
      "Re-check the model example first. The pattern matches the earlier station.",
    team: [
      { id: "1", name: "Mia", role: "Group Lead", status: "leader" },
      { id: "2", name: "Jordan", role: "Reader", status: "focused" },
      { id: "3", name: "Noah", role: "Recorder", status: "active" },
      { id: "4", name: "Emma", role: "Support Caller", status: "hint-caller" },
    ],
    initialStages: [
      { id: "s1", label: "Challenge Started", solved: true, solvedAt: "00:00", icon: "entry" },
      { id: "s2", label: "Vocabulary Sprint", solved: true, solvedAt: "05:22", icon: "checkpoint" },
      { id: "s3", label: "Reading Match", solved: true, solvedAt: "11:08", icon: "puzzle" },
      { id: "s4", label: "Fraction Lab", solved: false, icon: "lock" },
      { id: "s5", label: "Reflection Exit", solved: false, icon: "final" },
    ],
    initialTimeline: [
      {
        id: "t1",
        time: "00:00",
        title: "Challenge Started",
        detail: "Group Orion opened the classroom challenge board.",
        tone: "neutral",
      },
      {
        id: "t2",
        time: "05:22",
        title: "Vocabulary Sprint Complete",
        detail: "The group completed the first language station.",
        tone: "success",
      },
      {
        id: "t3",
        time: "08:16",
        title: "Teacher Support Logged",
        detail: "A short prompt was given to redirect the reading match task.",
        tone: "warning",
      },
      {
        id: "t4",
        time: "11:08",
        title: "Reading Match Complete",
        detail: "Students matched the passage evidence correctly.",
        tone: "success",
      },
    ],
    initialHints: [
      {
        id: "h1",
        time: "08:16",
        hint: "Use the example card at station one to guide the next step.",
      },
    ],
    defaultTimeUsed: "16:20",
    totalTime: "40:00",
  },

  scavenger_hunt: {
    type: "scavenger_hunt",
    switcherLabel: "Scavenger Hunt",
    badgeLabel: "Adventure Experience Board",
    boardTitle: "Downtown Hunt — Scavenger Demo",
    boardSubtitle:
      "A live board for scavenger hunts, discovery games, and clue-based routes. Every found stop, unlocked clue, and shared moment becomes a replayable timeline.",
    roomLabel: "Route",
    roomName: "Downtown Loop",
    teamLabel: "Trail Squad",
    teamName: "Trail Squad",
    stageGroupLabel: "Hunt Progress",
    actionPanelTitle: "Route Actions",
    timelineTitle: "Hunt Timeline",
    outcomePanelTitle: "Clue + Outcome Panel",
    hintsPanelTitle: "Clue Log",
    expansionTitle: "Expansion Path",
    progressSummaryLabel: "stops cleared",
    progressUnitLabel: "complete",
    hintUnitLabel: "Clues Used",
    completedLabel: "Completed",
    failedLabel: "Expired",
    inProgressLabel: "In Progress",
    stageCompleteWord: "Found at",
    stageWaitingWord: "Unfound",
    fastestMetricLabel: "Fastest Found Stop",
    fastestMetricValue: "Fountain Marker",
    fastestMetricSubtext: "04:11 from hunt start",
    pressureMetricLabel: "Search Pressure Point",
    pressureMetricValue: "Historic Plaque",
    pressureMetricSubtext: "Most likely place for teams to request a clue.",
    whyItMattersText:
      "This turns a scavenger hunt into a live route story. Instead of random screenshots and messages, the whole experience becomes a single organized timeline with clear proof of progress.",
    expansionText:
      "This same board can power downtown hunts, neighborhood games, school discovery days, family challenge routes, event activations, and branded creator experiences inside HomePlanet.",
    actionPrimaryLabel: "Mark Next Stop Found",
    actionPrimaryDescription: "Advance the route and anchor the next discovery.",
    actionHintLabel: "Unlock Clue",
    actionHintDescription: "Log a clue reveal and track how teams needed help.",
    actionMomentLabel: "Add Route Moment",
    actionMomentDescription: "Capture a photo or memory from the route.",
    actionExtendLabel: "Extend Hunt Window",
    actionExtendDescription: "Add time and document why it was added.",
    primaryAdvanceEventTitle: "Stop Found",
    primaryAdvanceEventDetail: "The team found the next route checkpoint.",
    finalAdvanceEventDetail: "The team found the final stop and completed the hunt.",
    momentEventTitle: "Route Moment Captured",
    momentEventDetail: "A route photo was added to the scavenger timeline.",
    extensionEventTitle: "Hunt Window Extended",
    extensionEventDetail: "The organizer extended the hunt window for the last clue.",
    extraHintText:
      "Look for what tells the town's story. The marker is not at eye level.",
    team: [
      { id: "1", name: "Luca", role: "Map Reader", status: "guide" },
      { id: "2", name: "Chloe", role: "Clue Solver", status: "focused" },
      { id: "3", name: "Ethan", role: "Route Tracker", status: "active" },
      { id: "4", name: "Zoe", role: "Clue Caller", status: "hint-caller" },
    ],
    initialStages: [
      { id: "s1", label: "Hunt Started", solved: true, solvedAt: "00:00", icon: "entry" },
      { id: "s2", label: "Fountain Marker Found", solved: true, solvedAt: "04:11", icon: "checkpoint" },
      { id: "s3", label: "Mural Clue Solved", solved: true, solvedAt: "10:02", icon: "puzzle" },
      { id: "s4", label: "Historic Plaque Found", solved: false, icon: "door" },
      { id: "s5", label: "Final Stop Checked In", solved: false, icon: "final" },
    ],
    initialTimeline: [
      {
        id: "t1",
        time: "00:00",
        title: "Hunt Started",
        detail: "Trail Squad checked in and opened the route board.",
        tone: "neutral",
      },
      {
        id: "t2",
        time: "04:11",
        title: "Fountain Marker Found",
        detail: "The first location was confirmed on the board.",
        tone: "success",
      },
      {
        id: "t3",
        time: "07:36",
        title: "Clue Unlocked",
        detail: "A new clue was revealed for the mural stop.",
        tone: "warning",
      },
      {
        id: "t4",
        time: "10:02",
        title: "Mural Clue Solved",
        detail: "The team identified the mural symbol and advanced.",
        tone: "success",
      },
    ],
    initialHints: [
      {
        id: "h1",
        time: "07:36",
        hint: "The answer is connected to local history, not the street name.",
      },
    ],
    defaultTimeUsed: "14:18",
    totalTime: "60:00",
  },

  birthday_quest: {
    type: "birthday_quest",
    switcherLabel: "Birthday Quest",
    badgeLabel: "Celebration Experience Board",
    boardTitle: "Birthday Quest — Party Demo",
    boardSubtitle:
      "A live board for birthday adventures, party challenges, and celebration routes. Every milestone, clue, and surprise moment becomes a replayable timeline.",
    roomLabel: "Quest",
    roomName: "Birthday Adventure",
    teamLabel: "Party Crew",
    teamName: "Party Crew",
    stageGroupLabel: "Quest Progress",
    actionPanelTitle: "Party Actions",
    timelineTitle: "Quest Timeline",
    outcomePanelTitle: "Clue + Outcome Panel",
    hintsPanelTitle: "Quest Log",
    expansionTitle: "Expansion Path",
    progressSummaryLabel: "milestones cleared",
    progressUnitLabel: "complete",
    hintUnitLabel: "Clues Used",
    completedLabel: "Completed",
    failedLabel: "Expired",
    inProgressLabel: "In Progress",
    stageCompleteWord: "Reached at",
    stageWaitingWord: "Pending",
    fastestMetricLabel: "Fastest Milestone",
    fastestMetricValue: "Gift Table Clue",
    fastestMetricSubtext: "03:54 from quest start",
    pressureMetricLabel: "Party Pressure Point",
    pressureMetricValue: "Treasure Balloon",
    pressureMetricSubtext: "Most likely place to ask for a clue.",
    whyItMattersText:
      "This turns a birthday party into a structured adventure board. Parents can guide the whole celebration, capture moments, and keep the experience organized without chaos.",
    expansionText:
      "This same board can power birthday hunts, backyard party quests, family surprise reveals, cake countdown games, and kid-friendly adventure systems inside HomePlanet.",
    actionPrimaryLabel: "Mark Next Milestone",
    actionPrimaryDescription: "Advance the birthday quest and log the next celebration step.",
    actionHintLabel: "Reveal Party Clue",
    actionHintDescription: "Unlock a clue and keep the game moving smoothly.",
    actionMomentLabel: "Add Party Moment",
    actionMomentDescription: "Capture a celebration photo or surprise milestone.",
    actionExtendLabel: "Add Party Time",
    actionExtendDescription: "Extend the quest window and anchor the reason.",
    primaryAdvanceEventTitle: "Milestone Reached",
    primaryAdvanceEventDetail: "The party crew completed the next celebration step.",
    finalAdvanceEventDetail: "The party crew reached the final surprise and completed the quest.",
    momentEventTitle: "Party Moment Captured",
    momentEventDetail: "A celebration photo was added to the quest board.",
    extensionEventTitle: "Party Time Added",
    extensionEventDetail: "Extra quest time was added before the final reveal.",
    extraHintText:
      "Check the balloons again. One of them is part of the clue, not just decoration.",
    team: [
      { id: "1", name: "Lily", role: "Birthday Leader", status: "leader" },
      { id: "2", name: "Owen", role: "Clue Finder", status: "active" },
      { id: "3", name: "Harper", role: "Moment Maker", status: "focused" },
      { id: "4", name: "Leo", role: "Clue Caller", status: "hint-caller" },
    ],
    initialStages: [
      { id: "s1", label: "Quest Started", solved: true, solvedAt: "00:00", icon: "entry" },
      { id: "s2", label: "Gift Table Clue", solved: true, solvedAt: "03:54", icon: "checkpoint" },
      { id: "s3", label: "Cake Note Found", solved: true, solvedAt: "09:12", icon: "puzzle" },
      { id: "s4", label: "Treasure Balloon", solved: false, icon: "door" },
      { id: "s5", label: "Final Surprise", solved: false, icon: "final" },
    ],
    initialTimeline: [
      {
        id: "t1",
        time: "00:00",
        title: "Quest Started",
        detail: "The birthday crew opened the celebration board.",
        tone: "neutral",
      },
      {
        id: "t2",
        time: "03:54",
        title: "Gift Table Clue Found",
        detail: "The first clue sent the team toward the cake station.",
        tone: "success",
      },
      {
        id: "t3",
        time: "06:20",
        title: "Party Clue Revealed",
        detail: "A new clue was unlocked to keep the quest moving.",
        tone: "warning",
      },
      {
        id: "t4",
        time: "09:12",
        title: "Cake Note Found",
        detail: "The hidden note under the cake stand advanced the party quest.",
        tone: "success",
      },
    ],
    initialHints: [
      {
        id: "h1",
        time: "06:20",
        hint: "The next clue is near the cake, but not on the table.",
      },
    ],
    defaultTimeUsed: "12:44",
    totalTime: "35:00",
  },

  team_building: {
    type: "team_building",
    switcherLabel: "Team Building",
    badgeLabel: "Team Experience Board",
    boardTitle: "Summit Challenge — Team Demo",
    boardSubtitle:
      "A live board for company challenges, team-building exercises, and collaborative routes. Every checkpoint, support moment, and completion event becomes a replayable timeline.",
    roomLabel: "Challenge",
    roomName: "Summit Challenge",
    teamLabel: "Blue Team",
    teamName: "Blue Team",
    stageGroupLabel: "Challenge Progress",
    actionPanelTitle: "Facilitator Actions",
    timelineTitle: "Challenge Timeline",
    outcomePanelTitle: "Support + Outcome Panel",
    hintsPanelTitle: "Facilitator Log",
    expansionTitle: "Expansion Path",
    progressSummaryLabel: "checkpoints cleared",
    progressUnitLabel: "complete",
    hintUnitLabel: "Supports Used",
    completedLabel: "Completed",
    failedLabel: "Expired",
    inProgressLabel: "In Progress",
    stageCompleteWord: "Completed at",
    stageWaitingWord: "Pending",
    fastestMetricLabel: "Fastest Checkpoint",
    fastestMetricValue: "Bridge Build",
    fastestMetricSubtext: "07:08 from challenge start",
    pressureMetricLabel: "Pressure Point",
    pressureMetricValue: "Consensus Sprint",
    pressureMetricSubtext: "Most likely place for facilitator support.",
    whyItMattersText:
      "This turns a team-building event into a structured live board. Organizers can see where teams got stuck, where they moved fast, and how the whole experience played out without guesswork.",
    expansionText:
      "This same board can power company retreats, leadership exercises, staff challenges, collaborative game days, and high-trust team experiences inside HomePlanet.",
    actionPrimaryLabel: "Mark Next Checkpoint",
    actionPrimaryDescription: "Advance the team challenge and log the next completed step.",
    actionHintLabel: "Log Facilitator Support",
    actionHintDescription: "Record assistance and coaching moments on the board.",
    actionMomentLabel: "Add Team Moment",
    actionMomentDescription: "Capture a team milestone or shared win.",
    actionExtendLabel: "Add Session Time",
    actionExtendDescription: "Extend the exercise window and anchor the reason.",
    primaryAdvanceEventTitle: "Checkpoint Completed",
    primaryAdvanceEventDetail: "The team completed the next collaborative checkpoint.",
    finalAdvanceEventDetail: "The team completed the final checkpoint and finished the challenge.",
    momentEventTitle: "Team Moment Captured",
    momentEventDetail: "A team milestone photo was pinned to the board.",
    extensionEventTitle: "Session Time Added",
    extensionEventDetail: "The facilitator added more time for the final checkpoint.",
    extraHintText:
      "Pause and assign one speaker. The solution depends on alignment, not speed.",
    team: [
      { id: "1", name: "Alex", role: "Coordinator", status: "leader" },
      { id: "2", name: "Priya", role: "Strategist", status: "focused" },
      { id: "3", name: "Marcus", role: "Builder", status: "active" },
      { id: "4", name: "Nina", role: "Support Caller", status: "hint-caller" },
    ],
    initialStages: [
      { id: "s1", label: "Challenge Started", solved: true, solvedAt: "00:00", icon: "entry" },
      { id: "s2", label: "Bridge Build", solved: true, solvedAt: "07:08", icon: "team" },
      { id: "s3", label: "Signal Relay", solved: true, solvedAt: "13:41", icon: "checkpoint" },
      { id: "s4", label: "Consensus Sprint", solved: false, icon: "lock" },
      { id: "s5", label: "Final Alignment", solved: false, icon: "final" },
    ],
    initialTimeline: [
      {
        id: "t1",
        time: "00:00",
        title: "Challenge Started",
        detail: "Blue Team checked into the team-building board.",
        tone: "neutral",
      },
      {
        id: "t2",
        time: "07:08",
        title: "Bridge Build Complete",
        detail: "The team cleared the first collaboration exercise.",
        tone: "success",
      },
      {
        id: "t3",
        time: "10:36",
        title: "Facilitator Support Logged",
        detail: "A prompt was given to improve communication flow.",
        tone: "warning",
      },
      {
        id: "t4",
        time: "13:41",
        title: "Signal Relay Complete",
        detail: "The team coordinated the relay successfully.",
        tone: "success",
      },
    ],
    initialHints: [
      {
        id: "h1",
        time: "10:36",
        hint: "Choose one speaker first, then assign the next step clearly.",
      },
    ],
    defaultTimeUsed: "19:24",
    totalTime: "50:00",
  },

  haunted_route: {
    type: "haunted_route",
    switcherLabel: "Haunted Route",
    badgeLabel: "Haunt Experience Board",
    boardTitle: "Night Route — Haunted Demo",
    boardSubtitle:
      "A live board for haunted paths, scare routes, and dark experience flows. Every checkpoint, clue, and final outcome becomes a replayable timeline.",
    roomLabel: "Route",
    roomName: "Night Route",
    teamLabel: "Night Shift",
    teamName: "Night Shift",
    stageGroupLabel: "Route Progress",
    actionPanelTitle: "Operator Actions",
    timelineTitle: "Route Timeline",
    outcomePanelTitle: "Clue + Outcome Panel",
    hintsPanelTitle: "Operator Log",
    expansionTitle: "Expansion Path",
    progressSummaryLabel: "zones cleared",
    progressUnitLabel: "complete",
    hintUnitLabel: "Clues Used",
    completedLabel: "Completed",
    failedLabel: "Expired",
    inProgressLabel: "In Progress",
    stageCompleteWord: "Cleared at",
    stageWaitingWord: "Waiting",
    fastestMetricLabel: "Fastest Cleared Zone",
    fastestMetricValue: "Entry Corridor",
    fastestMetricSubtext: "02:48 from route start",
    pressureMetricLabel: "Pressure Point",
    pressureMetricValue: "Basement Door",
    pressureMetricSubtext: "Most likely place for operator support.",
    whyItMattersText:
      "This turns a haunted route into a live operations board. Organizers can track where groups slow down, where support was needed, and how the full scare path unfolded.",
    expansionText:
      "This same board can power haunted houses, dark walk-through routes, seasonal attractions, thrill-based story experiences, and creator-made suspense events inside HomePlanet.",
    actionPrimaryLabel: "Mark Next Zone Cleared",
    actionPrimaryDescription: "Advance the haunted route and anchor the next checkpoint.",
    actionHintLabel: "Reveal Route Clue",
    actionHintDescription: "Track support and clue drops when guests need help.",
    actionMomentLabel: "Add Route Moment",
    actionMomentDescription: "Capture a scare moment or milestone memory.",
    actionExtendLabel: "Add Route Time",
    actionExtendDescription: "Extend the route window and record why it changed.",
    primaryAdvanceEventTitle: "Zone Cleared",
    primaryAdvanceEventDetail: "The group cleared the next route zone.",
    finalAdvanceEventDetail: "The group cleared the final zone and completed the route.",
    momentEventTitle: "Route Moment Captured",
    momentEventDetail: "A haunted route moment was added to the session board.",
    extensionEventTitle: "Route Time Added",
    extensionEventDetail: "The operator added extra time for the final scare sequence.",
    extraHintText:
      "The next path is marked by sound, not light. Listen before moving.",
    team: [
      { id: "1", name: "Jace", role: "Route Lead", status: "leader" },
      { id: "2", name: "Ruby", role: "Clue Watch", status: "focused" },
      { id: "3", name: "Kai", role: "Zone Tracker", status: "active" },
      { id: "4", name: "Skye", role: "Support Caller", status: "hint-caller" },
    ],
    initialStages: [
      { id: "s1", label: "Route Started", solved: true, solvedAt: "00:00", icon: "entry" },
      { id: "s2", label: "Entry Corridor", solved: true, solvedAt: "02:48", icon: "checkpoint" },
      { id: "s3", label: "Mirror Passage", solved: true, solvedAt: "08:17", icon: "door" },
      { id: "s4", label: "Basement Door", solved: false, icon: "lock" },
      { id: "s5", label: "Final Exit", solved: false, icon: "final" },
    ],
    initialTimeline: [
      {
        id: "t1",
        time: "00:00",
        title: "Route Started",
        detail: "Night Shift entered the haunted route board.",
        tone: "neutral",
      },
      {
        id: "t2",
        time: "02:48",
        title: "Entry Corridor Cleared",
        detail: "The first dark zone was cleared successfully.",
        tone: "success",
      },
      {
        id: "t3",
        time: "05:10",
        title: "Route Clue Revealed",
        detail: "A support clue was dropped before the mirror passage.",
        tone: "warning",
      },
      {
        id: "t4",
        time: "08:17",
        title: "Mirror Passage Cleared",
        detail: "The group moved through the mirror zone and advanced.",
        tone: "success",
      },
    ],
    initialHints: [
      {
        id: "h1",
        time: "05:10",
        hint: "Listen for the direction change before entering the next zone.",
      },
    ],
    defaultTimeUsed: "11:52",
    totalTime: "30:00",
  },
};

function getExperienceIcon(type: ExperienceType) {
  switch (type) {
    case "escape_room":
      return <Lock className="h-4 w-4" />;
    case "classroom_challenge":
      return <GraduationCap className="h-4 w-4" />;
    case "scavenger_hunt":
      return <Search className="h-4 w-4" />;
    case "birthday_quest":
      return <PartyPopper className="h-4 w-4" />;
    case "team_building":
      return <Users className="h-4 w-4" />;
    case "haunted_route":
      return <Trees className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
}

function getStageIcon(icon: PuzzleStage["icon"]) {
  switch (icon) {
    case "entry":
      return <MapPin className="h-4 w-4" />;
    case "puzzle":
      return <Sparkles className="h-4 w-4" />;
    case "door":
      return <KeyRound className="h-4 w-4" />;
    case "lock":
      return <Lock className="h-4 w-4" />;
    case "final":
      return <Trophy className="h-4 w-4" />;
    case "checkpoint":
      return <CheckCircle2 className="h-4 w-4" />;
    case "team":
      return <Users className="h-4 w-4" />;
    default:
      return <CheckCircle2 className="h-4 w-4" />;
  }
}

function toneClasses(tone?: TimelineEvent["tone"]) {
  if (tone === "success") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-100";
  }
  if (tone === "warning") {
    return "border-amber-400/30 bg-amber-500/10 text-amber-100";
  }
  return "border-cyan-400/20 bg-white/5 text-slate-100";
}

function toneChipClasses(tone?: TimelineEvent["tone"]) {
  if (tone === "success") {
    return "border-emerald-400/25 bg-emerald-500/12 text-emerald-200";
  }
  if (tone === "warning") {
    return "border-amber-400/25 bg-amber-500/12 text-amber-200";
  }
  return "border-cyan-400/25 bg-cyan-500/12 text-cyan-200";
}

function memberStatusClasses(status: TeamMemberStatus) {
  if (status === "focused") {
    return "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30";
  }
  if (status === "hint-caller") {
    return "bg-fuchsia-500/15 text-fuchsia-200 ring-1 ring-fuchsia-400/30";
  }
  if (status === "guide") {
    return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30";
  }
  if (status === "leader") {
    return "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/30";
  }
  return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30";
}

function statusLabelText(status: BoardStatus, config: ExperienceConfig) {
  if (status === "completed") return config.completedLabel;
  if (status === "failed") return config.failedLabel;
  return config.inProgressLabel;
}

function buildStageDrawerData(
  config: ExperienceConfig,
  stage: PuzzleStage,
  hints: HintLog[],
  timeline: TimelineEvent[],
): StageDrawerData {
  const lower = stage.label.toLowerCase();

  const defaultOwner = config.team[Math.min(config.team.length - 1, 0)];
  let owner = defaultOwner;
  let description = `${stage.label} is part of the current ${config.switcherLabel.toLowerCase()} flow and is anchored inside the live board timeline.`;
  let note =
    "No extra note has been attached yet. This drawer is showing the clean static demo depth for the stage.";
  let attachmentLabel = "No attached moment yet";
  let linkedTimeline =
    timeline.find((event) =>
      event.title.toLowerCase().includes(stage.label.toLowerCase().split(" ")[0]),
    ) || timeline[Math.max(0, timeline.length - 1)];
  let supportUsed =
    hints.length > 0 &&
    (lower.includes("lock") ||
      lower.includes("fraction") ||
      lower.includes("historic") ||
      lower.includes("treasure") ||
      lower.includes("consensus") ||
      lower.includes("basement"));
  let supportLabel = supportUsed
    ? "Support or hint was used near this stage."
    : "No support was logged for this stage yet.";

  switch (config.type) {
    case "escape_room":
      if (lower.includes("entered")) {
        owner = config.team[0];
        description =
          "The room officially started here. Presence anchored the session and started the puzzle flow.";
        note = "This is the origin stage that proves when the team entered the experience.";
        attachmentLabel = "Entry scan / room-start proof";
      } else if (lower.includes("breaker")) {
        owner = config.team[1];
        description =
          "The team matched the voltage sequence and opened the breaker panel to unlock the next chain.";
        note = "This is the fastest cleared stage on the board and shows early momentum.";
        attachmentLabel = "Panel photo or breaker note";
      } else if (lower.includes("drawer")) {
        owner = config.team[0];
        description =
          "A hidden compartment was discovered after the clue chain narrowed the wall position.";
        note = "This is the discovery pivot that moves the room from searching into decoding.";
        attachmentLabel = "Hidden drawer reveal moment";
      } else if (lower.includes("cipher")) {
        owner = config.team[2];
        description =
          "This is the pressure stage where the team must translate the code sequence correctly.";
        note = "This is the most likely stage for a hint request or escalation from the game master.";
        attachmentLabel = "Cipher wheel reference";
      } else if (lower.includes("vault")) {
        owner = config.team[2];
        description = "The final vault stage closes the experience and determines the board outcome.";
        note = "When this stage clears, the board status flips from in progress to escaped.";
        attachmentLabel = "Final vault completion moment";
      }
      break;

    case "classroom_challenge":
      if (lower.includes("challenge started")) {
        owner = config.team[0];
        description =
          "The classroom challenge opened and the group was anchored into the learning board.";
        note = "This is the origin checkpoint for the student flow and teacher visibility.";
        attachmentLabel = "Challenge launch note";
      } else if (lower.includes("vocabulary")) {
        owner = config.team[1];
        description =
          "Students completed the vocabulary sprint and moved into the next reading checkpoint.";
        note = "This is the fastest completed station and helps show where the group started strong.";
        attachmentLabel = "Vocabulary station sample";
      } else if (lower.includes("reading")) {
        owner = config.team[1];
        description =
          "The group matched passage evidence and proved reading comprehension through a structured task.";
        note = "This stage shows teacher-guided progression without paper tracking.";
        attachmentLabel = "Reading evidence card";
      } else if (lower.includes("fraction")) {
        owner = config.team[2];
        description =
          "Fraction Lab is the main support-focus station where guidance is most likely to be needed.";
        note = "This is the best example of how the board can surface intervention points.";
        attachmentLabel = "Fraction model or whiteboard snapshot";
      } else if (lower.includes("reflection")) {
        owner = config.team[3];
        description =
          "Reflection Exit is the final wrap-up station where students summarize what they learned.";
        note = "This stage closes the loop and would later connect well to teacher review flows.";
        attachmentLabel = "Reflection exit response";
      }
      break;

    case "scavenger_hunt":
      if (lower.includes("hunt started")) {
        owner = config.team[0];
        description =
          "The route was opened and the team checked into the board before the first clue path.";
        note = "This is the hunt origin point and the clean starting anchor for the route story.";
        attachmentLabel = "Check-in proof";
      } else if (lower.includes("fountain")) {
        owner = config.team[0];
        description =
          "The first route stop was found and confirmed by the team on the board.";
        note =
          "This shows how location discovery becomes a real tracked event, not just a random photo.";
        attachmentLabel = "Fountain marker photo";
      } else if (lower.includes("mural")) {
        owner = config.team[1];
        description =
          "The mural clue was solved by identifying the correct symbol sequence on-site.";
        note = "This is a strong middle-stage example of clue-solving and public replay.";
        attachmentLabel = "Mural clue snapshot";
      } else if (lower.includes("historic")) {
        owner = config.team[2];
        description =
          "Historic Plaque Found is the pressure point where the team often needs a clue to continue.";
        note = "This is the best demo stage for clue unlocking inside the hunt system.";
        attachmentLabel = "Historic plaque marker note";
      } else if (lower.includes("final")) {
        owner = config.team[3];
        description = "The final stop is the completion checkpoint for the full scavenger route.";
        note = "This would later pair well with public completion links and final proof sharing.";
        attachmentLabel = "Final check-in proof";
      }
      break;

    case "birthday_quest":
      if (lower.includes("quest started")) {
        owner = config.team[0];
        description =
          "The birthday route started and the celebration flow was anchored into the board.";
        note = "This gives parents and hosts a clean live starting point for the party.";
        attachmentLabel = "Quest start moment";
      } else if (lower.includes("gift")) {
        owner = config.team[1];
        description =
          "The first celebration clue was discovered near the gift zone and pushed the quest forward.";
        note = "This is the fastest milestone and works great as an early party momentum signal.";
        attachmentLabel = "Gift table clue photo";
      } else if (lower.includes("cake")) {
        owner = config.team[2];
        description =
          "The team found the hidden cake note and unlocked the next surprise branch.";
        note = "This is a strong middle-stage celebration reveal.";
        attachmentLabel = "Cake station reveal moment";
      } else if (lower.includes("treasure")) {
        owner = config.team[1];
        description =
          "Treasure Balloon is the pressure-point milestone where kids are most likely to need a clue.";
        note = "This is where the quest can stay fun without slipping into chaos.";
        attachmentLabel = "Treasure balloon clue";
      } else if (lower.includes("final")) {
        owner = config.team[0];
        description =
          "The final surprise closes the quest and gives the full party board a satisfying ending.";
        note = "This is where the board turns into a replayable birthday story.";
        attachmentLabel = "Final surprise photo";
      }
      break;

    case "team_building":
      if (lower.includes("challenge started")) {
        owner = config.team[0];
        description =
          "The team checked into the collaborative exercise and anchored the session start.";
        note = "This gives the facilitator a clean origin moment for the full challenge.";
        attachmentLabel = "Session check-in";
      } else if (lower.includes("bridge")) {
        owner = config.team[2];
        description =
          "Bridge Build was the first completed collaboration checkpoint and shows fast coordination.";
        note = "This is the fastest checkpoint and a strong proof of team momentum.";
        attachmentLabel = "Bridge build snapshot";
      } else if (lower.includes("signal")) {
        owner = config.team[1];
        description =
          "Signal Relay required coordination and trust across the group before advancing.";
        note =
          "This stage demonstrates how action-based team progress can be replayed later.";
        attachmentLabel = "Relay coordination note";
      } else if (lower.includes("consensus")) {
        owner = config.team[0];
        description =
          "Consensus Sprint is the pressure point where facilitation matters most.";
        note = "This is the best example of support logging inside a team experience board.";
        attachmentLabel = "Consensus alignment note";
      } else if (lower.includes("final")) {
        owner = config.team[3];
        description =
          "Final Alignment closes the collaborative route and sets the board to completed.";
        note = "This final checkpoint would later support team recap or leadership review.";
        attachmentLabel = "Final alignment summary";
      }
      break;

    case "haunted_route":
      if (lower.includes("route started")) {
        owner = config.team[0];
        description =
          "The group entered the haunted route and the experience start was anchored immediately.";
        note = "This is the operational start point for the full scare path.";
        attachmentLabel = "Route start proof";
      } else if (lower.includes("entry corridor")) {
        owner = config.team[1];
        description =
          "The first dark zone was cleared and the group advanced into the route.";
        note = "This is the fastest cleared zone and a strong early pacing signal.";
        attachmentLabel = "Entry corridor checkpoint";
      } else if (lower.includes("mirror")) {
        owner = config.team[2];
        description =
          "Mirror Passage is the mid-route transition where guests confirm progress through the scare flow.";
        note =
          "This stage shows how suspense routes can become replayable operating boards.";
        attachmentLabel = "Mirror passage moment";
      } else if (lower.includes("basement")) {
        owner = config.team[3];
        description =
          "Basement Door is the biggest pressure-point zone and often needs operator support.";
        note = "This is the best stage for showing clue drops or route intervention.";
        attachmentLabel = "Basement clue note";
      } else if (lower.includes("final")) {
        owner = config.team[0];
        description = "Final Exit closes the route and determines the full haunt outcome.";
        note = "This is the completion stage that makes the route shareable as a full story.";
        attachmentLabel = "Final exit proof";
      }
      break;
  }

  return {
    stageId: stage.id,
    title: stage.label,
    description,
    ownerName: owner.name,
    ownerRole: owner.role,
    supportUsed,
    supportLabel,
    linkedTimelineTitle: linkedTimeline?.title ?? "Linked Timeline Event",
    linkedTimelineTime: linkedTimeline?.time ?? "--:--",
    linkedTimelineDetail: linkedTimeline?.detail ?? "No linked timeline detail found yet.",
    note,
    attachmentLabel,
  };
}

function findLinkedStageLabel(event: TimelineEvent, stages: PuzzleStage[], config: ExperienceConfig) {
  const eventLower = `${event.title} ${event.detail}`.toLowerCase();

  const match = stages.find((stage) => {
    const words = stage.label.toLowerCase().split(" ");
    return words.some((word) => word.length > 3 && eventLower.includes(word));
  });

  if (match) {
    return match;
  }

  if (eventLower.includes("hint") || eventLower.includes("support") || eventLower.includes("clue")) {
    const pressure = stages.find(
      (stage) =>
        stage.label.toLowerCase().includes(config.pressureMetricValue.toLowerCase().split(" ")[0]) ||
        stage.label.toLowerCase() === config.pressureMetricValue.toLowerCase(),
    );
    if (pressure) return pressure;
  }

  if (eventLower.includes("started")) {
    return stages[0];
  }

  return stages[Math.max(0, stages.length - 1)];
}

function buildTimelineDrawerData(
  config: ExperienceConfig,
  event: TimelineEvent,
  stages: PuzzleStage[],
  hints: HintLog[],
): TimelineDrawerData {
  const linkedStage = findLinkedStageLabel(event, stages, config);
  const lower = `${event.title} ${event.detail}`.toLowerCase();

  let triggeredBy = config.team[0];
  let eventTypeLabel = "System Event";
  let sourceLabel = "System anchored";
  let reasonLabel = "This event was recorded as part of the live board flow.";
  let note = "This event contributes to the replayable truth layer for the experience.";
  let attachmentLabel = "No attachment linked yet";

  if (lower.includes("hint") || lower.includes("support") || lower.includes("clue")) {
    triggeredBy = config.team[Math.min(config.team.length - 1, 3)];
    eventTypeLabel = "Support Event";
    sourceLabel = "Support-driven";
    reasonLabel = "This event happened because the group needed help, guidance, or a clue.";
    note = hints.length > 0 ? `Latest support note: ${hints[hints.length - 1].hint}` : note;
    attachmentLabel = "Support note / clue reference";
  } else if (lower.includes("moment") || lower.includes("photo")) {
    triggeredBy = config.team[Math.min(config.team.length - 1, 2)];
    eventTypeLabel = "Captured Moment";
    sourceLabel = "Manual add";
    reasonLabel = "This event was added to preserve a visible milestone or memory.";
    note = "Moment events make the board feel like a replayable story, not just an operations log.";
    attachmentLabel = "Attached photo or celebration moment";
  } else if (lower.includes("time") || lower.includes("extended") || lower.includes("extension")) {
    triggeredBy = config.team[0];
    eventTypeLabel = "Time Adjustment";
    sourceLabel = "Operator action";
    reasonLabel = "This event changed the time conditions of the experience.";
    note = "Time-adjustment events are important because they explain why pacing changed.";
    attachmentLabel = "Time extension note";
  } else if (lower.includes("started")) {
    triggeredBy = config.team[0];
    eventTypeLabel = "Origin Event";
    sourceLabel = "Presence anchored";
    reasonLabel = "This is the origin point that proves when the experience began.";
    note = "Origin events are the first truth anchor for the entire board session.";
    attachmentLabel = "Start proof / origin event";
  } else {
    triggeredBy = config.team[Math.min(config.team.length - 1, 1)];
    eventTypeLabel = event.tone === "success" ? "Progress Event" : "Board Event";
    sourceLabel = event.tone === "success" ? "Stage advancement" : "Board activity";
    reasonLabel = "This event reflects an important change in progress on the board.";
    note = "Progress events help explain how the experience unfolded step by step.";
    attachmentLabel = "Linked progress moment";
  }

  return {
    eventId: event.id,
    title: event.title,
    time: event.time,
    detail: event.detail,
    tone: event.tone ?? "neutral",
    eventTypeLabel,
    sourceLabel,
    triggeredByName: triggeredBy.name,
    triggeredByRole: triggeredBy.role,
    linkedStageLabel: linkedStage?.label ?? "No linked stage",
    linkedStageStatus: linkedStage?.solved ? "Completed" : "Pending",
    reasonLabel,
    note,
    attachmentLabel,
  };
}

export default function EscapeBoardDemo() {
  const [experienceType, setExperienceType] = useState<ExperienceType>("escape_room");

  const config = EXPERIENCE_CONFIGS[experienceType];

  const [status, setStatus] = useState<BoardStatus>("in_progress");
  const [stages, setStages] = useState<PuzzleStage[]>(config.initialStages);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(config.initialTimeline);
  const [hints, setHints] = useState<HintLog[]>(config.initialHints);
  const [timeUsed, setTimeUsed] = useState(config.defaultTimeUsed);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);

  const solvedCount = useMemo(() => stages.filter((stage) => stage.solved).length, [stages]);
  const progressPercent = Math.round((solvedCount / stages.length) * 100);

  const boardStatusLabel = useMemo(() => statusLabelText(status, config), [status, config]);

  const boardStatusClasses = useMemo(() => {
    if (status === "completed") {
      return "border-emerald-400/30 bg-emerald-500/15 text-emerald-200";
    }
    if (status === "failed") {
      return "border-red-400/30 bg-red-500/15 text-red-200";
    }
    return "border-cyan-400/30 bg-cyan-500/15 text-cyan-200";
  }, [status]);

  const selectedStage =
    activeDrawer?.type === "stage"
      ? stages.find((stage) => stage.id === activeDrawer.id) ?? null
      : null;

  const selectedTimelineEvent =
    activeDrawer?.type === "timeline"
      ? timeline.find((event) => event.id === activeDrawer.id) ?? null
      : null;

  const selectedStageDetail = useMemo(() => {
    if (!selectedStage) return null;
    return buildStageDrawerData(config, selectedStage, hints, timeline);
  }, [config, selectedStage, hints, timeline]);

  const selectedTimelineDetail = useMemo(() => {
    if (!selectedTimelineEvent) return null;
    return buildTimelineDrawerData(config, selectedTimelineEvent, stages, hints);
  }, [config, selectedTimelineEvent, stages, hints]);

  const loadExperience = (nextType: ExperienceType) => {
    const nextConfig = EXPERIENCE_CONFIGS[nextType];
    setExperienceType(nextType);
    setStatus("in_progress");
    setStages(nextConfig.initialStages);
    setTimeline(nextConfig.initialTimeline);
    setHints(nextConfig.initialHints);
    setTimeUsed(nextConfig.defaultTimeUsed);
    setActiveDrawer(null);
  };

  const addTimelineEvent = (event: TimelineEvent) => {
    setTimeline((current) => [...current, event]);
  };

  const markNextStageSolved = () => {
    const nextIndex = stages.findIndex((stage) => !stage.solved);
    if (nextIndex === -1) return;

    const fallbackTimes = ["18:46", "24:18", "29:42", "33:10"];
    const nextTime = fallbackTimes[Math.min(nextIndex, fallbackTimes.length - 1)];

    setStages((current) =>
      current.map((stage, index) =>
        index === nextIndex
          ? {
              ...stage,
              solved: true,
              solvedAt: nextTime,
            }
          : stage,
      ),
    );

    const newEvent = {
      id: `timeline-${Date.now()}`,
      time: nextTime,
      title: stages[nextIndex].label,
      detail:
        nextIndex === stages.length - 1
          ? config.finalAdvanceEventDetail
          : config.primaryAdvanceEventDetail,
      tone: "success" as const,
    };

    addTimelineEvent(newEvent);

    if (nextIndex === stages.length - 1) {
      setStatus("completed");
      setTimeUsed(nextTime);
    }
  };

  const requestHint = () => {
    const hintTime = "20:12";
    const nextHint = {
      id: `hint-${Date.now()}`,
      time: hintTime,
      hint: config.extraHintText,
    };

    setHints((current) => [...current, nextHint]);
    addTimelineEvent({
      id: `timeline-hint-${Date.now()}`,
      time: hintTime,
      title: config.actionHintLabel,
      detail: nextHint.hint,
      tone: "warning",
    });
  };

  const addMoment = () => {
    addTimelineEvent({
      id: `timeline-moment-${Date.now()}`,
      time: "21:03",
      title: config.momentEventTitle,
      detail: config.momentEventDetail,
      tone: "neutral",
    });
  };

  const extendTime = () => {
    addTimelineEvent({
      id: `timeline-extend-${Date.now()}`,
      time: "22:10",
      title: config.extensionEventTitle,
      detail: config.extensionEventDetail,
      tone: "warning",
    });
  };

  const resetDemo = () => {
    setStatus("in_progress");
    setStages(config.initialStages);
    setTimeline(config.initialTimeline);
    setHints(config.initialHints);
    setTimeUsed(config.defaultTimeUsed);
    setActiveDrawer(null);
  };

  const isDrawerOpen = activeDrawer !== null;

  return (
    <div className="min-h-screen bg-[#061018] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />

      {isDrawerOpen && (
        <button
          type="button"
          aria-label="Close detail"
          className="fixed inset-0 z-40 cursor-default bg-black/75 backdrop-blur-[8px] transition"
          onClick={() => setActiveDrawer(null)}
        />
      )}

      <div
        className={`relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 transition duration-300 sm:px-6 lg:px-8 ${
          isDrawerOpen ? "scale-[0.992] opacity-70 blur-[1px]" : ""
        }`}
      >
        <header className="overflow-hidden rounded-[28px] border border-cyan-400/20 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                      <Flame className="h-3.5 w-3.5" />
                      {config.badgeLabel}
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${boardStatusClasses}`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {boardStatusLabel}
                    </span>
                  </div>

                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {config.boardTitle}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
                      {config.boardSubtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      Time Used
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">{timeUsed}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <TimerReset className="h-3.5 w-3.5" />
                      Time Limit
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">{config.totalTime}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      Team Size
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">
                      {config.team.length}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <MessageSquareMore className="h-3.5 w-3.5" />
                      {config.hintUnitLabel}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">{hints.length}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Experience Type
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Object.keys(EXPERIENCE_CONFIGS) as ExperienceType[]).map((type) => {
                    const item = EXPERIENCE_CONFIGS[type];
                    const active = type === experienceType;

                    return (
                      <button
                        key={type}
                        onClick={() => loadExperience(type)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                          active
                            ? "border-cyan-400/35 bg-cyan-500/15 text-cyan-200"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {getExperienceIcon(type)}
                        {item.switcherLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[24px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/80">
                    {config.stageGroupLabel}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    {solvedCount} of {stages.length} {config.progressSummaryLabel}
                  </h2>
                </div>
                <div className="text-sm text-slate-300">
                  {progressPercent}% {config.progressUnitLabel}
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {stages.map((stage) => {
                  const isSelected = activeDrawer?.type === "stage" && activeDrawer.id === stage.id;

                  return (
                    <button
                      type="button"
                      key={stage.id}
                      onClick={() => setActiveDrawer({ type: "stage", id: stage.id })}
                      className={`group relative rounded-2xl border p-4 text-left transition duration-200 ${
                        stage.solved
                          ? "border-emerald-400/25 bg-emerald-500/10 hover:bg-emerald-500/16"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      } ${
                        isSelected
                          ? "border-cyan-300/60 bg-cyan-500/14 shadow-[0_0_0_1px_rgba(103,232,249,0.18),0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-cyan-300/40"
                          : "shadow-none"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                          <PanelRightOpen className="h-3 w-3" />
                          Selected
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3 pr-14">
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                              stage.solved
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-white/10 text-slate-300"
                            }`}
                          >
                            {getStageIcon(stage.icon)}
                          </span>
                          <span>{stage.label}</span>
                        </div>

                        {!isSelected && (
                          <div className="flex items-center gap-2 opacity-80 transition group-hover:opacity-100">
                            <PanelRightOpen className="h-4 w-4 text-slate-400" />
                            {stage.solved ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-slate-500" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                        {stage.solved
                          ? `${config.stageCompleteWord} ${stage.solvedAt}`
                          : config.stageWaitingWord}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {config.roomLabel}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{config.roomName}</h2>
                </div>
                <span className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200">
                  {config.teamLabel}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {config.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{member.name}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {member.role}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${memberStatusClasses(member.status)}`}
                    >
                      {member.status.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Control Panel</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{config.actionPanelTitle}</h2>
              </div>
              <Siren className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="mt-5 grid gap-3">
              <button
                onClick={markNextStageSolved}
                className="rounded-2xl border border-emerald-400/25 bg-emerald-500/12 px-4 py-4 text-left transition hover:bg-emerald-500/18"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {config.actionPrimaryLabel}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      {config.actionPrimaryDescription}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={requestHint}
                className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-4 text-left transition hover:bg-amber-500/16"
              >
                <div className="flex items-center gap-3">
                  <MessageSquareMore className="h-5 w-5 text-amber-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">{config.actionHintLabel}</div>
                    <div className="mt-1 text-sm text-slate-300">
                      {config.actionHintDescription}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={addMoment}
                className="rounded-2xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-4 text-left transition hover:bg-cyan-500/16"
              >
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-cyan-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {config.actionMomentLabel}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      {config.actionMomentDescription}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={extendTime}
                className="rounded-2xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-4 text-left transition hover:bg-fuchsia-500/16"
              >
                <div className="flex items-center gap-3">
                  <TimerReset className="h-5 w-5 text-fuchsia-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {config.actionExtendLabel}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      {config.actionExtendDescription}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={resetDemo}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <TimerReset className="h-5 w-5 text-slate-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">Reset Demo</div>
                    <div className="mt-1 text-sm text-slate-300">
                      Restore the board to the original staged example.
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 rounded-[24px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-transparent p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                Why It Matters
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{config.whyItMattersText}</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Truth Layer</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{config.timelineTitle}</h2>
              </div>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                Anchored Moments
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {timeline.map((event) => {
                const isSelected = activeDrawer?.type === "timeline" && activeDrawer.id === event.id;

                return (
                  <button
                    type="button"
                    key={event.id}
                    onClick={() => setActiveDrawer({ type: "timeline", id: event.id })}
                    className={`w-full rounded-2xl border p-4 text-left transition ${toneClasses(
                      event.tone,
                    )} ${
                      isSelected
                        ? "ring-1 ring-cyan-300/40 border-cyan-300/45 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="pr-3">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-slate-300" />
                          <div className="text-sm font-semibold text-white">{event.title}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-300">{event.detail}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {!isSelected && <PanelRightOpen className="h-4 w-4 text-slate-400" />}
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Session Insight</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{config.outcomePanelTitle}</h2>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">Current Outcome</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${boardStatusClasses}`}
                >
                  {boardStatusLabel}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {config.fastestMetricLabel}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {config.fastestMetricValue}
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    {config.fastestMetricSubtext}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {config.pressureMetricLabel}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {config.pressureMetricValue}
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    {config.pressureMetricSubtext}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4">
              <div className="flex items-center gap-2">
                <MessageSquareMore className="h-4 w-4 text-amber-300" />
                <h3 className="text-sm font-semibold text-white">{config.hintsPanelTitle}</h3>
              </div>

              <div className="mt-3 space-y-3">
                {hints.map((hint) => (
                  <div
                    key={hint.id}
                    className="rounded-2xl border border-amber-400/20 bg-black/15 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                        {hint.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200">{hint.hint}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <h3 className="text-sm font-semibold text-white">{config.expansionTitle}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{config.expansionText}</p>
            </div>
          </section>
        </div>
      </div>

      <aside
        className={`fixed inset-y-3 left-3 right-3 z-50 transform rounded-[30px] border border-cyan-300/20 bg-[#07131d]/96 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-300 md:left-auto md:right-4 md:w-full md:max-w-[470px] ${
          isDrawerOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-[108%] opacity-0"
        }`}
      >
        {activeDrawer?.type === "stage" && selectedStage && selectedStageDetail && (
          <div className="flex h-full max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden">
            <div className="border-b border-white/10 bg-gradient-to-b from-cyan-500/8 to-transparent px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      {getStageIcon(selectedStage.icon)}
                      Stage Detail
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        selectedStage.solved
                          ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-200"
                          : "border-slate-500/30 bg-white/5 text-slate-300"
                      }`}
                    >
                      {selectedStage.solved ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                    {selectedStage.label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {selectedStageDetail.description}
                  </p>

                  <div className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {selectedStage.solved
                      ? `${config.stageCompleteWord} ${selectedStage.solvedAt}`
                      : config.stageWaitingWord}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {selectedStage.solved ? "Completed" : "Pending"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Time</div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {selectedStage.solved
                      ? `${config.stageCompleteWord} ${selectedStage.solvedAt}`
                      : config.stageWaitingWord}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-cyan-300" />
                  <div className="text-sm font-semibold text-white">Primary Owner</div>
                </div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-semibold text-white">
                    {selectedStageDetail.ownerName}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {selectedStageDetail.ownerRole}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <MessageSquareMore className="h-4 w-4 text-amber-300" />
                  <div className="text-sm font-semibold text-white">Support Signal</div>
                </div>
                <div
                  className={`mt-3 rounded-2xl border p-3 ${
                    selectedStageDetail.supportUsed
                      ? "border-amber-400/20 bg-amber-500/10"
                      : "border-emerald-400/20 bg-emerald-500/10"
                  }`}
                >
                  <div className="text-sm text-slate-200">{selectedStageDetail.supportLabel}</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-cyan-300" />
                  <div className="text-sm font-semibold text-white">Linked Timeline Event</div>
                </div>

                <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">
                      {selectedStageDetail.linkedTimelineTitle}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      {selectedStageDetail.linkedTimelineTime}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {selectedStageDetail.linkedTimelineDetail}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-fuchsia-300" />
                  <div className="text-sm font-semibold text-white">Board Note</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{selectedStageDetail.note}</p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-cyan-300" />
                  <div className="text-sm font-semibold text-white">Attached Moment</div>
                </div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                  {selectedStageDetail.attachmentLabel}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDrawer?.type === "timeline" && selectedTimelineEvent && selectedTimelineDetail && (
          <div className="flex h-full max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden">
            <div className="border-b border-white/10 bg-gradient-to-b from-cyan-500/8 to-transparent px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      <History className="h-3.5 w-3.5" />
                      Timeline Detail
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${toneChipClasses(
                        selectedTimelineDetail.tone,
                      )}`}
                    >
                      {selectedTimelineDetail.eventTypeLabel}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                    {selectedTimelineDetail.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {selectedTimelineDetail.detail}
                  </p>

                  <div className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                    Anchored at {selectedTimelineDetail.time}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Time</div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {selectedTimelineDetail.time}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Source</div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {selectedTimelineDetail.sourceLabel}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-cyan-300" />
                  <div className="text-sm font-semibold text-white">Triggered By</div>
                </div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-semibold text-white">
                    {selectedTimelineDetail.triggeredByName}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {selectedTimelineDetail.triggeredByRole}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-cyan-300" />
                  <div className="text-sm font-semibold text-white">Linked Stage</div>
                </div>
                <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">
                      {selectedTimelineDetail.linkedStageLabel}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      {selectedTimelineDetail.linkedStageStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-amber-300" />
                  <div className="text-sm font-semibold text-white">Why It Happened</div>
                </div>
                <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-slate-200">
                  {selectedTimelineDetail.reasonLabel}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-fuchsia-300" />
                  <div className="text-sm font-semibold text-white">Board Note</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {selectedTimelineDetail.note}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-cyan-300" />
                  <div className="text-sm font-semibold text-white">Attached Moment</div>
                </div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                  {selectedTimelineDetail.attachmentLabel}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}