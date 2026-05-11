---
name: find-skills
description: "Use when the user wants to find, discover, or install new skills. Triggers: find skills, discover skills, what skills are available, install skill, add skill, skills marketplace, browse skills, what can you do, capabilities, available skills, skill store."
---

# Find Skills

Help users discover and install skills to extend AI capabilities.

## How to Find Skills

### Browse the Skills Registry

```bash
# List all available skills
npx skills list

# Search for skills by keyword
npx skills search "image generation"
npx skills search "seo"
npx skills search "video"
```

### Install a Skill

```bash
# Install from GitHub
npx skills add owner/repo@skill-name

# Examples
npx skills add inference-sh/skills@ai-image-generation
npx skills add coreyhaines31/marketingskills@copywriting
npx skills add anthropics/skills@frontend-design
```

### Popular Skill Categories

| Category | Examples |
|----------|----------|
| **Image Generation** | ai-image-generation, gpt-image, flux-image |
| **Video Generation** | ai-video-generation, google-veo, seedance |
| **Marketing** | copywriting, content-strategy, ai-seo, social-content |
| **Development** | frontend-design, webapp-testing, skill-creator |
| **Research** | brainstorming, find-skills |

## Skills in This Project

Skills are stored in `15_SKILLS/` and registered in `skills-lock.json`.

To see installed skills:
```bash
cat skills-lock.json
```

## Related Skills

- **skill-creator**: Create your own custom skills
