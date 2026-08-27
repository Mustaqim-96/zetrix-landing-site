# Zetrix Robotics — Higgsfield Generation Record

Status: Task 3 complete with concerns; three selected 4K source artworks are present, with the Leju Kuavo Workflow-symbol concern recorded below.

User decision on 2026-08-06: retain the selected Leju Kuavo artwork and place it in Figma. The off-reference Workflow symbol and modest pose differentiation are accepted as an explicit exception; no additional generation will be submitted.

## Confirmed reference media

| Stable label | Source file | Confirmed Higgsfield media ID |
| --- | --- | --- |
| mascot | `/Users/mustaqim/Downloads/hf_20260805_140759_b937ef5d-1f7d-4f54-9248-912d98aae4e5.png` | `8dafd720-2aa2-4268-89de-1f9a9a22ad73` |
| brain_circuit | `docs/robotics-cards/icons/brain-circuit.png` | `902dc864-25ea-42b5-8912-31bbfa6097b8` |
| bot | `docs/robotics-cards/icons/bot.png` | `64afecf0-8b3f-4232-962a-33278d8e96ec` |
| workflow | `docs/robotics-cards/icons/workflow.png` | `67c3db15-c6ed-4b7b-a7e7-29fc037e4c4c` |
| route | `docs/robotics-cards/icons/route.png` | `6dc8f020-e9df-4660-9943-49e04234abc0` |
| factory | `docs/robotics-cards/icons/factory.png` | `127c8952-8dfc-41e5-814a-ab0dce689de5` |
| sparkles | `docs/robotics-cards/icons/sparkles.png` | `b4ade00c-3252-497a-a373-64d826cda842` |

All seven uploads returned `status: uploaded`, `type: image`, and `content_type: image/png`.

## Preflight cost estimate

| Field | Value |
| --- | --- |
| Model | `nano_banana_pro` |
| Aspect ratio | `4:5` |
| Resolution | `4k` |
| Count per generation job | `1` |
| Single-job estimate | `4` credits (`4` exact) |
| Three-job estimate | `12` credits (`12` exact) |

The first prompt-less estimate was rejected because Nano Banana Pro requires a prompt. A second read-only estimate used the exact PM01 prompt below with the required output parameters and returned 4 credits. No generation tool was called.

## Exact Task 3 prompts

### PM01

```text
Create a premium 4:5 editorial key visual for the Zetrix robotics ecosystem. Preserve the supplied white humanoid mascot exactly: smooth white ceramic armor, black mechanical joints, glossy black faceplate, two narrow red eyes, and the red illuminated chest core. The mascot is an ecosystem guide, not the PM01 product. Show it in a dark graphite embodied-AI research studio, three-quarter view, interacting with a large floating 3D BrainCircuit symbol and one smaller Bot marker. The 3D symbols must keep the exact recognizable proportions and line relationships of the supplied Lucide references, transformed only through shallow chrome extrusion, white ceramic faces, smoked-glass backing, and restrained red emissive inner edges. Add a sparse red particle lattice and articulated joint rings as secondary atmosphere. Cool soft key light, controlled red rim light, grounded contact shadows, sophisticated cinematic product photography, clean modern composition, generous negative space, high material realism. Keep the main mascot and BrainCircuit symbol inside the central safe crop. Keep the lower 35 percent visually quieter for a glass caption overlay. No text, no letters, no logos, no watermark, no interface labels, no additional branded robot, no invented product model.
```

### Leju Kuavo

```text
Create a premium 4:5 editorial key visual for the Zetrix robotics ecosystem. Preserve the supplied white humanoid mascot exactly: smooth white ceramic armor, black mechanical joints, glossy black faceplate, two narrow red eyes, and the red illuminated chest core. The mascot is an ecosystem guide, not the Leju Kuavo product. Place it in a dark graphite spatial motion laboratory, dynamic but professional three-quarter stance, surrounded by a large dimensional Workflow symbol connecting articulated movement points and two smaller translucent Bot markers. The 3D symbols must preserve the exact recognizable proportions and line relationships of the supplied Lucide references, changed only through shallow chrome extrusion, white ceramic surfaces, smoked glass, and restrained red emissive edges. Use thin orbital motion arcs, joint-position nodes, and synchronized red light trails to communicate coordinated embodied movement without showing another identifiable product. Cool soft key light, subtle red rim light, grounded shadows, cinematic product photography, modern and clean, high material realism. Keep the mascot and primary Workflow symbol inside the central safe crop. Keep the lower 35 percent quieter for a glass caption. No text, no letters, no logos, no watermark, no interface labels, no invented product hardware.
```

