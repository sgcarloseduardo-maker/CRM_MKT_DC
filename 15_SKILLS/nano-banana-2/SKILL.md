---
name: nano-banana-2
description: "Fast and economical AI image generation using the nano-banana-2 model via inference.sh CLI. Optimized for quick iterations and high volume image generation at low cost. Triggers: nano banana, fast image, cheap image generation, quick image, bulk images, economical image."
allowed-tools: Bash(belt *)
---

# Nano Banana 2

Fast, economical image generation via [inference.sh](https://inference.sh) CLI.

## Quick Start

> Requires inference.sh CLI (`belt`). [Install instructions](https://raw.githubusercontent.com/inference-sh/skills/refs/heads/main/cli-install.md)

```bash
belt login
belt app run infsh/nano-banana-2 --input '{"prompt": "a product photo of a coffee mug"}'
```

## Best For

- High-volume image generation
- Quick prototyping and iteration
- Cost-sensitive workflows
- Social media content at scale

## Example

```bash
# Generate marketing image
belt app run infsh/nano-banana-2 --input '{
  "prompt": "professional product photo, white background, studio lighting",
  "width": 1024,
  "height": 1024
}'
```

## Related Skills

- **ai-image-generation**: Full image generation skill with 50+ models
- **ai-video-generation**: Extend images into videos
