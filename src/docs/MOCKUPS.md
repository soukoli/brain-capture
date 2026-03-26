# Brain Capture - Design Mockups & Specifications

**Visual Design System Documentation**
**Last Updated**: March 25, 2026

This document provides detailed text descriptions of the ideal UI designs for Brain Capture, including measurements, spacing, and behavior specifications.

---

## Table of Contents

1. [Capture Page (Mobile)](#capture-page-mobile)
2. [Capture Page (Desktop)](#capture-page-desktop)
3. [Voice Input Interface](#voice-input-interface)
4. [Ideas Dashboard](#ideas-dashboard)
5. [Project View](#project-view)
6. [Navigation & Menu](#navigation--menu)
7. [States & Interactions](#states--interactions)
8. [Design Specifications](#design-specifications)

---

## Capture Page (Mobile)

### Layout Description

**Screen**: iPhone 15 Pro (393px × 852px viewport)
**Orientation**: Portrait (primary), Landscape (secondary)

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│  [Brain Icon] Brain Capture      [×]    │ ← Header (64px height)
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Text | Voice                     │ │ ← Tabs (48px height)
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  What's on your mind?             │ │ ← Textarea (auto-expand)
│  │                                   │ │   Min: 200px
│  │  [Cursor here - auto-focused]    │ │   Max: 60vh
│  │                                   │ │
│  │                                   │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  147 characters                         │ ← Character count
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏷️ Project: Personal        ▼  │   │ ← Project selector
│  └─────────────────────────────────┘   │
│                                         │
│                  [Safe area]            │
│                                         │
├─────────────────────────────────────────┤
│  [Clear]           [💾 Save Idea]      │ ← Footer (72px + safe area)
└─────────────────────────────────────────┘
```

### Detailed Specifications

#### Header (Top Bar)
```
Height: 64px
Padding: 16px horizontal
Background: White (light) / Slate-950 (dark)
Border-bottom: 1px solid Slate-200 / Slate-800
Position: Sticky top

Elements:
- Logo Icon: 24px × 24px, Blue-600
- App Name: Text-lg (18px), Semibold, Slate-900
- Close Button: 44px × 44px touch target, Icon 20px, Ghost variant
  → Action: Navigate back / Close modal
```

#### Tab Bar
```
Height: 48px
Padding: 0 16px
Background: White (light) / Slate-950 (dark)
Border-bottom: 2px solid Blue-600 (active tab)

Tabs:
- Text Tab: Active by default, Blue-600 border-bottom
- Voice Tab: Inactive, no border
- Each tab: 48px min-height (touch target)
- Font: Text-base (16px), Medium weight
- Active state: Blue-600 text color
- Inactive state: Slate-600 text color
```

#### Content Area (Text Input)
```
Padding: 16px all sides
Background: White (light) / Slate-950 (dark)

Textarea:
- Width: 100% (fill container)
- Min-height: 200px
- Max-height: 60vh (viewport height)
- Overflow: auto (scroll if exceeds max-height)
- Border: None (borderless design)
- Font-size: 16px (prevent iOS zoom)
- Line-height: 1.5 (24px)
- Padding: 0 (no internal padding)
- Placeholder: "What's on your mind?"
- Placeholder color: Slate-400 (light) / Slate-600 (dark)
- Auto-focus: YES (cursor appears immediately)
- Resize: Vertical only (auto-expand on desktop)
```

#### Character Count
```
Position: Below textarea, left-aligned
Padding: 8px 16px
Font: Text-sm (14px), Slate-500
Format: "147 characters"
Color: Slate-500 (default), Yellow-600 (warning at 5000+), Red-600 (error at 10000+)
```

#### Project Selector
```
Height: 48px (min-h-[44px] touch target)
Margin: 16px horizontal, 12px top
Border: 1px solid Slate-200
Border-radius: 8px
Padding: 12px 16px
Background: White (light) / Slate-900 (dark)

Icon: 16px emoji or lucide icon (left)
Text: Text-base (16px), Slate-900
Chevron: 16px (right)
State: Clickable, opens dropdown modal
```

#### Footer (Action Bar)
```
Height: 72px + safe-area-inset-bottom
Padding: 16px horizontal + safe area
Background: White (light) / Slate-950 (dark)
Border-top: 1px solid Slate-200 / Slate-800
Position: Sticky bottom

Buttons:
- Clear Button (Left):
  → Variant: Outline
  → Size: Default (44px height)
  → Width: Auto (min 100px)
  → Text: "Clear"
  → Action: Empty textarea, show confirmation

- Save Button (Right):
  → Variant: Default (primary)
  → Size: Large (56px height)
  → Width: Auto (min 140px)
  → Text: "💾 Save Idea"
  → Action: Save and show success toast
  → Disabled: When textarea is empty
  → Loading: Show spinner when saving
```

### Spacing & Measurements

```
Screen margins: 16px (safe area insets applied)
Component gaps: 12px vertical
Touch targets: 44px minimum (56px for primary actions)
Text padding: 16px horizontal
Border radius: 8px (inputs), 12px (cards)
```

### Color Palette (Mobile)

```css
/* Light Mode */
Background: #FFFFFF
Surface: #FFFFFF
Text Primary: #0F172A (Slate-900)
Text Secondary: #334155 (Slate-700)
Border: #E2E8F0 (Slate-200)
Primary Action: #2563EB (Blue-600)

/* Dark Mode */
Background: #0A0A0A
Surface: #0F172A (Slate-900)
Text Primary: #F8FAFC (Slate-50)
Text Secondary: #CBD5E1 (Slate-300)
Border: #1E293B (Slate-800)
Primary Action: #3B82F6 (Blue-500)
```

---

## Capture Page (Desktop)

### Layout Description

**Screen**: Desktop (1024px+ width)
**Layout**: Centered card with max-width

### Visual Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Background gradient]                  │
│                                                     │
│         ┌───────────────────────────┐              │
│         │ [×]                       │              │
│         │                           │              │
│         │  ┌─────────────────────┐ │              │
│         │  │ Text | Voice        │ │              │
│         │  └─────────────────────┘ │              │
│         │                           │              │
│         │  What's on your mind?     │              │
│         │                           │              │
│         │  [Large text area]        │              │
│         │                           │              │
│         │  147 characters           │              │
│         │                           │              │
│         │  🏷️ Project: Personal ▼   │              │
│         │                           │              │
│         │  [Clear]    [Save Idea]   │              │
│         └───────────────────────────┘              │
│                                                     │
│                  Max-width: 768px                   │
└─────────────────────────────────────────────────────┘
```

### Detailed Specifications

#### Container
```
Width: 100% with max-width 768px
Margin: 80px auto (center)
Padding: 0 32px (prevent edge collision)
Background: Transparent (shows page gradient)
```

#### Card
```
Width: 100%
Border-radius: 16px (larger for desktop)
Background: White (light) / Slate-900 (dark)
Border: 1px solid Slate-200 / Slate-800
Box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)
Padding: 32px

Elements:
- Close button: 40px × 40px, top-right absolute position
- Tabs: Same as mobile but centered
- Textarea: 300px min-height (larger than mobile)
- Buttons: Inline, right-aligned
```

#### Page Background (Desktop Only)
```
Background: Linear gradient
From: Slate-50 (light) / Slate-950 (dark)
To: Slate-100 (light) / Slate-900 (dark)
Direction: Top-left to bottom-right (135deg)
```

#### Keyboard Shortcuts Hint
```
Position: Below card, centered
Padding: 16px 0
Font: Text-sm (14px), Slate-500
Format: "Press ⌘ + Enter to save"

Kbd styling:
- Background: Slate-200 (light) / Slate-800 (dark)
- Padding: 4px 8px
- Border-radius: 4px
- Font-family: Monospace
```

---

## Voice Input Interface

### Layout Description (Mobile)

```
┌─────────────────────────────────────────┐
│  [Brain Icon] Brain Capture      [×]    │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Text | Voice [active]            │ │
│  └───────────────────────────────────┘ │
│                                         │
│              [Large space]              │
│                                         │
│          ┌─────────────────┐           │
│          │                 │           │ ← Circular record button
│          │       🎙️       │           │   80px diameter
│          │                 │           │   Center of screen
│          └─────────────────┘           │
│                                         │
│         "Tap to start recording"       │ ← Status text
│                                         │
│          [Waveform animation]          │ ← Only when recording
│                                         │
│               00:23                     │ ← Timer (when recording)
│                                         │
│                                         │
│              [Large space]              │
│                                         │
├─────────────────────────────────────────┤
│           [Done] (disabled)             │ ← Footer
└─────────────────────────────────────────┘
```

### Recording States

#### State 1: Ready (Initial)
```
Record Button:
- Size: 80px diameter
- Background: Blue-600
- Icon: Microphone (32px, white)
- Shadow: 0 4px 6px rgb(37 99 235 / 0.3)
- Animation: None
- Text: "Tap to start recording"
- Text color: Slate-600
- Position: Vertically centered
```

#### State 2: Recording (Active)
```
Record Button:
- Size: 80px diameter
- Background: Red-600 (indicates recording)
- Icon: Square (24px, white) - stop icon
- Shadow: 0 8px 16px rgb(220 38 38 / 0.4)
- Animation: Pulse (opacity 1 → 0.8, 1.5s infinite)
- Text: "Tap to stop recording"
- Text color: Red-600

Waveform Visualizer:
- Position: Below button, 32px margin-top
- Width: 240px (centered)
- Height: 48px
- Bars: 20 bars, 4px width each, 4px gap
- Color: Blue-600
- Animation: Height animates based on audio level
  → Range: 4px (min) to 40px (max)
  → Smooth: 100ms transition

Timer:
- Position: Below waveform, 16px margin-top
- Font: Text-2xl (24px), Monospace
- Format: "MM:SS"
- Color: Slate-900 (light) / Slate-50 (dark)
- Update: Every second
```

#### State 3: Processing (Transcribing)
```
Record Button:
- Size: 80px diameter
- Background: Blue-600
- Icon: Loader/Spinner (32px, white, animated)
- Shadow: 0 4px 6px rgb(37 99 235 / 0.3)
- Animation: Spin (360deg, 1s infinite linear)
- Text: "Transcribing..."
- Text color: Slate-600
- Duration: Show for 1-3 seconds

Progress:
- Optional: Show linear progress bar below
- Width: 240px
- Height: 4px
- Color: Blue-600
- Animation: Indeterminate slide
```

#### State 4: Complete (Transcription Done)
```
Auto-transition to Text tab with:
- Textarea filled with transcription
- Smooth fade-in animation (200ms)
- Auto-focus cursor at end of text
- Success toast: "Voice recorded!" with transcription length

Transcription Display:
- Font: Text-base (16px)
- Line-height: 1.5
- Color: Slate-900 (light) / Slate-50 (dark)
- Editable: Yes (user can edit transcription)
```

### Interaction Details

```
Tap Record Button:
1. Request microphone permission (if not granted)
2. Show permission modal if needed
3. Start recording + visual feedback (200ms)
4. Begin audio visualization
5. Start timer

Tap Stop Button:
1. Stop recording immediately
2. Show processing state
3. Send audio to Whisper API
4. Receive transcription (1-3s)
5. Switch to Text tab with filled content
6. Show success feedback

Microphone Permission Denied:
- Show alert with instructions to enable
- Provide "Go to Settings" button (iOS)
- Disable voice tab with tooltip explanation
```

---

## Ideas Dashboard

### Layout Description (Mobile)

```
┌─────────────────────────────────────────┐
│  ☰  Brain Capture        [Profile]      │ ← Header with menu
├─────────────────────────────────────────┤
│                                         │
│  [Search ideas...]              🔍      │ ← Search bar
│                                         │
│  ┌─ My Ideas ────────────────────────┐ │
│  │                                   │ │
│  │  All (47) • Personal (23) • ...  │ │ ← Filter tabs (horizontal scroll)
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 💡 Meeting Notes                  │ │ ← Idea card
│  │ Quick thoughts from today's...    │ │
│  │ 2 min ago • Personal              │ │
│  │ [#meeting] [#work]                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🚀 App Feature Idea               │ │
│  │ Voice input for quick...          │ │
│  │ 1 hour ago • Side Project         │ │
│  │ [#development] [#idea]            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [More ideas...]                        │
│                                         │
│                     [Empty space]       │
│                                         │
├─────────────────────────────────────────┤
│         [FAB: + Capture]                │ ← Floating Action Button
└─────────────────────────────────────────┘
```

### Detailed Specifications

#### Header
```
Height: 64px
Padding: 16px horizontal
Background: White (light) / Slate-950 (dark)
Border-bottom: 1px solid Slate-200 / Slate-800

Left: Hamburger Menu (44px × 44px touch target)
Center: "Brain Capture" logo + text
Right: Profile Avatar (40px circle)
```

#### Search Bar
```
Height: 48px (min-h-[44px])
Margin: 16px horizontal, 12px vertical
Border-radius: 12px
Background: Slate-100 (light) / Slate-900 (dark)
Border: 1px solid Slate-200 (light) / Slate-800 (dark)

Icon: Search (20px), left, Slate-400
Placeholder: "Search ideas..."
Font: Text-base (16px)
Focus: Blue-600 border, 2px width
```

#### Filter Tabs (Horizontal Scroll)
```
Height: 40px
Margin: 0 16px 16px
Display: Flex row, gap 8px
Overflow: Scroll horizontal (hide scrollbar)

Each Tab:
- Height: 40px (min-h-[44px] with padding)
- Padding: 8px 16px
- Border-radius: 20px (pill shape)
- Background: Slate-100 (inactive) / Blue-600 (active)
- Text: Text-sm (14px), Medium
- Color: Slate-700 (inactive) / White (active)
- Count: Show in parentheses "(47)"
- Animation: Smooth background transition (200ms)
```

#### Idea Card
```
Margin: 0 16px 12px (horizontal margins, bottom gap)
Padding: 16px
Border-radius: 12px
Background: White (light) / Slate-900 (dark)
Border: 1px solid Slate-200 (light) / Slate-800 (dark)
Shadow: 0 1px 3px rgb(0 0 0 / 0.1)

Hover/Active: Shadow increases to 0 4px 6px
Tap: Scale to 0.98 (active feedback)

Layout:
┌────────────────────────────┐
│ 💡 Title (truncate 2 lines)│ ← Icon + Title
│ Preview text (truncate 3)  │ ← Preview
│ 2 min ago • Personal       │ ← Metadata
│ [#tag1] [#tag2]           │ ← Tags
└────────────────────────────┘

Title:
- Font: Text-lg (18px), Semibold
- Color: Slate-900 (light) / Slate-50 (dark)
- Max lines: 2 (truncate with ellipsis)
- Icon: 20px emoji or lucide icon (left)

Preview:
- Font: Text-base (16px), Regular
- Color: Slate-600 (light) / Slate-400 (dark)
- Max lines: 3 (truncate with ellipsis)
- Line height: 1.5

Metadata:
- Font: Text-sm (14px), Regular
- Color: Slate-500
- Format: "time ago • project name"
- Separator: " • " (bullet point)

Tags:
- Height: 28px
- Padding: 4px 12px
- Border-radius: 14px (pill)
- Background: Blue-100 (light) / Blue-900/30 (dark)
- Text: Text-xs (12px), Medium
- Color: Blue-700 (light) / Blue-300 (dark)
- Display: Inline-flex, gap 8px
- Max: Show 3 tags, "+2 more" if exceeds
```

#### Floating Action Button (FAB)
```
Position: Fixed bottom-right
Bottom: 24px + safe-area-inset
Right: 24px
Size: 56px diameter (large touch target)
Border-radius: 28px (circle)
Background: Blue-600
Shadow: 0 4px 12px rgb(37 99 235 / 0.4)
Icon: Plus (24px), White
Z-index: 1000

Hover: Scale to 1.05
Active: Scale to 0.95
Animation: Fade-in on scroll up, fade-out on scroll down

Action: Navigate to /capture
```

#### Empty State (No Ideas)
```
Position: Center of content area
Padding: 64px 32px

Icon: Brain (64px), Slate-300
Margin-bottom: 24px

Title: "No ideas yet"
- Font: Text-xl (20px), Semibold
- Color: Slate-900 (light) / Slate-50 (dark)
- Margin-bottom: 8px

Description: "Start capturing your thoughts..."
- Font: Text-base (16px), Regular
- Color: Slate-600 (light) / Slate-400 (dark)
- Max-width: 400px
- Text-align: Center
- Margin-bottom: 32px

Button: "Capture Your First Idea"
- Size: Large (56px height)
- Variant: Primary (Blue-600)
- Width: Auto (min 240px)
```

---

## Project View

### Layout Description

```
┌─────────────────────────────────────────┐
│  ← Personal Project          [•••]      │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Statistics ────────────────────┐   │
│  │ 23 ideas  •  12 this week       │   │ ← Stats bar
│  └─────────────────────────────────┘   │
│                                         │
│  [Search this project...]         🔍   │ ← Scoped search
│                                         │
│  ┌─ Sort ─────────────────────────┐   │
│  │ Recent • Oldest • A-Z          │   │ ← Sort options
│  └─────────────────────────────────┘   │
│                                         │
│  [Ideas grid - same as dashboard]       │
│                                         │
└─────────────────────────────────────────┘
```

### Project Header
```
Height: 64px
Padding: 16px horizontal
Background: White (light) / Slate-950 (dark)
Border-bottom: 1px solid Slate-200 / Slate-800

Left: Back arrow (44px touch target)
Center: Project name + emoji
Right: Menu button (options: edit, delete, share)
```

### Statistics Bar
```
Height: 56px
Margin: 16px
Padding: 12px 16px
Border-radius: 12px
Background: Blue-50 (light) / Blue-900/10 (dark)
Border: 1px solid Blue-200 (light) / Blue-800 (dark)

Layout: Flex row, justify space-between
Font: Text-sm (14px), Medium
Color: Blue-900 (light) / Blue-100 (dark)
Icons: 16px, inline with text
```

---

## Navigation & Menu

### Side Drawer (Mobile)

```
┌────────────────────────────┐
│                            │
│  👤 John Doe               │ ← Profile header
│  john@example.com          │   80px height
│                            │
├────────────────────────────┤
│  🏠 Dashboard              │ ← Navigation items
│  💡 All Ideas              │   48px height each
│  📊 Projects               │   (touch targets)
│  ⚙️ Settings               │
│                            │
├────────────────────────────┤
│  MY PROJECTS               │ ← Section header
│  📁 Personal (23)          │   Project list
│  💼 Work (15)              │
│  🚀 Side Projects (9)      │
│  + New Project             │
│                            │
├────────────────────────────┤
│  🌙 Dark Mode   [toggle]   │ ← Settings
│  ❓ Help & Feedback        │
│  🚪 Sign Out               │
└────────────────────────────┘
```

### Desktop Navigation

```
┌────────────────────────────────────────────────────────┐
│  [Logo] Brain Capture    [Dashboard] [Projects] [Search] [Profile] │
└────────────────────────────────────────────────────────┘

Horizontal nav bar:
- Height: 64px
- Background: White / Slate-950
- Border-bottom: 1px solid Slate-200 / Slate-800
- Items: Text-base (16px), Medium, 48px height
- Active: Blue-600 text + bottom border
- Spacing: 32px gap between items
```

---

## States & Interactions

### Loading States

#### Skeleton Card
```
Same dimensions as Idea Card
Background: Slate-200 (light) / Slate-800 (dark)
Animation: Pulse (opacity 1 → 0.6 → 1, 2s infinite)

Elements:
- Title line: 75% width, 20px height
- Preview lines: 3 lines, 100%, 90%, 85% width, 16px height
- Metadata line: 50% width, 14px height
- Tags: 2 pills, 60px × 24px each
```

#### Spinner (Inline)
```
Size: 20px (inline) or 40px (full-screen)
Color: Blue-600
Animation: Rotate 360deg, 1s infinite linear
Stroke-width: 2px
```

### Error States

#### Error Alert
```
Position: Top of content area
Margin: 16px
Padding: 16px
Border-radius: 12px
Background: Red-50 (light) / Red-900/10 (dark)
Border: 1px solid Red-200 (light) / Red-800 (dark)

Icon: Alert Circle (20px), Red-600
Title: "Error" - Text-base (16px), Semibold, Red-900
Message: Text-sm (14px), Red-700
Action: "Retry" button (Outline variant)
```

### Success States

#### Toast Notification
```
Position: Top-center, 16px from top
Width: Max 400px, min 280px
Padding: 16px
Border-radius: 12px
Background: White (light) / Slate-900 (dark)
Border: 1px solid Slate-200 / Slate-800
Shadow: 0 10px 15px rgb(0 0 0 / 0.1)

Icon: Check Circle (20px), Green-600 (left)
Text: Text-base (16px), Medium, Slate-900
Close: X button (right, 32px touch target)

Animation:
- Enter: Slide down + fade in (200ms)
- Exit: Slide up + fade out (200ms)
- Duration: 3 seconds auto-dismiss
```

### Interactive Animations

#### Button Press
```
Transform: scale(0.95)
Duration: 100ms
Easing: ease-out
```

#### Card Tap (Mobile)
```
Transform: scale(0.98)
Shadow: Increase by 2px
Duration: 100ms
Easing: ease-out
```

#### Input Focus
```
Border: 2px solid Blue-600 (was 1px Slate-200)
Ring: 0 0 0 3px rgb(37 99 235 / 0.1) (offset ring)
Duration: 200ms
Easing: ease-in-out
```

#### Modal Enter/Exit
```
Overlay:
- Enter: Fade in (200ms)
- Exit: Fade out (150ms)

Content:
- Enter: Zoom in (0.95 → 1) + Fade in
- Exit: Zoom out (1 → 0.95) + Fade out
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Design Specifications

### Typography System

```css
/* Headings */
H1 (Page Title):
- Mobile: 30px (1.875rem), Bold (700), -0.025em tracking
- Desktop: 48px (3rem), Bold (700), -0.025em tracking

H2 (Section Title):
- Mobile: 24px (1.5rem), Bold (700), -0.025em tracking
- Desktop: 36px (2.25rem), Bold (700), -0.025em tracking

H3 (Card Title):
- Mobile: 18px (1.125rem), Semibold (600), normal tracking
- Desktop: 20px (1.25rem), Semibold (600), normal tracking

/* Body Text */
Body Large: 18px (1.125rem), Regular (400), 1.75 line-height
Body Default: 16px (1rem), Regular (400), 1.5 line-height
Body Small: 14px (0.875rem), Regular (400), 1.5 line-height
Caption: 12px (0.75rem), Regular (400), 1.5 line-height

/* Special */
Monospace (Code/Time): SF Mono / Consolas, 14px
```

### Spacing System

```css
/* Consistent spacing scale */
xs: 4px    (0.25rem)
sm: 8px    (0.5rem)
md: 12px   (0.75rem)
base: 16px (1rem)    ← Default
lg: 24px   (1.5rem)
xl: 32px   (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)

/* Component spacing */
Card padding: 16px (mobile), 24px (desktop)
Section gaps: 24px
Element gaps: 12px
Inline gaps: 8px
```

### Elevation (Shadows)

```css
/* Shadow scale */
xs: 0 1px 2px rgb(0 0 0 / 0.05)
sm: 0 1px 3px rgb(0 0 0 / 0.1)
md: 0 4px 6px rgb(0 0 0 / 0.1)
lg: 0 10px 15px rgb(0 0 0 / 0.1)
xl: 0 20px 25px rgb(0 0 0 / 0.1)

/* Usage */
Button: xs
Card: sm (default), lg (hover/active)
Modal: xl
FAB: lg
Toast: lg
```

### Border Radius

```css
/* Radius scale */
sm: 4px   (tight elements)
md: 8px   (inputs, buttons)
lg: 12px  (cards, modals)
xl: 16px  (large surfaces)
full: 9999px (pills, avatars)

/* Usage */
Input: 8px
Button: 8px
Card: 12px
Modal: 16px (desktop), 0 (mobile full-screen)
Badge: 9999px (pill)
Avatar: 9999px (circle)
```

### Transitions

```css
/* Standard durations */
fast: 150ms   (micro-interactions)
normal: 200ms (default)
slow: 300ms   (complex animations)

/* Easing */
ease-out: cubic-bezier(0, 0, 0.2, 1)     - Decelerating
ease-in: cubic-bezier(0.4, 0, 1, 1)      - Accelerating
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) - Smooth both ends

/* Usage */
Button: 150ms ease-out
Modal: 200ms ease-in-out
Page transitions: 300ms ease-out
```

---

## Responsive Breakpoints

```css
/* Mobile-first approach */
xs: 0px      (default, all devices)
sm: 640px    (large phones, small tablets)
md: 768px    (tablets)
lg: 1024px   (desktop)
xl: 1280px   (large desktop)
2xl: 1536px  (extra large screens)

/* Key layout changes */
- xs-sm: Single column, full-width, mobile nav
- md: 2-column grid, tablet nav
- lg+: Multi-column, desktop nav, sidebar

/* Font size scaling */
- xs: Base 16px
- md: Base 16px (same)
- lg: Base 16px, but larger headings
```

---

## Accessibility Annotations

All designs must meet these accessibility requirements:

### Color Contrast
- Text: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Touch Targets
- Minimum: 44px × 44px
- Recommended: 48px × 48px
- Primary actions: 56px × 56px

### Focus Indicators
- Width: 3px outline
- Offset: 2px from element
- Color: Blue-600 (visible on all backgrounds)
- Style: Solid outline

### Screen Reader Labels
- All interactive elements have aria-label
- Icons are aria-hidden when decorative
- Form inputs have associated <label> elements
- Landmarks (nav, main, footer) are defined

### Keyboard Navigation
- All features accessible via keyboard
- Logical tab order
- Skip links for long navigation
- Escape key closes modals
- Enter/Space activates buttons

---

**Last Updated**: March 25, 2026
**Design System Version**: 1.0.0
**Status**: Draft - Pending Implementation