### Gausium

```text
Create a premium 4:5 editorial key visual for the Zetrix robotics ecosystem. Preserve the supplied white humanoid mascot exactly: smooth white ceramic armor, black mechanical joints, glossy black faceplate, two narrow red eyes, and the red illuminated chest core. The mascot is an ecosystem guide, not a Gausium cleaning robot. Show it overlooking a dark graphite dimensional facility plane. A large 3D Route symbol traces a precise autonomous navigation path between operational nodes; a smaller Factory symbol establishes the commercial-industrial environment and a restrained Sparkles symbol marks a completed cleaning zone. Every symbol must keep the exact recognizable proportions and line relationships of the supplied Lucide references, transformed only with shallow chrome extrusion, white ceramic faces, smoked-glass layers, and red emissive inner edges. Do not depict invented branded cleaning hardware. Cool soft studio light, restrained red rim light, realistic contact shadows, cinematic product photography, clean modern composition, high material realism. Keep the mascot and Route symbol inside the central safe crop. Keep the lower 35 percent visually quieter for a glass caption overlay. No text, no letters, no logos, no watermark, no interface labels.
```

## Task 3 generation results

Generation and QA completed on 2026-08-06. Higgsfield resolved the requested `nano_banana_pro` model to backend model ID `nano_banana_2`; all completed jobs retained `aspect_ratio: 4:5`, `resolution: 4k`, and `count: 1`. Each raw output is a 3712 x 4608 RGBA PNG.

| Artwork | Job ID | Status | Raw URL timestamp (UTC) | Selected local filename | Selection |
| --- | --- | --- | --- | --- | --- |
| PM01 | `34b26c57-9283-42e8-87f0-cdcb4254b305` | `completed` | `2026-08-06 03:19:23` | `docs/robotics-cards/source/zetrix-robotics-pm01.png` | Selected |
| Leju Kuavo, initial | `3a556a43-b55d-4460-976b-cadb75707406` | `completed` | `2026-08-06 03:19:26` | Downloaded to the mandated Leju path, then replaced by the bounded correction | Rejected: primary Workflow symbol read as circular arrows and the pose duplicated PM01 |
| Gausium | `33e5f7b8-e05d-446c-9569-8388df338865` | `completed` | `2026-08-06 03:19:27` | `docs/robotics-cards/source/zetrix-robotics-gausium.png` | Selected |
| Leju Kuavo, bounded correction | `e69da425-6754-4459-aada-d5642e3e19bb` | `completed` | `2026-08-06 03:23:19` | `docs/robotics-cards/source/zetrix-robotics-leju-kuavo.png` | Selected as the stronger of the two Leju results; residual concern below |

### Raw result URLs

- PM01: `https://d8j0ntlcm91z4.cloudfront.net/user_3HTZJqOwqZSlrhTG2dcowVwmw30/hf_20260806_031923_34b26c57-9283-42e8-87f0-cdcb4254b305.png`
- Leju Kuavo, initial: `https://d8j0ntlcm91z4.cloudfront.net/user_3HTZJqOwqZSlrhTG2dcowVwmw30/hf_20260806_031926_3a556a43-b55d-4460-976b-cadb75707406.png`
- Gausium: `https://d8j0ntlcm91z4.cloudfront.net/user_3HTZJqOwqZSlrhTG2dcowVwmw30/hf_20260806_031927_33e5f7b8-e05d-446c-9569-8388df338865.png`
- Leju Kuavo, bounded correction: `https://d8j0ntlcm91z4.cloudfront.net/user_3HTZJqOwqZSlrhTG2dcowVwmw30/hf_20260806_032319_e69da425-6754-4459-aada-d5642e3e19bb.png`

