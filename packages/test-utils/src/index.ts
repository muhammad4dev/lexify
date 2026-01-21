import { createEditor } from "@lexra/core";
import type { LexraEditor, LexraEditorConfig } from "@lexra/core";

/**
 * Creates a LexraEditor instance for use in unit tests.
 * Plugins are registered before the instance is returned.
 */
export function createTestEditor(
  config: Partial<LexraEditorConfig> = {},
): LexraEditor {
  return createEditor({ namespace: "test", ...config });
}

/**
 * Registers a command handler, dispatches the command, then unregisters.
 * Useful for asserting a single command invocation in isolation.
 */
export function dispatchOnce<TPayload>(
  editor: LexraEditor,
  command: Parameters<LexraEditor["registerCommandHandler"]>[0],
  payload: TPayload,
): void {
  const unsubscribe = editor.registerCommandHandler(
    command as Parameters<LexraEditor["registerCommandHandler"]>[0],
    () => {},
  );
  editor.dispatchCommand(
    command as Parameters<LexraEditor["dispatchCommand"]>[0],
    payload,
  );
  unsubscribe();
}
