import { useState } from "react";
import { LexifyComposer } from "@lexify/react";
import { baseTheme } from "@lexify/themes";
import { boldPlugin } from "@lexify/plugins";
import { italicPlugin } from "@lexify/plugins";
import { underlinePlugin } from "@lexify/plugins";
import { strikethroughPlugin } from "@lexify/plugins";
import { codePlugin } from "@lexify/plugins";
import { linkPlugin } from "@lexify/plugins";
import { fontSizePlugin } from "@lexify/plugins";
import { fontColorPlugin } from "@lexify/plugins";
import { textAlignPlugin } from "@lexify/plugins";
import { headingPlugin } from "@lexify/plugins";
import { listPlugin } from "@lexify/plugins";
import { historyPlugin } from "@lexify/plugins";
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