### Bounded regeneration

One regeneration was used for Leju Kuavo after local visual inspection found two named failures: the primary Workflow symbol was not recognizable and the mascot pose duplicated PM01. The following single correction sentence was appended to the original prompt without changing the approved art direction:

```text
Correction: The primary Workflow symbol was not recognizable and the mascot pose duplicated PM01; render the exact supplied Workflow line geometry visibly at large scale and use a clearly distinct dynamic three-quarter stance, while keeping every other approved constraint unchanged.
```

No PM01 or Gausium regeneration was used. The one-regeneration limit for Leju Kuavo is exhausted.

### Local visual assessment

- Mascot identity: preserved across all selected files. The white ceramic armor, black mechanical joints, glossy black faceplate, narrow red eyes, red chest core, silhouette, and panel layout remain consistent with the approved reference.
- PM01: selected. The BrainCircuit symbol is prominent and recognizable, the smaller Bot marker is visible, the interaction pose and research-studio composition are distinct, and the lower region is comparatively quiet.
- Leju Kuavo: the corrected result was selected because it removes the misleading circular-arrow motif and is the stronger visual. It preserves the mascot and brand family and contains no forbidden text or hardware. Concern: its large diamond-like primary mark still does not reproduce the supplied Lucide Workflow two-node connected geometry, and the stance remains closer to the other cards than requested.
- Gausium: selected. Route, Factory, and Sparkles are recognizable; the facility-plane composition is distinct; the dark lower region is suitable for a caption overlay; no cleaning robot or invented branded hardware appears.
- Set-level review: all three have distinct compositions and a consistent graphite / white / chrome / red family. No visible embedded text, letters, logos, watermarks, interface labels, or invented branded product hardware were found. Pose diversity is modest: PM01 has an interaction gesture, while the Leju and Gausium mascots use similar neutral stances.

### Selected-file verification

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `docs/robotics-cards/source/zetrix-robotics-pm01.png` | 26,054,618 | `ca8cf7235616e55c8dd8d1cb60714367323ae57a65dd297d071f08c671fdea2f` |
| `docs/robotics-cards/source/zetrix-robotics-leju-kuavo.png` | 25,963,024 | `ddc6ecd61789155779c34209be268a445bb0b4a8560de758f102a1e553d7d92a` |
| `docs/robotics-cards/source/zetrix-robotics-gausium.png` | 24,058,799 | `6a2095b40522ab8536f6416d5828d4d6a20b05cb87c305a3c53883e48f0abc37` |

Credits/jobs used: 4 completed generation jobs x 4 exact credits per preflight = 16 credits total. Three files were selected; one Leju candidate was rejected and replaced.

## Task 6 final Figma QA

Final QA completed on 2026-08-06 against Figma file `r7gWbEX8lfXdCNqERaJWDn`, Section 05 frame `11:683` (`05 — Robotics Layer`). The live structure passed the required audit and the rendered 1440 × 1024 section passed visual inspection. No Figma correction was needed or applied.

The user-approved Leju Kuavo artwork remained binding throughout this pass. It was not regenerated, replaced, recolored, or repositioned.

### Final artwork and Figma placement

| Product | Final local filename | Final-file SHA-256 | Artwork node | Card node | Caption node | Arrow vector | Figma image hash | Scale mode |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PM01 | `docs/robotics-cards/final/zetrix-robotics-pm01-figma.jpg` | `3d8550882cee44137237d701b3c3e25690afd654076223c57278b010d59b89a2` | `114:124` | `114:121` | `115:119` | `116:121` | `b3e47178160c02222776d0a427ff15060ab11ba8` | `FILL` |
| Leju Kuavo | `docs/robotics-cards/final/zetrix-robotics-leju-kuavo-figma.jpg` | `d4b25893e885678901905e1d512a7a718bf61993794619f864b927a53fb94240` | `114:125` | `114:122` | `115:122` | `117:121` | `e3ba02f959532272620cc65d7baa3595bab67044` | `FILL` |
| Gausium | `docs/robotics-cards/final/zetrix-robotics-gausium-figma.jpg` | `c3d5b4cd12377e33b8b6277690f51f6427c021411f7f8aed4bd6d6a6fb36b265` | `114:126` | `114:123` | `115:125` | `117:126` | `8da53914e7c5803b002234fae59402a0f31c52ab` | `FILL` |

