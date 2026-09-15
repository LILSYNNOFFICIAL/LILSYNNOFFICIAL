# Suno V6 Research Evidence Matrix

> Phase 2 research corpus. This file separates documented product behavior from community observations and experimental hypotheses so later guide edits do not turn folklore into fake API guarantees.

**Research date:** 2026-09-15  
**Primary focus:** Suno v6 / v6-wild / v6-mini  
**Legacy scope:** v5.5, v5, v4.5 where techniques may transfer  
**Rule:** A community claim is not an official control unless Suno documents it.

## Evidence scale

| Level | Meaning | Site treatment |
|---|---|---|
| A | Official Suno documentation / release material | State as confirmed product behavior, with source. |
| B | Repeated community evidence across multiple users/posts | State as community observation; qualify by model/version/settings. |
| C | Individual reproducible experiment | Label as an experiment; record conditions before generalizing. |
| D | Interesting hypothesis with insufficient replication | Keep as hypothesis, not instruction. |
| E | Deliberately weird / novel experimentation | Put in Experimental Lab; never imply deterministic behavior. |

## Current model family

### A — Official

Suno currently describes **v6** as its flagship model emphasizing control, precision, expressive results, and polished output. **v6-wild** is explicitly positioned for less predictable experimentation and unexpected results. **v6-mini** is the faster, lighter variant available to all users. Suno says all three support generations up to eight minutes.  
Source: https://help.suno.com/en/articles/13924737  
Source: https://help.suno.com/en/articles/13924801  
Source: https://suno.com/release-notes

### B — Community

Early v6 users report materially different behavior from v5/v5.5, including changes in prompt adherence, vocal character, production quality, and repeatability. Reports conflict: some users find v6 substantially better at complex prompts and arrangements, while others report muffled mixes, buried vocals, homogenized production, or ignored details. Treat this as a **model-transition observation**, not a universal v6 defect.  
Examples: r/SunoAI v6 prompting guide; v6 audio-quality complaints; v6 vs v5.5 vocal discussions.

## Prompt architecture

### B — Repeated community evidence

A current v6 prompting guide recommends treating the Style prompt more like a producer brief than a flat tag cloud. Its proposed hierarchy is:

**Identity → Pulse → Players → Performance → Arc → Mix → Constraints**

It also recommends prioritized specificity rather than maximum prompt length, using Exclude for unwanted characteristics, and A/B testing simpler versus more detailed prompts. This is community methodology, not documented Suno syntax.  
Source: https://www.reddit.com/r/SunoAI/comments/1wehqi9/suno_v6_prompting_guide_compiled_from_your_reddit/

### B — Conflicting evidence to preserve

Another current v6 user reports success with complex instrumentation, unusual genre combinations, theatrical arrangements, and highly specific section instructions. This supports documenting specificity as a useful experiment, but it does **not** prove that longer prompts are inherently better.  
Source: https://www.reddit.com/r/SunoAI/comments/1we5ocz/my_humble_opinion_on_my_v6/

### D — Prompt length as a causal variable

The useful working hypothesis is not “more words = more control.” The stronger hypothesis is that **priority, clarity, role assignment, and conflict avoidance** matter more than raw prompt length. This should be tested experimentally rather than stated as a law.

## Lyrics as a control surface

### B/C — Community experiments

Current v6 community research reports that lyric geometry can change the resulting phrasing and melodic/rhythmic behavior. Variables discussed include line length, syllable density, repetition, line breaks, whitespace, punctuation, and isolated words. These reports are promising but remain early community evidence.

Recommended experiment design:

1. Keep Style prompt and settings fixed.
2. Keep semantic content approximately equivalent.
3. Change only lyric geometry.
4. Generate multiple samples per condition.
5. Compare phrasing, melody, rhythm, and section timing.

Source: https://www.reddit.com/r/SunoAI/comments/1wehqi9/suno_v6_prompting_guide_compiled_from_your_reddit/

### D — Punctuation / capitalization / whitespace

Treat commas, dashes, capitalization, whitespace, and unusual line breaks as possible conditioning variables rather than guaranteed controls. Any future site examples should be explicitly labeled experimental unless replicated under controlled conditions.

## Structure tags

