# Phase 12 — Suno V6 Experimental Evidence Queue

**Purpose:** move the project from infrastructure/audit work into actual evidence generation without turning hypotheses into fake rules.

## Operating rule

**One variable → multiple generations → compare → repeat → record failures.**

Every experiment must record:

- model: V6 / V6-WILD / V6-MINI
- exact model/version shown by Suno
- Weirdness / Variety / Style Influence / Audio Influence
- Max Mode / Personalize state
- Style field
- Lyrics field
- Exclude field
- structure cues
- reference audio or image, if any
- the single variable being tested
- control condition
- test condition
- generation count
- observations
- failure modes
- repeat results
- confidence

## Evidence labels

- **A — Official:** directly supported by current Suno documentation.
- **B — Repeated community:** reported independently by multiple users, but not official.
- **C — Reproducible experiment:** independently repeatable under recorded conditions.
- **D — Hypothesis:** plausible interpretation without sufficient replication.
- **E — Experimental:** deliberately unusual input or exploratory behavior.

## Experiment 01 — Style hierarchy vs tag pile

**Question:** Does prioritized producer-style ordering outperform a flat pile of genre/mood/instrument tags?

**Control:** short genre + mood prompt.

**Test:** Identity → Groove → Instrument Roles → Vocal Performance → Arrangement Arc → Mix Relationships → Exclude.

**Keep fixed:** lyrics, model, sliders, generation count and song concept.

**Score:** identity adherence, groove, vocal behavior, arrangement, mix clarity, failure count.

**Evidence target:** C.

## Experiment 02 — Lyrics vs Style vocal control

**Question:** Which vocal properties are more stable when expressed globally in Style versus locally in Lyrics?

**Control:** vocal identity and register described only in Style.

**Test:** identical Style, with local register/delivery cues added to selected lyric sections.

**Variables:** register, breathiness, intensity, whisper/spoken delivery, sustained phrase.

**Score:** vocal register, timbre stability, phrasing, section-to-section consistency.

**Evidence target:** C.

## Experiment 03 — Structure-tag specificity sweep

**Question:** How much detail is useful inside section cues before competing instructions appear?

A: `[Chorus]`

B: `[Chorus — huge, emotional]`

C: `[Chorus — huge emotional lift; full drums; layered harmony; sustained hook]`

Run the same lyric and Style across all three levels.

**Score:** section arrival, arrangement behavior, vocal behavior, prompt adherence.

**Evidence target:** C.

## Experiment 04 — Symbol payload

**Question:** Do symbol density, repetition or placement correlate with repeatable changes?

Test separately:

- repeated symbol clusters
- mixed Unicode
- punctuation runs
- symbols before the semantic prompt
- symbols after the semantic prompt
- symbols in Style only
- symbols in Lyrics only
- symbols in both

Use a no-symbol control.

**Evidence target:** E → C only if replicated.

**Rule:** never assign a fixed meaning to a symbol from a single output.

## Experiment 05 — Gibberish / fake filename probe

**Question:** Do arbitrary lexical shapes correlate with reproducible musical differences?

Test:

- `glitch_matrix.exe`
- `umbrella_milkshake2.dll`
- `velvet//signal::404`
- an equally long ordinary phrase
- a random nonsense phrase of similar token/character length

Only one string changes per run.

**Evidence target:** E.

## Experiment 06 — V6 vs V6-WILD vs V6-MINI

**Question:** What actually changes when the same creative brief is moved between the three current model branches?

Use identical Style, Lyrics, Exclude, reference and settings wherever the interface allows.

**V6:** control.

**V6-WILD:** discovery branch.

**V6-MINI:** fast-iteration branch.

**Score:** adherence, vocal identity, arrangement, instrumentation, dynamics, mix clarity, novelty, usable sections and failures.

**Evidence target:** C.

## Experiment 07 — Audio-reference contribution

**Question:** Does adding a reference materially improve a target characteristic that is difficult to express in text?

Compare:

A. text-only
B. same text + reference

Keep all textual instructions unchanged.

**Score:** timing feel, articulation, timbre relationships, arrangement feel, performance texture.

**Evidence target:** C.

## Experiment 08 — Edit/Replace vs full regeneration

**Question:** When one section fails, does local editing preserve more useful information than regenerating the entire song?

Use a song with a strong majority and one known weak section.

Compare:

A. full regeneration
B. section-level Edit/Replace

**Score:** preserved chorus/vocal/instrument identity, repair quality, new failure count.

**Evidence target:** C.

## Experiment 09 — Remaster boundary test

**Question:** Which defects are actually improved by Remaster versus defects that should be addressed at generation/edit/production level?

Build a small defect set:

- dull/muffled mix
- vocal masking
- excessive reverb
- weak low end
- unwanted arrangement change

Do not assume Remaster is a universal audio fixer.

**Evidence target:** C.

## Experiment 10 — Chorus reproducibility

**Question:** Which lyric-geometry changes improve repeated chorus behavior?

Hold Style fixed while testing one at a time:

- syllable density
- line length
- punctuation
- repeated wording
- line breaks
- section cue

Generate multiple samples per condition.

**Score:** melody similarity, rhythmic phrasing, vocal register, hook preservation.

**Evidence target:** C.

## Experiment 11 — Prompt-density threshold

Compare:

- **A:** identity only
- **B:** identity + instrumentation
- **C:** identity + instrumentation + performance + arrangement
- **D:** full producer brief + mix + exclusions

The goal is not to prove that longer is better. The goal is to find where additional information stops helping or begins competing.

**Evidence target:** C.

## Experiment 12 — Contradiction hierarchy

Deliberately introduce one conflict:

- intimate close vocal + huge distant arena vocal
- sparse arrangement + maximal wall of sound
- dry vocal + cavernous reverb
- restrained delivery + explosive delivery

Do not generalize from one run. Repeat across multiple songs and model branches.

**Evidence target:** D → C if replicated.

## Failure corpus

Failures are first-class evidence. Use a consistent taxonomy:

- buried/distant vocal
- unexpected vocal register
- timbre drift
- chorus inconsistency
- unwanted doubles/choir
- instrument disappearance
- unexpected instrumentation
- genre drift
- stuttering/repeated fragments
- late-song degradation
- volume drift
- excessive reverb
- harshness/hiss
- low-end buildup
- clipping/artifacts
- phase/stereo instability
- premature ending
- vocal continuation past musical ending
- ignored section direction

For each failure, record the exact timestamp/section and conditions.

## Research status rule

A generation that sounds better is not automatically proof of causation.

A generation that sounds worse is not proof that the technique never works.

A useful finding becomes stronger only when:

1. the variable is isolated;
2. multiple generations agree;
3. the result survives repetition;
4. the same effect appears across more than one song when appropriate;
5. the conditions are recorded;
6. competing explanations are tested.

## What Phase 12 can and cannot do

The website can define the experimental design, preserve prompts/settings, classify evidence and document results. It cannot honestly manufacture Suno generation results. Actual result rows must come from real Suno generations and be promoted from E/D to C only after reproducibility.

## Current research priority

Start with **01 → 02 → 03 → 06 → 08 → 10**. These experiments directly test the central V6 operating model and are more valuable than adding another hundred speculative prompt tricks.

The project is now in **evidence-generation mode**, not infrastructure-rebuild mode.
