import { createEditor } from "@lexify/core";
import type { LexifyEditor, LexifyEditorConfig } from "@lexify/core";

/**
 * Creates a LexifyEditor instance for use in unit tests.
 * Plugins are registered before the instance is returned.
 */
export function createTestEditor(
  config: Partial<LexifyEditorConfig> = {},
): LexifyEditor {
  return createEditor({ namespace: "test", ...config });
}

/**
 * Registers a command handler, dispatches the command, then unregisters.
 * Useful for asserting a single command invocation in isolation.
 */
export function dispatchOnce<TPayload>(
  editor: LexifyEditor,
  command: Parameters<LexifyEditor["registerCommandHandler"]>[0],
  payload: TPayload,
): void {
  const unsubscribe = editor.registerCommandHandler(
    command as Parameters<LexifyEditor["registerCommandHandler"]>[0],
    () => {},
  );
  editor.dispatchCommand(
    command as Parameters<LexifyEditor["dispatchCommand"]>[0],
    payload,
  );
  unsubscribe();
}
