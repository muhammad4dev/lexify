import { useState } from "react";
import { LexraComposer } from "@lexra/react";
import { baseTheme } from "@lexra/themes";
import { boldPlugin } from "@lexra/plugin-bold";
import { italicPlugin } from "@lexra/plugin-italic";
import { underlinePlugin } from "@lexra/plugin-underline";
import { strikethroughPlugin } from "@lexra/plugin-strikethrough";
import { codePlugin } from "@lexra/plugin-code";
import { linkPlugin } from "@lexra/plugin-link";
import { fontSizePlugin } from "@lexra/plugin-font-size";
import { fontColorPlugin } from "@lexra/plugin-font-color";
import { textAlignPlugin } from "@lexra/plugin-text-align";
import { headingPlugin } from "@lexra/plugin-heading";
import { listPlugin } from "@lexra/plugin-list";
import { historyPlugin } from "@lexra/plugin-history";
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
          <span className="app-title-lexra">Lexra</span>
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
        <LexraComposer
          namespace="lexra-demo"
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
        </LexraComposer>
      </main>
    </div>
  );
}