### B — Repeated community evidence

Community guides consistently use structural labels such as `[Intro]`, `[Verse]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Breakdown]`, `[Interlude]`, `[Instrumental]`, `[Solo]`, `[Outro]`, and `[End]` as organizational/conditioning cues.

Source: https://www.reddit.com/r/SunoAI/comments/1pap675/a_list_of_song_section_tags_to_help_improve_your_songs/

### D — “Programming language” interpretation

There is insufficient evidence to describe bracket tags as a deterministic programming language or API. The site should describe them as **prompt/conditioning cues** whose effects can vary by model, context, and generation.

### B — Section-detail prompts are useful but not guaranteed

Community users report using detailed section cues such as instrumentation, energy, and performance descriptors. Other users report that even detailed section prompts can be ignored. The correct guide treatment is therefore: **use section cues as directional input, then verify the generated audio.**

Example conflicting report: https://www.reddit.com/r/SunoAI/comments/1wc18qn/how_to_stop_a_cappella_handclap_break/

## V5 / V5.5 → V6 translation

### B — Active community translation work

A current community guide is explicitly testing conversion of v4.5 prompts into v6 prompts. Its approach includes defining overall vocal range in Style and using Lyrics to influence where octave changes occur. The author labels the work in progress. This belongs in the site as a **V5/V4.5 → V6 translation experiment**, not as official guidance.  
Source: https://www.reddit.com/r/SunoAI/comments/1wgb1yl/how_to_convert_style_prompts_from_v45_to_v6/

### B — Audio-quality transition reports

Multiple current users compare v6 against v5/v5.5 and report possible degradation later in songs, increased loudness/compression, excessive reverb, boxed-in mixes, buried vocals, or reduced vocal warmth. These reports conflict with other users who prefer v6 output, so the guide should frame them as **reported failure modes requiring diagnosis**, not objective properties of every v6 generation.

Examples:
- https://www.reddit.com/r/SunoAI/comments/1wfyu8e/v60_audio_quality_problems_compared_to_v55/
- https://www.reddit.com/r/SunoAI/comments/1wf6vaj/v6_vocals_are_absolutely_unlistenable_it_sounds_like_the_singer_is_muffled_under_a_heavy_blanket/
- https://www.reddit.com/r/SunoAI/comments/1wgxflr/v6_vs_v55_are_vocals_feeling_like_a_downgrade_or_is_it_just_me/

## Audio references and model comparison

### B — Community

Current users report inconsistent behavior when using audio references, including unexpectedly strong copying at low influence settings and unintended additional instruments at high influence. These observations reinforce the need for controlled slider sweeps rather than assuming “higher influence = more accurate.”

Sources:
- https://www.reddit.com/r/SunoAI/comments/1we49jv/v6_coming_soon/
- https://www.reddit.com/r/SunoAI/comments/1weaj85/have_you_tried_stem_cover_in_studio_with_v6/

### B — v6-mini timing observation

One user reports that v6-mini reproduced the timing/duration of a previously generated v6-Pro audio-reference workflow more closely than v6-Pro or v6-Wild. This is an individual report, so it belongs at Level C until independently reproduced.

Source: https://www.reddit.com/r/SunoAI/comments/1wga9bp/blackened_orchestral_metal_160_bpm_driving_assault_dynamic/

## Replace Section / surgical editing

### A — Official

Replace Section allows creators to replace a selected middle section, modify lyrics, generate alternate versions, and then create a Whole Song using the selected replacement. Suno documents it as an editing workflow rather than a prompt trick.  
Source: https://help.suno.com/en/articles/3271873

### B — Community failure modes

Users report that replacement can produce unexpected lyrics or transitions. Community troubleshooting includes paying attention to cut points and experimenting with editor behavior. These are practical observations, not guarantees.

Source: https://www.reddit.com/r/SunoAI/comments/1w6nj3v/i_know_this_has_been_asked_before_but_i_havent/

## Extend

### A — Official

Extend can continue a song from a selected point, accepting new lyrics/style details and producing a continuation that can be combined into a Whole Song.  
Source: https://help.suno.com/en/articles/2409601

## Remaster

### A — Official

