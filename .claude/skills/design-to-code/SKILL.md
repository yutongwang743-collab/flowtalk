---
name: design-to-code
description: "Convert UI design ideas into production React/Next.js code with inline styles. Handles the full pipeline: analyze reference design → generate mockup options → present for selection → refine → implement in code. Use when the user says 'design a page', 'redesign the layout', 'optimize cards', 'make it look like [reference]', 'create a hero section', 'improve the UI', 'change the styling', or any request involving visual changes to React components. Especially calibrated for Chinese-language interfaces with warm color palettes."
---

# Design-to-Code Pipeline

Turn design ideas into production React/Next.js code through a structured visual iteration loop.

## The Pipeline

### Phase 1: Understand

Before designing anything, read the current code and understand:
- What component(s) are being changed
- The existing style system (inline styles, color tokens, font choices)
- The brand context (check `src/lib/colors.ts` if it exists)

### Phase 2: Reference Analysis

If the user mentions a reference (AussieLingo, WeRead, etc.):
1. Find any saved reference files in `.superpowers/brainstorm/` directories
2. Read the most relevant mockup HTML file
3. Extract: layout structure, spacing patterns, card dimensions, typography scale, color usage

### Phase 3: Generate Options

Create 2-4 visual mockups as HTML files and present them for the user to compare. Each option should show the same content with different layout/styling approaches.

**Mockup format:**
- Self-contained HTML with inline styles (no external CSS)
- Render at realistic dimensions for the target device
- Include real content (not lorem ipsum) — use actual lesson titles, tags, etc.
- Label each option clearly (A, B, C, D)

**When to use visual companion:** If the topic involves layout comparison, card sizing, spacing decisions, or any visual choice, offer the browser-based visual companion first (one message, no other content). Read `skills/brainstorming/visual-companion.md` for setup.

**When to just use text options:** Simple decisions like "should the button be red or orange" or "should we use 12px or 14px font" don't need mockups.

### Phase 4: Selection & Refinement

After the user picks an option:
1. Ask if anything needs tweaking (one question at a time)
2. Show refined mockup
3. Repeat until satisfied

### Phase 5: Code Implementation

Once approved, implement in the actual project files:

**Style rules for this project:**
- Use **inline styles** (`style={{}}`), NOT Tailwind classes for component styling
- Color tokens from `src/lib/colors.ts`: `C.dark="#8B3A2A"`, `C.warm="#FDF0EA"`, terracotta `#D4A090`
- Font: ZCOOL KuaiLe for decorative headings, Noto Sans SC for body
- Card backgrounds: white `#fff` on warm page background `#fafaf9`
- No box-shadows unless explicitly requested
- Border-radius: 8-24px range, prefer 12-16px for cards

**Implementation checklist:**
- [ ] Read the target file(s) before editing
- [ ] Make minimal edits — only change what's needed for the design
- [ ] Preserve existing functionality (event handlers, state, data flow)
- [ ] Build and verify no compilation errors
- [ ] Start dev server and confirm the page renders

## Design System Reference

### Brand Colors
| Token | Value | Use |
|-------|-------|-----|
| Dark brick | `#8B3A2A` | Navbar, active buttons, headings |
| Light brick | `#A64B3A` | Hero gradient, hover states |
| Terracotta | `#D4A090` | Number accents, dividers, muted text |
| Warm cream | `#FDF0EA` | Button backgrounds, tag pills, cards |
| Page bg | `#fafaf9` | Global background |

### Typography
| Level | Font | Weight | Size |
|-------|------|--------|------|
| Page title | ZCOOL KuaiLe / system | 700 | 22-28px |
| Card title | Noto Sans SC | 600 | 10-13px |
| Body | Noto Sans SC | 400 | 14px |
| Tags/labels | Noto Sans SC | 600 | 8-9px |

### Card Patterns (from history)
- **Flat white**: `background:#fff`, no border, no shadow, padding 10-16px
- **Grid**: 3 columns, gap 8-16px, `grid-template-columns: repeat(3, 1fr)` or fixed widths
- **Row structure**: flex row (number + emoji + title + action) + tags row below
- **Tags**: 8-9px warm pills, `background:#FDF0EA`, `color:#8B3A2A`, `border-radius:4-5px`

## Example Flow

**User:** "优化卡片排版，参考 AussieLingo 风格"

**Response:**
1. Read current component code
2. Find and read AussieLingo reference HTML in `.superpowers/`
3. Create 2-3 mockup options showing different card layouts
4. Present mockups: "A 是扁平宽卡，B 是左边色条，C 是图标顶部。你倾向哪个？"
5. User picks → refine → implement → verify
