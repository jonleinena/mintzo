# Exam Photos - Placeholder Directory

This directory contains placeholder images for Part 2 (Long Turn) exam content.

## Required Images

### B2 Level
- `b2-learning-1.jpg`, `b2-learning-2.jpg` - Students in different learning environments
- `b2-work-1.jpg`, `b2-work-2.jpg` - People in different work settings
- `b2-leisure-1.jpg`, `b2-leisure-2.jpg` - Free time activities
- `b2-transport-1.jpg`, `b2-transport-2.jpg` - Different transportation methods
- `b2-celebration-1.jpg`, `b2-celebration-2.jpg` - Celebration scenes

### C1 Level (3 images per set)
- `c1-communication-1.jpg` to `c1-communication-3.jpg`
- `c1-nature-1.jpg` to `c1-nature-3.jpg`
- `c1-generations-1.jpg` to `c1-generations-3.jpg`
- `c1-innovation-1.jpg` to `c1-innovation-3.jpg`
- `c1-challenge-1.jpg` to `c1-challenge-3.jpg`

### C2 Level
- `c2-identity-1.jpg`, `c2-identity-2.jpg`
- `c2-power-1.jpg`, `c2-power-2.jpg`
- `c2-connection-1.jpg`, `c2-connection-2.jpg`
- `c2-change-1.jpg`, `c2-change-2.jpg`
- `c2-meaning-1.jpg`, `c2-meaning-2.jpg`

## Image Guidelines

- Resolution: 800x600 minimum
- Format: JPEG preferred
- Content: Clear, high-quality photos suitable for exam comparison tasks
- Style: Real-world scenes, not illustrations

## Generating Images

These placeholders will be replaced with DALL-E generated images. Use prompts like:

```
A realistic photograph of [description], professional photography style,
clear lighting, suitable for an English language exam photo comparison task.
```

## Storage

Once generated, upload images to Supabase Storage and update the `image_urls`
array in `exam_part2_content` table to point to the storage URLs.
