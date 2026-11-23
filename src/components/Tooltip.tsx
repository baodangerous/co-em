/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface TooltipContextType {
  tooltipsEnabled: boolean;
  setTooltipsEnabled: (enabled: boolean) => void;
  toggleTooltips: () => void;
}

const TooltipContext = createContext<TooltipContextType>({
  tooltipsEnabled: false,
  setTooltipsEnabled: () => {},
  toggleTooltips: () => {},
});

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltipsEnabled, setTooltipsEnabled] = useState<boolean>(false);

  const toggleTooltips = useCallback(() => {
    setTooltipsEnabled((prev) => !prev);
  }, []);

  return (
    <TooltipContext.Provider
      value={{ tooltipsEnabled, setTooltipsEnabled, toggleTooltips }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltips() {
  return useContext(TooltipContext);
}

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  title?: string;
  shortcut?: string;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  className?: string;
  asBlock?: boolean;
  children: ReactNode;
}

export default function Tooltip({
  className = "",
  asBlock = false,
  children,
}: TooltipProps) {
  return (
    <div
      className={`vpr-tooltip-trigger ${asBlock ? "block w-full" : "inline-block"} ${className}`}
    >
      {children}
    </div>
  );
}

export function TooltipToggleButton(_props: { className?: string }) {
  return null;
}
