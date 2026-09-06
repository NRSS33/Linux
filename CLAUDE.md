# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal Linux knowledge base built with [Quartz](https://quartz.jzhao.xyz/) v5 and deployed to GitHub Pages at https://nrss33.github.io/Linux/. The actual content is Markdown notes in `content/`, authored in Obsidian.

## Commands

- `npm ci` — install dependencies (Node >= 22, npm >= 10.9.2; `engine-strict` is on)
- `npx quartz build` — build the static site into `public/`
- `npx quartz build --serve` — build and serve locally at http://localhost:8080
- `publish.bat` — Windows helper: `git add -A && git commit && git push` to the `v5` branch, which triggers the CI deploy (also achievable with `npx quartz sync` per the README)
- `npm run check` — `tsc --noEmit` + `prettier --check`
- `npm run format` — `prettier --write`
- `npm test` — run tests via `tsx --test`

## Architecture

- **Quartz v5** static site generator. Framework code in `quartz/` is vendored from upstream — do not edit it. User overrides go in `.quartz/` (gitignored).
- **`content/`** — the only directory you author. Open this folder in Obsidian to edit notes. Three notes exist:
  - `content/index.md` — homepage (title `Linux`), links to the notes below.
  - `content/Linux.md` — main note: a Linux command reference (15 numbered categories).
  - `content/shell_script.md` — a separate note for shell-scripting conventions (mostly empty for now).
- **`quartz.config.yaml`** — all site configuration (title, locale, theme, plugins, layout) is declared here. Plugins are `@quartz-community/*` / `@quartz-themes/*` npm packages that the `prebuild` script (`install-plugins`) auto-installs into `.quartz/plugins/`.
- **`public/`** — build output (gitignored). Never edit directly.
- **Deployment** — pushing to the `v5` branch triggers `.github/workflows/deploy.yml`, which runs `npm ci` + `npx quartz build` and deploys `public/` to GitHub Pages. No separate deploy branch is used.

## Content conventions (`content/Linux.md`)

- Frontmatter uses `title`, `tags`, `created`.
- `## 目录` is the table of contents (TOC); content sections are numbered `## 1. 文件与目录` … `## 15. Shell 脚本`.
- **Heading-slug rule (important):** TOC groups inside `## 目录` use unnumbered `### 分类名` headings, while the real content sections use numbered `## N. 分类名`. The number is what keeps their anchor IDs distinct — if both had identical text, GitHub slugger would deduplicate the later one with a `-1` suffix, breaking `index.md` jumps (they'd hit the TOC heading instead of the section) and duplicating the right-side TOC.
- Each command is a `### <command>` heading with a fixed shape:
  - a `>` blockquote describing the command
  - `- 语法:` / `- 常用选项:` / `- 示例:` bullets
  - fenced `bash` code blocks for examples
- Cross-links use Obsidian wikilinks: `[[#anchor]]` within the note, `[[Linux#anchor]]` from `index.md`. **Write the anchor as verbatim heading text** (spaces/parens/case exactly as the heading, e.g. `[[#if 条件判断]]`), never the slugified form (`if-条件判断`) — Quartz slugifies anchors at build time and Obsidian matches headings verbatim, so verbatim anchors resolve in both.
- **Adding a category touches three places:** (1) a new `## N. 分类名` section at the end of `Linux.md`, (2) a `### 分类名` group + command links in the `## 目录` TOC, (3) a `[[Linux#分类名|N. 分类名]]` link in `index.md` plus bumping its "N 类" count. Then run `publish.bat` to deploy.
- The build's `ignorePatterns` excludes `private`, `templates`, and `.obsidian`; `.claudian/` and `.playwright-mcp/` are also gitignored.
