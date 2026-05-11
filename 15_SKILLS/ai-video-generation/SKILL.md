---
name: ai-video-generation
description: "Generate AI videos with Google Veo, Seedance 2.0, HappyHorse, Wan, Grok and 40+ models via inference.sh CLI. Models: Veo 3.1, Veo 3, Seedance 2.0, HappyHorse 1.0, Wan 2.5, Grok Imagine Video, OmniHuman, Fabric, HunyuanVideo. Capabilities: text-to-video, image-to-video, reference-to-video, video editing, lipsync, avatar animation, video upscaling, foley sound. Use for: social media videos, marketing content, explainer videos, product demos, AI avatars. Triggers: video generation, ai video, text to video, image to video, veo, animate image, video from image, ai animation, video generator, generate video, t2v, i2v, ai video maker, create video with ai, runway alternative, pika alternative, sora alternative, kling alternative, seedance, happyhorse"
allowed-tools: Bash(belt *)
---

# AI Video Generation

Generate videos with 40+ AI models via [inference.sh](https://inference.sh) CLI.

## Quick Start

> Requires inference.sh CLI (`belt`). [Install instructions](https://raw.githubusercontent.com/inference-sh/skills/refs/heads/main/cli-install.md)

```bash
belt login
belt app run google/veo-3-1-fast --input '{"prompt": "drone shot flying over a forest"}'
```

## Available Models

### Text-to-Video
| Model | App ID | Best For |
|-------|--------|----------|
| Veo 3.1 Fast | `google/veo-3-1-fast` | Fast, with optional audio |
| Veo 3.1 | `google/veo-3-1` | Best quality, frame interpolation |
| Veo 3 | `google/veo-3` | High quality with audio |
| P-Video | `pruna/p-video` | Fast, economical, with audio support |
| Seedance 2 T2V | `falai/seedance-2-t2v` | Text-to-video with sync audio |
| HappyHorse T2V | `alibaba/happyhorse-1-0-t2v` | Physically realistic, up to 15s |
| Grok Video | `xai/grok-imagine-video` | xAI, configurable duration |

### Image-to-Video
| Model | App ID | Best For |
|-------|--------|----------|
| Wan 2.5 | `falai/wan-2-5` | Animate any image |
| Seedance 2 I2V | `falai/seedance-2-i2v` | Animate images with sync audio |
| HappyHorse I2V | `alibaba/happyhorse-1-0-i2v` | Animate images, up to 1080P/15s |

### Avatar / Lipsync
| Model | App ID | Best For |
|-------|--------|----------|
| OmniHuman 1.5 | `bytedance/omnihuman-1-5` | Multi-character |
| Fabric 1.0 | `falai/fabric-1-0` | Image talks with lipsync |
| PixVerse Lipsync | `falai/pixverse-lipsync` | Realistic lipsync |

### Utilities
| Tool | App ID | Description |
|------|--------|-------------|
| HunyuanVideo Foley | `infsh/hunyuanvideo-foley` | Add sound effects to video |
| Topaz Upscaler | `falai/topaz-video-upscaler` | Upscale video quality |
| Media Merger | `infsh/media-merger` | Merge videos with transitions |

## Examples

### Text-to-Video com Veo
```bash
belt app run google/veo-3-1-fast --input '{"prompt": "A timelapse of a flower blooming"}'
```

### Imagem para Video
```bash
belt app run falai/wan-2-5 --input '{"image_url": "https://your-image.jpg"}'
```

### Avatar Falante
```bash
belt app run bytedance/omnihuman-1-5 --input '{"image_url": "https://portrait.jpg", "audio_url": "https://speech.mp3"}'
```

### Adicionar Som (Foley)
```bash
belt app run infsh/hunyuanvideo-foley --input '{"video_url": "https://silent-video.mp4", "prompt": "footsteps on gravel"}'
```

### Upscaling de Video
```bash
belt app run falai/topaz-video-upscaler --input '{"video_url": "https://..."}'
```

## Documentation
- [Running Apps](https://inference.sh/docs/apps/running)
- [Content Pipeline Example](https://inference.sh/docs/examples/content-pipeline)
