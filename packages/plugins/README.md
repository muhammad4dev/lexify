# @lexify/plugins

> All [Lexify](https://github.com/muhammad4dev/lexify) plugins in one tree-shakeable package. Import only what you use — your bundler drops the rest.

📖 **[Full documentation →](https://muhammad4dev.github.io/lexify)** · [GitHub](https://github.com/muhammad4dev/lexify) · [Changelog](https://github.com/muhammad4dev/lexify/releases)

## Installation

```bash
pnpm add @lexify/plugins @lexify/core lexical
```

## Usage

```tsx
import { LexifyComposer } from "@lexify/react";
import {
  boldPlugin,
  italicPlugin,
  underlinePlugin,
  headingPlugin,
  listPlugin,
  linkPlugin,
  fontSizePlugin,
  fontColorPlugin,
  textAlignPlugin,
  historyPlugin,
} from "@lexify/plugins";

<LexifyComposer
  namespace="my-editor"
  plugins={[
    boldPlugin,
    italicPlugin,
    underlinePlugin,
    headingPlugin,
    listPlugin,
    linkPlugin,
    fontSizePlugin,
    fontColorPlugin,
    textAlignPlugin,
    historyPlugin,
  ]}
/>;
```

## Dispatching commands

```typescript
import {
  FORMAT_BOLD_COMMAND,
  SET_HEADING_COMMAND,
  SET_FONT_SIZE_COMMAND,
  INSERT_LINK_COMMAND,
  UNDO_COMMAND,
} from "@lexify/plugins";

editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined);
editor.dispatchCommand(SET_HEADING_COMMAND, "h2");
editor.dispatchCommand(SET_FONT_SIZE_COMMAND, "18px");
editor.dispatchCommand(INSERT_LINK_COMMAND, { url: "https://example.com" });
editor.dispatchCommand(UNDO_COMMAND, undefined);
```

## Available plugins & commands

### Format

| Plugin                | Command                        |
| --------------------- | ------------------------------ |
| `boldPlugin`          | `FORMAT_BOLD_COMMAND`          |
| `italicPlugin`        | `FORMAT_ITALIC_COMMAND`        |
| `underlinePlugin`     | `FORMAT_UNDERLINE_COMMAND`     |
| `strikethroughPlugin` | `FORMAT_STRIKETHROUGH_COMMAND` |
| `codePlugin`          | `FORMAT_CODE_COMMAND`          |

### Block

| Plugin            | Commands                                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `headingPlugin`   | `SET_HEADING_COMMAND`, `REMOVE_HEADING_COMMAND`                                                                                                |
| `textAlignPlugin` | `SET_TEXT_ALIGN_COMMAND`                                                                                                                       |
| `listPlugin`      | `INSERT_UNORDERED_LIST_COMMAND`, `INSERT_ORDERED_LIST_COMMAND`, `REMOVE_LIST_COMMAND`, `INDENT_LIST_ITEM_COMMAND`, `OUTDENT_LIST_ITEM_COMMAND` |

### Inline style

| Plugin            | Commands                                              |
| ----------------- | ----------------------------------------------------- |
| `fontSizePlugin`  | `SET_FONT_SIZE_COMMAND`, `REMOVE_FONT_SIZE_COMMAND`   |
| `fontColorPlugin` | `SET_FONT_COLOR_COMMAND`, `REMOVE_FONT_COLOR_COMMAND` |

### Link

| Plugin       | Commands                                                            |
| ------------ | ------------------------------------------------------------------- |
| `linkPlugin` | `INSERT_LINK_COMMAND`, `UPDATE_LINK_COMMAND`, `REMOVE_LINK_COMMAND` |

### History

| Plugin          | Commands                       |
| --------------- | ------------------------------ |
| `historyPlugin` | `UNDO_COMMAND`, `REDO_COMMAND` |

## Utilities (also exported)

```typescript
import {
  parseStyleString,
  setStyleProperty,
  isValidColor,
  isValidFontSize,
} from "@lexify/plugins";
```

Useful when writing custom plugins that need to manipulate inline CSS styles.

## License

MIT © [Muhammad Mustafa](https://github.com/muhammad4dev)
