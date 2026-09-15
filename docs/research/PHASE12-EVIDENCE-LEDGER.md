# Phase 12 — V6 Evidence Ledger

This ledger is intentionally **result-first**. It does not promote an experiment to a reproducible finding until actual Suno generations have been run under recorded conditions.

## Evidence status

| Status | Meaning |
|---|---|
| A | Official Suno documentation |
| B | Repeated community evidence |
| C | Reproducible controlled experiment |
| D | Hypothesis / interpretation |
| E | Deliberately experimental input |
| UNTESTED | Protocol exists; no generation result recorded yet |

## Current official baseline

| Item | Current evidence | Source |
|---|---|---|
| v6 | Flagship current model; strongest control/precision positioning | Official Suno current-model documentation |
| v6-wild | Experimental branch; less predictable and more varied | Official Suno current-model documentation |
| v6-mini | Faster v6-generation option available to all users | Official Suno current-model documentation |
| Plain-language editing | Current v6 workflow | Official Suno release notes |
| Single-lyric updating | Current v6 workflow | Official Suno release notes |
| Audio/reference-driven creation | Current v6 workflow | Official Suno release notes |
| Up to 8-minute generations | Current v6 family capability | Official Suno release notes / Making Music help |

## Experiment register

| ID | Experiment | Control | Test | Status | Result | Confidence |
|---|---|---|---|---|---|---|
| 01 | Style hierarchy vs tag pile | Short genre + mood | Producer hierarchy | UNTESTED | — | — |
| 02 | Lyrics vs Style vocal control | Vocal behavior only in Style | Local lyric cues | UNTESTED | — | — |
| 03 | Structure-tag specificity | `[Chorus]` | Longer cue variants | UNTESTED | — | — |
| 04 | Symbol payload | No symbols | Isolated symbol changes | UNTESTED | — | — |
| 05 | Gibberish / fake filename | Ordinary phrase | Arbitrary filename-like token | UNTESTED | — | — |
| 06 | V6 / V6-WILD / V6-MINI | V6 | Same brief on other branches | UNTESTED | — | — |
| 07 | Audio-reference contribution | Text only | Same text + reference | UNTESTED | — | — |
| 08 | Edit/Replace vs regeneration | Full regeneration | Local repair | UNTESTED | — | — |
| 09 | Remaster boundary | Source defect | Remaster | UNTESTED | — | — |
| 10 | Chorus reproducibility | Baseline lyric geometry | One geometry variable | UNTESTED | — | — |
| 11 | Prompt-density threshold | Identity only | Increasing detail | UNTESTED | — | — |
| 12 | Contradiction hierarchy | Non-conflicting brief | One deliberate conflict | UNTESTED | — | — |

## Required result record

```text
EXPERIMENT ID:
DATE / TIME:
SONG / PROJECT ID:
MODEL AS SHOWN BY SUNO:
MODEL BRANCH: V6 / V6-WILD / V6-MINI
WEIRDNESS:
VARIETY:
STYLE INFLUENCE:
AUDIO INFLUENCE:
MAX MODE:
PERSONALIZE:
DURATION:
VOCAL GENDER:

STYLE:

LYRICS:

EXCLUDE:

STRUCTURE CUES:

REFERENCE AUDIO / IMAGE:

VARIABLE CHANGED:
CONTROL CONDITION:
TEST CONDITION:
GENERATION COUNT:

OBSERVATIONS:

FAILURES + TIMESTAMPS:

WHAT IMPROVED:
WHAT GOT WORSE:

REPEAT #1:
REPEAT #2:
REPEAT #3:

CROSS-SONG REPLICATION:
CROSS-MODEL REPLICATION:

RESULT STATUS: UNTESTED / E / D / C
CONFIDENCE: LOW / MEDIUM / HIGH
CONCLUSION:
COMPETING EXPLANATIONS:
NEXT TEST:
```

## Promotion rule

Do not change `UNTESTED`, `E`, or `D` to `C` merely because a generation sounds better.

A result should reach **C — reproducible experiment** only after the variable is isolated, multiple generations are compared, the effect survives repetition, conditions are preserved, and plausible competing explanations have been tested.

## Failure-first rule

Record failures with the same precision as successes. A failed generation can reveal model behavior, prompt conflicts, unstable sections, or limits of a technique.

## Phase 12 starting sequence

Prioritize **01 → 02 → 03 → 06 → 08 → 10**. These six experiments test the central V6 control model before expanding into more exotic probes.

## Current limitation

This repository can preserve experimental design and evidence records, but it cannot honestly fabricate Suno generation outcomes. Actual result rows must be filled from real generations.