Wrapper node: `114:120`. Hidden archive node: `114:119`, containing original card frames `21:80`, `21:84`, and `21:88`. Protected header nodes: `21:77`, `21:78`, and `21:79`.

### Final QA screenshots

| Capture | Local filename | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| Initial full-section render | `docs/robotics-cards/qa/zetrix-robotics-section-05-qa-initial.png` | 1440 × 1024 | `f2bfef2b5562fa332cdb7e4904578128b1c7bbace620e7ff7869c51a4af541a7` |
| Final confirmation render | `docs/robotics-cards/qa/zetrix-robotics-section-05-qa-confirmation.png` | 1440 × 1024 | `f2bfef2b5562fa332cdb7e4904578128b1c7bbace620e7ff7869c51a4af541a7` |

The identical screenshot hashes confirm that the live Figma composition did not change between the initial inspection and final confirmation. The permitted correction pass remained unused.

## Friendly-pose refresh — generation results

Generation and QA completed on 2026-08-06. The workspace started with 8 credits and ended with 0 credits. Exactly two jobs were submitted at the Task 1 authorized cost of 4 credits each; no correction job was submitted. Higgsfield resolved the requested `nano_banana_pro` alias to backend model ID `nano_banana_2`. Both completed jobs retained `aspect_ratio: 4:5`, `resolution: 4k`, and `count: 1`.

| Artwork | Job ID | Status | Raw URL timestamp (UTC) | Selected source | Credits |
| --- | --- | --- | --- | --- | ---: |
| Leju Kuavo friendly v2 | `b0868dee-1bb1-475b-9643-d21e08fcfc73` | `completed` | `2026-08-06 04:39:54` | `docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png` | 4 |
| Gausium friendly v2 | `af9e08aa-3f21-48f5-bc01-9b03a0373108` | `completed` | `2026-08-06 04:40:05` | `docs/robotics-cards/source/zetrix-robotics-gausium-friendly-v2.png` | 4 |

### Exact friendly-pose prompts

#### Leju Kuavo friendly v2

```text
Edit the supplied approved Zetrix Leju Kuavo editorial card while preserving its dark graphite spatial-motion laboratory, large diamond-like dimensional workflow structure, orbital red motion trails, camera angle, premium white-chrome-red palette, lighting, materials, and lower caption-safe region. Preserve the supplied Zetrix mascot identity exactly: smooth white ceramic armor, black mechanical joints, glossy black faceplate, two narrow red eyes, and red illuminated chest core. Change the mascot posture and mood only: use a welcoming open-palm gesture toward the viewer, a subtle friendly head tilt, relaxed shoulders, and a slightly open three-quarter stance that communicates collaboration, curiosity, and embodied intelligence. The pose must feel warm and approachable but still professional and premium, not cartoonish. Keep the mascot and key structures inside the central safe crop and keep the lower 35 percent visually quiet for the existing glass caption. Do not change or correct the accepted primary symbol. No smile drawn on the faceplate, no mouth, no text, no letters, no logos, no watermark, no additional mascot, and no invented product hardware.
```

References: accepted Leju job `e69da425-6754-4459-aada-d5642e3e19bb`; confirmed mascot media `8dafd720-2aa2-4268-89de-1f9a9a22ad73`.

#### Gausium friendly v2

```text
Edit the supplied approved Zetrix Gausium editorial card while preserving its dark graphite dimensional facility plane, recognizable 3D Route path, Factory and Sparkles symbols, camera angle, premium white-chrome-red palette, lighting, materials, and lower caption-safe region. Preserve the supplied Zetrix mascot identity exactly: smooth white ceramic armor, black mechanical joints, glossy black faceplate, two narrow red eyes, and red illuminated chest core. Change the mascot posture and mood only: create an upbeat guiding pose with one open hand actively presenting or tracing the illuminated cleaning route, the other arm resting naturally, a gentle head turn toward the route, relaxed shoulders, and a confident asymmetric stance that communicates helpful autonomous service and movement. Make the silhouette clearly different from Leju and PM01 while remaining professional and premium, not cartoonish. Keep the mascot and Route symbol inside the central safe crop and keep the lower 35 percent visually quiet for the existing glass caption. No smile drawn on the faceplate, no mouth, no text, no letters, no logos, no watermark, no additional mascot, and no invented cleaning hardware.
```

