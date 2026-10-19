# shared-skills

第三方收集的 Claude/Hermes skills，非本人原创。每个 skill 保留原作者、上游链接和许可。

## Skills

| Skill | 说明 | 来源 | 许可 |
|---|---|---|---|
| [`apple-dark-ui`](./apple-dark-ui) | 按 Apple HIG（含 Liquid Glass）设计深色 Web 界面，React + Tailwind CSS v4 | [Yachiyo-5i/yachiyo-skills](https://github.com/Yachiyo-5i/yachiyo-skills) | MIT © Yachiyo-5i |

## 多端使用

### Ubuntu（Hermes + Claude Code）

```bash
# 克隆（或更新）
git clone https://github.com/richengdaoren-ops/shared-skills.git ~/workplace/agents/shared/external/shared-skills
# 或：cd ~/workplace/agents/shared/external/shared-skills && git pull

# 软链到 Hermes（按类目）
ln -sfn ~/workplace/agents/shared/external/shared-skills/apple-dark-ui ~/.hermes/skills/creative/apple-dark-ui

# 软链到 Claude Code
ln -sfn ~/workplace/agents/shared/external/shared-skills/apple-dark-ui ~/.claude/skills/apple-dark-ui
```

### macOS

```bash
git clone https://github.com/richengdaoren-ops/shared-skills.git ~/workplace/agents/shared/external/shared-skills
ln -sfn ~/workplace/agents/shared/external/shared-skills/apple-dark-ui ~/.claude/skills/apple-dark-ui
```

### Windows（PowerShell，需开发者模式或管理员）

```powershell
git clone https://github.com/richengdaoren-ops/shared-skills.git C:\Users\admin\workplace\agents\shared\external\shared-skills
New-Item -ItemType SymbolicLink -Path "$HOME\.claude\skills\apple-dark-ui" -Target "C:\Users\admin\workplace\agents\shared\external\shared-skills\apple-dark-ui" -Force
```

## 目录约定

每个 skill 自包含，含 `SKILL.md`（必需）+ `references/` + `assets/`。新增 skill 时在上方表格补一行（含来源和许可）。

## 许可

每个 skill 目录内的许可归原作者所有，见各 skill 自带 LICENSE 或上游说明。本仓库的 README 和目录组织采用 MIT。
