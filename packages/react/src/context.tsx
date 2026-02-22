import { createContext, useContext } from "react";
import type { LexifyEditor } from "@lexify/core";

export const LexifyContext = createContext<LexifyEditor | null>(null);

export function useLexifyEditor(): LexifyEditor {
  const editor = useContext(LexifyContext);
  if (!editor) {
    throw new Error(
      "useLexifyEditor must be called inside a <LexifyComposer> tree.",
    );
  }
  return editor;
}