References: accepted Gausium job `33e5f7b8-e05d-446c-9569-8388df338865`; confirmed mascot media `8dafd720-2aa2-4268-89de-1f9a9a22ad73`.

### Friendly-pose raw result URLs

- Leju Kuavo: `https://d8j0ntlcm91z4.cloudfront.net/user_3HTZJqOwqZSlrhTG2dcowVwmw30/hf_20260806_043954_b0868dee-1bb1-475b-9643-d21e08fcfc73.png`
- Gausium: `https://d8j0ntlcm91z4.cloudfront.net/user_3HTZJqOwqZSlrhTG2dcowVwmw30/hf_20260806_044005_af9e08aa-3f21-48f5-bc01-9b03a0373108.png`

### Friendly-pose selected-file verification

| File | Format | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| `docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png` | PNG RGBA | 3712 x 4608 | 26,215,633 | `23efc53d1c592787d268577cb8b18e6cd3754eb8bcbaa021f415d0be17da3745` |
| `docs/robotics-cards/source/zetrix-robotics-gausium-friendly-v2.png` | PNG RGBA | 3712 x 4608 | 26,604,156 | `dbc8d7fa140e22bb96c5d2270a28e3c0050ef3abf8e1dd50642dc4990774bffd` |
| `docs/robotics-cards/final/zetrix-robotics-leju-kuavo-friendly-v2-figma.jpg` | JPEG RGB, quality 92 | 2062 x 2560 | 870,912 | `1a9a473c5db8ab8a60e96b3a769ca392d72820863bfd99e29dd07adf8d2a1208` |
| `docs/robotics-cards/final/zetrix-robotics-gausium-friendly-v2-figma.jpg` | JPEG RGB, quality 92 | 2062 x 2560 | 969,016 | `27bb9767c29432faaf6808ed38d94dcef74755b00df0a53f28cdb48dab78a73b` |

Both Figma derivatives preserve the source aspect ratio to the nearest whole pixel and are below the 10,485,760-byte limit.

### Friendly-pose visual assessment

- Mascot identity is preserved in both outputs: smooth white ceramic armor, black mechanical joints, glossy black faceplate, two narrow red eyes, and red chest core. Neither image adds a mouth, text, letters, logos, watermark, another mascot, or invented product hardware.
- Leju Kuavo reads as welcoming and collaborative. Its two open palms, mild head tilt, relaxed shoulders, and open three-quarter stance provide the requested friendly posture while retaining the accepted diamond-like symbol, orbital trails, laboratory concept, central-safe composition, and comparatively quiet lower region.
- Gausium reads as upbeat and helpful. Its raised open hand, head turn, relaxed opposite arm, and asymmetric stance create a silhouette clearly different from Leju. Route, Factory, and Sparkles remain recognizable; the route and mascot are centrally safe, and the dark lower band is suitable for the caption.
- Set-level selection: both first candidates were selected because they preserve the accepted card concepts and mascot identity, introduce distinct friendly silhouettes, remain professional rather than cartoonish, and contain no forbidden content.
- Concern: Gausium's raised hand presents the Sparkles marker more directly than it traces the Route path. The overall scene still communicates guidance and autonomous service, so the candidate was selected. With the exact two-job credit ceiling exhausted, no optional correction was permissible or submitted.

Existing unversioned source and final files were not overwritten. Their recorded SHA-256 values were rechecked after the refresh and remain unchanged.

## Friendly-pose refresh — Figma placement and Section 05 QA

Figma placement and QA completed on 2026-08-06 in file `r7gWbEX8lfXdCNqERaJWDn`. Only the image fills on Leju node `114:125` and Gausium node `114:126` were replaced. Both uploads used `image/jpeg` and `scaleMode: FILL`.

