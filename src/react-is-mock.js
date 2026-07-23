import * as React from "react";

// Provide the exact runtime checks recharts is looking for
export const isFragment = (type) => type === React.Fragment;
export const isMemo = (type) => type && type.$$typeof === Symbol.for("react.memo");
export const isValidElementType = (type) => typeof type === "string" || typeof type === "function";

export default {
  isFragment,
  isMemo,
  isValidElementType,
};
