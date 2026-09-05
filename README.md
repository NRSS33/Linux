# 个人知识库

用 [Quartz](https://quartz.jzhao.xyz/) 搭建的个人知识库网站。笔记存放在 `content/` 目录，用 Obsidian 打开 `content/` 文件夹即可继续编辑。

- 线上地址：https://nrss33.github.io/Linux/
- 技术栈：Quartz v5 + GitHub Pages

## 发布更新

1. 用 Obsidian 打开 `content/` 文件夹，编辑笔记。
2. 双击运行 `publish.bat`（或在终端运行 `npx quartz sync`）。
3. 等待约 1 分钟，网站自动更新。

## 本地预览

```bash
npm ci
npx quartz build --serve
```

打开 http://localhost:8080

## 站点配置

站点标题、语言、颜色等都在 `quartz.config.yaml` 中修改。修改后同样运行 `publish.bat` 生效。
