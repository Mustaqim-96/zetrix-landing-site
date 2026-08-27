# Product-Faithful Robotics Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two generic humanoid robotics-card sources with product-faithful Kuavo-MY and PM01 artwork while preserving the existing Zetrix card family.

**Architecture:** Treat each replacement as a separate high-fidelity compositing edit. For each card, the existing source controls portrait layout and effects while a downloaded product photograph controls the robot's physical identity; final inspection checks both individual fidelity and cross-card consistency.

**Tech Stack:** Built-in image generation/editing, local image inspection, ImageMagick or bundled image metadata tools when available, Git.

## Global Constraints

- Use the real product reference as the authority for robot head, torso, limbs, joints, materials, and proportions.
- Use the existing card as the authority for dark graphite atmosphere, floating icons, red accent lighting, portrait composition, and quiet lower caption area.
- Both cards must share a consistent background colour and premium cinematic rendering treatment.
- Omit text, letters, logos, wordmarks, watermarks, extra robots, generic white Zetrix mascots, and invented product hardware.
- Replace the two existing source PNG paths requested by the user.

---

### Task 1: Generate the Product-Faithful Kuavo-MY Card

**Files:**
- Modify: `docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png`
- Reference: `/private/tmp/kuavo-my-reference.png`

**Interfaces:**
- Consumes: existing Kuavo card as edit target; Kuavo-MY product photograph as identity reference.
- Produces: a portrait PNG at the existing Kuavo source path.

- [x] **Step 1: Load both local images for visual editing context**

Inspect the existing card and `/private/tmp/kuavo-my-reference.png` with the local image viewer.

- [x] **Step 2: Generate one high-fidelity edited candidate**

Use the built-in image editor with both references. Require the actual Kuavo-MY rounded black visor and crown, white lower face shell, white-and-black torso, exposed dark arm mechanisms, grey articulated hands, authentic proportions, and an open-hand service pose. Preserve the dimensional workflow structure, floating markers, orbital arcs, graphite background, red accent trails, central safe crop, and quiet lower region.

- [x] **Step 3: Inspect product identity and invariants**

Confirm the robot is recognizably Kuavo-MY and that no generic red-eyed faceplate, invented chest core, text, logo, or extra robot appears. If one bounded correction is required, state only the failed invariant and regenerate once.

- [x] **Step 4: Save the selected PNG to the project**

Copy the selected built-in output to `docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png`, intentionally replacing the obsolete generic image approved for replacement.

### Task 2: Generate the Product-Faithful PM01 Card

**Files:**
- Modify: `docs/robotics-cards/source/zetrix-robotics-pm01.png`
- Reference: `/private/tmp/pm01-reference.jpeg`

**Interfaces:**
- Consumes: existing PM01 card as edit target; PM01 product photograph as identity reference.
- Produces: a portrait PNG at the existing PM01 source path.

- [x] **Step 1: Load both local images for visual editing context**

Inspect the existing card and `/private/tmp/pm01-reference.jpeg` with the local image viewer.

- [x] **Step 2: Generate one high-fidelity edited candidate**

Use the built-in image editor with both references. Require the actual PM01 compact gunmetal/silver chassis, layered metallic sensor head with horizontal camera bands, dark neck and torso structure, orange-red chest interface, circular joint housings, authentic proportions, and a confident research pose. Preserve the BrainCircuit and Bot symbols, red particle lattice, joint-ring accents, graphite background, central safe crop, and quiet lower region.

- [x] **Step 3: Inspect product identity and invariants**

Confirm the robot is recognizably PM01 and that no white ceramic mascot armor, generic glossy faceplate, text, logo, or extra robot appears. If one bounded correction is required, state only the failed invariant and regenerate once.

- [x] **Step 4: Save the selected PNG to the project**

Copy the selected built-in output to `docs/robotics-cards/source/zetrix-robotics-pm01.png`, intentionally replacing the obsolete generic image approved for replacement.

### Task 3: Verify the Two-Card Set

**Files:**
- Verify: `docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png`
- Verify: `docs/robotics-cards/source/zetrix-robotics-pm01.png`
- Modify: `docs/robotics-cards/zetrix-robotics-generation-record.md`

**Interfaces:**
- Consumes: both selected source PNGs.
- Produces: recorded dimensions, checksums, prompts, and visual acceptance results.

- [x] **Step 1: Check file integrity and metadata**

Run:

```bash
file docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png docs/robotics-cards/source/zetrix-robotics-pm01.png
shasum -a 256 docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png docs/robotics-cards/source/zetrix-robotics-pm01.png
```

Expected: two readable portrait PNG files with distinct non-empty SHA-256 values.

- [x] **Step 2: Inspect both images side by side**

Confirm faithful product identity, matching graphite background colour, compatible lighting and material treatment, floating icons around each product, central-safe composition, quiet lower caption region, and absence of text, logos, watermarks, hybrid hardware, or extra robots.

- [x] **Step 3: Record the generation pass**

Append the final built-in prompt set, selected output paths, dimensions, SHA-256 values, and acceptance findings to `docs/robotics-cards/zetrix-robotics-generation-record.md`.

- [x] **Step 4: Run repository diff checks**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only the two approved image sources, generation record, design spec, and implementation plan are changed or committed by this task.

- [x] **Step 5: Commit the completed asset update**

```bash
git add -f docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png docs/robotics-cards/source/zetrix-robotics-pm01.png docs/robotics-cards/zetrix-robotics-generation-record.md docs/superpowers/plans/2026-08-28-product-faithful-robotics-cards.md
git commit -m "feat: use product-faithful robotics card artwork"
```
