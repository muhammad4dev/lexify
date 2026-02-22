import { useState } from "react";
import { LexifyComposer } from "@lexify/react";
import { baseTheme } from "@lexify/themes";
import { boldPlugin } from "@lexify/plugin-bold";
import { italicPlugin } from "@lexify/plugin-italic";
import { underlinePlugin } from "@lexify/plugin-underline";
import { strikethroughPlugin } from "@lexify/plugin-strikethrough";
import { codePlugin } from "@lexify/plugin-code";
import { linkPlugin } from "@lexify/plugin-link";
import { fontSizePlugin } from "@lexify/plugin-font-size";
import { fontColorPlugin } from "@lexify/plugin-font-color";
import { textAlignPlugin } from "@lexify/plugin-text-align";
import { headingPlugin } from "@lexify/plugin-heading";
import { listPlugin } from "@lexify/plugin-list";
import { historyPlugin } from "@lexify/plugin-history";
import { EditorToolbar } from "./components/EditorToolbar.js";
import { EditorArea } from "./components/EditorArea.js";

const PLUGINS = [
  boldPlugin,
  italicPlugin,
  underlinePlugin,
  strikethroughPlugin,
  codePlugin,
  linkPlugin,
  fontSizePlugin,
  fontColorPlugin,
  textAlignPlugin,
  headingPlugin,
  listPlugin,
  historyPlugin,
];

export default function App() {
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="app-title-lexify">Lexify</span>
          <span className="app-title-demo"> Demo</span>
        </h1>
        <p className="app-subtitle">
          Headless, plugin-driven Rich Text Editor built on{" "}
          <a
            href="https://lexical.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lexical
          </a>
        </p>
      </header>

      <main className="app-main">
        <LexifyComposer
          namespace="lexify-demo"
          plugins={PLUGINS}
          theme={baseTheme}
          className="editor-content"
          placeholder="Start typing… try headings, lists, bold, links, and more."
        >
          <div className="editor-container">
            <EditorToolbar />
            <EditorArea onCharCountChange={setCharCount} />
            <div className="editor-status">
              <span>{charCount} characters</span>
            </div>
          </div>
        </LexifyComposer>
      </main>
    </div>
  );
}