| Artwork | Figma-ready file | File SHA-256 | Bytes | Node | Before image hash | Final image hash | Scale mode |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| Leju Kuavo friendly v2 | `docs/robotics-cards/final/zetrix-robotics-leju-kuavo-friendly-v2-figma.jpg` | `1a9a473c5db8ab8a60e96b3a769ca392d72820863bfd99e29dd07adf8d2a1208` | 870,912 | `114:125` | `e3ba02f959532272620cc65d7baa3595bab67044` | `1714db12920257803f830f00fcda51c3d35c2d15` | `FILL` |
| Gausium friendly v2 | `docs/robotics-cards/final/zetrix-robotics-gausium-friendly-v2-figma.jpg` | `27bb9767c29432faaf6808ed38d94dcef74755b00df0a53f28cdb48dab78a73b` | 969,016 | `114:126` | `8da53914e7c5803b002234fae59402a0f31c52ab` | `9e4441bdb73e91749d817b3a9ff354494742fc19` | `FILL` |

### Friendly-pose structural audit

- Section `11:683` remained `1440 × 1024` with 48 nodes. Its canonical FNV-1a fingerprint excluding only the two intended target-fill payloads was identical before and after: `6ecf80e0` over 25,630 serialized characters.
- PM01 node `114:124` remained unchanged with image hash `b3e47178160c02222776d0a427ff15060ab11ba8`, `FILL`, identity transform, and fingerprint `c38421fe` over 534 serialized characters.
- Native caption frame `115:122` remained unchanged at fingerprint `71d43af8` over 4,219 serialized characters.
- Native caption frame `115:125` remained unchanged at fingerprint `477f58c4` over 4,183 serialized characters.
- Protected headers remained unchanged: `21:77` `1041cd6a/622`, `21:78` `8137c366/593`, and `21:79` `653fe3ab/678`.
- Both final target paints are single visible `IMAGE` fills at opacity `1`, `FILL`, identity transform, zero image-filter adjustments, and the new image hashes above. No other Section 05 node changed.

### Friendly-pose Section 05 render

| Capture | Dimensions | Bytes | SHA-256 | Live confirmation |
| --- | --- | ---: | --- | --- |
| `docs/robotics-cards/qa/zetrix-robotics-section-05-friendly-v2.png` | 1440 × 1024 | 785,001 | `90662a358aa9d47a13c47f15923ec67b249c42ff8a872803d84555447189f325` | Fresh live render matched byte-for-byte |

The live section shows Leju's two-open-palm welcoming pose and Gausium's raised-hand guiding pose as distinct, friendly, and professionally restrained. Both subjects and their retained scene anchors are safely cropped; the original native glass captions remain readable and correctly layered. No bounded crop, position, contrast, or caption-fit correction was necessary, so the permitted correction pass remained unused.

The two friendly-v2 source PNG checksums were rechecked after placement and remain `23efc53d1c592787d268577cb8b18e6cd3754eb8bcbaa021f415d0be17da3745` for Leju and `dbc8d7fa140e22bb96c5d2270a28e3c0050ef3abf8e1dd50642dc4990774bffd` for Gausium.

An independent read-only whole-work review returned `SPEC PASS`, `QUALITY APPROVED`, and `READY`, with no P0-P2 findings. Its only P3 note retained the non-blocking Gausium Sparkles-versus-Route interpretation concern already documented above.

## Product-faithful Kuavo-MY and PM01 replacement — 2026-08-28

The built-in image editing workflow replaced the obsolete generic humanoid figures with faithful visualizations of the actual products Zetrix sells. The existing card artwork controlled composition and effects; the supplied product pages and downloaded reference photographs controlled robot identity. Manufacturer logos and all readable text were intentionally omitted.

### Reference inputs

- Kuavo-MY product page: `https://www.lejurobot.com/en/products/kuavo-my`
- Kuavo-MY local identity reference: `/private/tmp/kuavo-my-reference.png`
- PM01 product page: `https://www.humanoid-robots.io/robot/pm01-by-engineai`
- PM01 local identity reference: `/private/tmp/pm01-reference.jpeg`

