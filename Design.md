# Design Specifications - Architecture Freeze v1.0

## Design System & Accessibility
Tailwind CSS + Radix UI. Dark-mode first. Strict adherence to WCAG 2.2 AA.

## Typography & Spacing
- **Font:** Inter (Primary), JetBrains Mono (Admin tables/logs).
- **Scale:** `h1` (40px/2.5rem), `h2` (32px/2rem), `body` (16px/1rem).
- **Spacing:** Base 4px. Max container width 1440px.

## Colors
- **Background:** `#0A0A0A`
- **Surface:** `#171717` (Cards, Sidebars)
- **Primary:** `#3B82F6` (Focus rings, Primary buttons)
- **Text:** `#F9FAFB` (High contrast), `#9CA3AF` (Secondary, min 4.5:1 ratio required).

## Player UI Specification (Strict)
- **Controls Autohide:** 3s inactivity timeout. Mouse move or keyboard focus reveals controls.
- **Progress Bar:**
  - Thin line by default, expands to 8px height on hover/focus.
  - Generates thumbnail preview popover (VTT sprite) on hover over the progress track.
- **Bottom Control Bar:**
  - Left: Play/Pause, Volume/Mute (Slider), Time display (`00:00 / 00:00`).
  - Right: Subtitles (CC), Playback Speed (0.5x to 2x), PiP, Theater Mode, Fullscreen.
- **Overlay:** Center Play/Pause indication with subtle scale animation. Spinner for buffering.
- **Keyboard Shortcuts:**
  - `Space` / `K`: Play/Pause
  - `Arrow Left/Right`: Seek +/- 10s
  - `Arrow Up/Down`: Volume +/- 10%
  - `M`: Mute
  - `F`: Fullscreen
  - `T`: Theater Mode
- **Mobile Gestures:** Double tap left/right to seek 10s. Swipe up/down for volume (if native API allows).

## Admin Dashboard Design
- Data-dense, utility-first layout.
- Left Sidebar (Collapsible), Top nav for user profile.
- Paginated data tables using standard API envelopes. Sortable column headers.
- Forms: Dark inputs with explicit `aria-invalid` states and inline error messages (Red `#EF4444`).

## Components
- **Buttons:** Radix-based. Standard states (default, hover, active, disabled). Mandatory `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]`.
- **Modals/Dialogs:** Radix Dialog primitive ensuring focus trap and `Escape` key dismissal.