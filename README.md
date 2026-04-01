# lud7n · portfolio

<p align="center">
  <!-- スクリーンショットを追加する場合はここに画像を置く -->
  <!-- <img src="docs/preview.png" alt="preview" width="100%" /> -->
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white" />
  <img alt="GitHub Pages" src="https://img.shields.io/badge/GitHub_Pages-deployed-181717?logo=github&logoColor=white" />
</p>

<p align="center">
  <a href="https://lud7n.github.io/portfolio">lud7n.github.io/portfolio</a>
</p>

---

## Overview

工藤翔太のポートフォリオサイト Ver.4.0。
スキル・プロジェクト・趣味を、インタラクションにこだわったUIで紹介しています。

## Pages

| Page | Description |
|------|-------------|
| `/` | ヒーロー・テーマセクション、ScrollCTA ナビゲーション |
| `/skills` | What I Do アコーディオン、SVG レーダーチャート＋テックスタック |
| `/projects` | カーソル追従プレビューカード、クリック展開プロジェクト一覧 |
| `/hobbies` | ターミナル風UI、CodeRain 背景 |

## Design Philosophy

- **インタラクション重視** — すべての遷移・ホバー・展開アニメーションを GSAP で実装。ページをまたぐ Circle Reveal トランジションで体験の一貫性を保つ
- **説明可能なデザイン** — 「なぜそのUIか」を言語化できる設計を意識。視覚的な派手さより、情報の流れと操作の気持ちよさを優先
- **ダークパレット** — `#050810` / `#06080f` ベースのネイビー系背景にノイズテクスチャを重ね、各ページに indigo / emerald / rose のアクセントカラーで個性を与えつつ統一感を維持

## Tech Stack

| Category | Tools |
|----------|-------|
| Framework | Next.js 16 (App Router, Static Export) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + ScrollTrigger |
| Icons | react-icons |
| Deploy | GitHub Pages |

## Getting Started

```bash
npm install
npm run dev
```

`http://localhost:3000/portfolio` で確認できます。

```bash
npm run build   # 静的ファイルを out/ に出力
```
