import { event } from "./analytics";

export const trackToolUse = (toolName) => {
  event({
    action: "tool_use",
    category: "Tool Usage",
    label: toolName,
  });
};