### Final prompt set

#### Kuavo-MY

```text
Replace the generic white humanoid in the existing Leju card with a faithful full-body depiction of the actual Kuavo-MY product. Use the product reference as the authority for its rounded glossy black crown and horizontal sensor visor, white lower face shell, white-and-black torso, exposed dark arm mechanisms, white shoulder shells, grey articulated hands, authentic biped proportions, and recognizable joint construction. Use a warm professional open-hand service pose. Preserve the edit target's dark graphite spatial-motion laboratory, dimensional workflow frame, floating icon medallions, orbital arcs, red accent trails, grounded reflection, central safe crop, and quiet lower caption region. Use premium cinematic 3D product visualization with realistic polymer, metal, rubber, and glass. Only one robot; no generic red-eyed faceplate, invented chest core, superhero armor, hybrid hardware, text, letters, logos, wordmarks, watermark, labels, or extra robots.
```

#### PM01

```text
Replace the generic white humanoid in the existing PM01 card with a faithful full-body depiction of the actual PM01 product. Use the product reference as the authority for its compact gunmetal and silver chassis, layered helmet-like sensor head, narrow upper sensor slot, lower multi-camera band, sculpted metallic jaw housing, dark neck and torso structure, orange-red chest interface, circular joint housings, authentic proportions, and articulated dark hands. Use a confident research-oriented pose. Preserve the edit target's graphite embodied-AI studio, BrainCircuit and Bot symbols, red particle lattice, joint rings, grounded reflection, central safe crop, and quiet lower caption region. Use premium cinematic 3D product visualization with realistic bead-blasted aluminum, painted metal, rubber, and glass. Only one robot; no white ceramic mascot armor, generic glowing-eye faceplate, Kuavo features, text, letters, logos, wordmarks, watermark, labels, or extra robots.
```

#### PM01 bounded correction

```text
Remove every faint pseudo-letter, wordmark, logo-like scribble, and readable or unreadable text mark from the robot's forehead band, face housing, chest plates, torso, limbs, and every other surface. Replace the markings with clean continuous bead-blasted gunmetal or silver material matching the surrounding panel. Change only the unwanted markings; preserve the exact PM01 geometry, orange-red chest panel, pose, framing, graphite background, BrainCircuit icon, Bot icon, particle lattice, joint rings, lighting, shadows, reflections, and composition.
```

### Selected outputs

| Artwork | Built-in selected output | Project source | Dimensions | Format | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| Kuavo-MY | `exec-29923b29-e9bf-4920-a614-2617a47552bb.png` | `docs/robotics-cards/source/zetrix-robotics-leju-kuavo-friendly-v2.png` | 1125 × 1398 | PNG RGB | `35dff3a3a13121f2bee147c3674028e2ffbb7f2a124340cfac1b4d9d73babc89` |
| PM01 corrected | `exec-1768f657-5172-41f7-8ce0-ed64108386b8.png` | `docs/robotics-cards/source/zetrix-robotics-pm01.png` | 1123 × 1401 | PNG RGB | `5f97467c275d895c36ea84a26ab5fdcc0eac0a16d12cdbbb2b4fbcdc71615e51` |

### Visual acceptance

- Kuavo-MY retains the real product's rounded sensor head, white lower face shell, white-and-black chassis, exposed arm mechanisms, articulated grey hands, and service-oriented proportions. The original workflow frame, floating markers, orbital arcs, graphite background, and red light treatment remain legible.
- PM01 retains the real product's layered dual-band sensor head, compact silver/gunmetal chassis, orange-red chest interface, dark mechanical structure, and circular joint housings. BrainCircuit, Bot, particle lattice, and red joint rings remain secondary scene elements.
- The PM01 first candidate contained faint pseudo-lettering and was rejected. The bounded correction removed it while keeping the composition and hardware identity.
- Both selected cards use a consistent charcoal/graphite backdrop, controlled red illumination, grounded full-body framing, central-safe placement, and a comparatively quiet lower region.
- No generic white Zetrix mascot, readable text, logo, wordmark, watermark, extra robot, or cross-product hybrid hardware is visible in either selected output.
