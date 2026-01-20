import { createContext, useContext } from "react";
import type { LexraEditor } from "@lexra/core";

export const LexraContext = createContext<LexraEditor | null>(null);

export function useLexraEditor(): LexraEditor {
  const editor = useContext(LexraContext);
  if (!editor) {
    throw new Error(
      "useLexraEditor must be called inside a <LexraComposer> tree.",
    );
  }
  return editor;
}