Remaster is intended for subtle variations to an existing clip, with variation levels of Subtle, Normal, and High. Suno positions it for refining sound, mix/balance, sonic texture, and vocal clarity while preserving more of the original than a major transformation workflow. Suno explicitly distinguishes it from Cover: Remaster is for subtle changes; Cover is for larger transformations.  
Source: https://help.suno.com/en/articles/8105281

## Stems

### A — Official

Suno's current stem workflow can separate vocals, drums, bass, guitar, keys and more. Advanced separation includes Auto Split (up to 12 stems), Split from Mix, and Advanced Split with a much larger instrument selection for Premier users. Stems are available in Workspace/Library and Studio.  
Source: https://help.suno.com/en/articles/13925185

## Studio / MIDI / production

### A — Official

Studio 2.0 is positioned as a production environment with automation, effects, MIDI, synth functionality, and user-designed plugins. Suno describes the Studio chat bar as a collaborator-like interface for generating clips, MIDI, plugins, and arrangement work. Studio 2.0 is currently for Premier subscribers.  
Source: https://help.suno.com/en/articles/13670529

### A — Official

Studio export supports full-song, selected-range, and multitrack exports. Suno documents MIDI extraction from stems and WAV clip downloads as part of the Studio workflow.  
Source: https://help.suno.com/en/articles/8128193

## Voices / Personas

### A — Official but version-sensitive

Suno's Voices FAQ says the newer Voices experience replaced the top-level Personas entry, while Style Personas remain available within Voices. The same article contains model-specific notes for older New Voices behavior, so the guide must avoid assuming every Voices capability maps directly onto v6.  
Source: https://help.suno.com/en/articles/11362433

## Remix / Cover / rights-sensitive workflows

### A — Official

Suno groups Cover, Extend, Adjust Speed, Styles/Lyrics, Crop, and Replace Section under Remix/Edit. Suno states that remixing another creator's song requires remix permission and that remix rights belong to the original creator.  
Source: https://help.suno.com/en/articles/6050497

## Experimental prompting laboratory

### E — Intentionally experimental

The following belong in the site's Experimental Lab rather than the confirmed guide:

- random Unicode/symbol sequences
- symbol repetition and density sweeps
- symbols in Lyrics versus Styles
- emoji combinations
- unusual punctuation
- capitalization and lowercase comparisons
- whitespace and line-break manipulation
- invented words
- gibberish
- fake filenames such as `glitch_matrix.exe`
- fake commands such as `umbrella_milkshake2.dll`
- semantic nonsense
- contradictory descriptors
- word-salad Styles prompts
- ultra-minimal versus extremely dense prompts
- deliberately ambiguous prompts

The user's existing EmojiCombos experiment and supplied Suno examples remain part of this lab. These experiments must never be presented as guaranteed hidden commands.

## Controlled experiment protocol

For any claim worth adding to the guide, record:

- Experiment ID
- Date
- Model / model version
- Plan if relevant
- Style prompt
- Lyrics
- Structure cues
- Slider/settings state
- Reference audio and influence settings
- Variable under test
- Control condition
- Number of generations
- Results
- Repeat count
- Confidence level
- Observations / failure modes

**Default rule:** change one meaningful variable at a time, generate enough samples to see whether the effect repeats, and preserve the exact inputs.

## Research conclusions for Phase 2

1. **Official v6 model behavior is now clearly separated from community prompting lore.**
2. **v6-wild is officially the correct model for deliberate unpredictability/experimentation.**
3. **Prompting should be documented as context/conditioning, not hidden deterministic syntax.**
4. **Lyrics, structure, and Style inputs should be tested as separate control surfaces.**
5. **Audio-reference workflows need controlled slider experiments; higher influence is not automatically better.**
6. **V6 quality complaints are real community evidence but contradictory; they should become diagnostic failure modes, not universal claims.**
7. **Surgical editing is strongly supported by official product documentation and should be preferred when only one section is wrong.**
8. **The research guide should preserve V5/V5.5 techniques as translation experiments rather than assuming old behavior carries forward unchanged.**
9. **The Experimental Lab should explicitly contain Level E work and use reproducibility metadata.**
10. **The next phase should integrate these findings into Create, Control, Produce, Fix/Test, and Master rather than leaving them isolated in Research.**
