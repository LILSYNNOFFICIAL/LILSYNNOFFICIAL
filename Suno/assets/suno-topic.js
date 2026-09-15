(()=>{const cfg=window.SUNO_TOPIC_CONFIG||{};const content=document.querySelector('#topicContent');const index=document.querySelector('#topicIndex');const normalize=s=>s.toLowerCase().replace(/[\u{1f300}-\u{1faff}\u2600-\u27bf]/gu,'').replace(/[^a-z0-9]+/g,' ').trim();const wanted=(cfg.sections||[]).map(normalize);const pick=(root,title)=>{const target=normalize(title);const heads=[...root.querySelectorAll('h1,h2,h3')];let h=heads.find(x=>normalize(x.textContent)===target)||heads.find(x=>normalize(x.textContent).includes(target));if(!h)return null;const box=document.createElement('section');box.className='guide-section';box.id=target.replace(/[^a-z0-9]+/g,'-');let n=h;while(n){if(n!==h&&/^H[1-3]$/.test(n.tagName)&&normalize(n.textContent)!==target)break;box.appendChild(n.cloneNode(true));n=n.nextElementSibling}return box};const addTheme=()=>{if(document.querySelector('link[data-suno-overrides]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='../assets/suno-overrides.css';link.dataset.sunoOverrides='';document.head.appendChild(link)};const addExperimentalLab=()=>{if(!location.pathname.toLowerCase().includes('/suno/research'))return;if(document.querySelector('#experimental-v6-lab'))return;const lab=document.createElement('section');lab.className='guide-section';lab.id='experimental-v6-lab';lab.innerHTML=`<h2>⚠︎ V6 EXPERIMENTAL LAB — CONTROLLED PROMPT RESEARCH</h2><p><strong>LAB RULE:</strong> this section is a research instrument, not a list of secret Suno commands. Official behavior, community reports and our own experiments are kept separate. A result that happens once is a result; it is not automatically a rule.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin:18px 0"><div style="border:1px solid var(--line);padding:14px"><strong>A — OFFICIAL</strong><br><span>Documented by Suno.</span></div><div style="border:1px solid var(--line);padding:14px"><strong>B — REPEATED</strong><br><span>Repeated independent reports.</span></div><div style="border:1px solid var(--line);padding:14px"><strong>C — REPRODUCIBLE</strong><br><span>Directly repeated in controlled tests.</span></div><div style="border:1px solid var(--line);padding:14px"><strong>D — HYPOTHESIS</strong><br><span>Plausible explanation awaiting tests.</span></div><div style="border:1px solid var(--line);padding:14px"><strong>E — EXPERIMENTAL</strong><br><span>Interesting behavior with insufficient evidence.</span></div></div><h3>LAB 01 — SYMBOL DENSITY</h3><p><strong>Question:</strong> does symbol density in the Styles or Lyrics field correlate with a different generation? Keep every other input identical.</p><pre><code>A — plain: nocturnal electropop
B — light: ✦ nocturnal electropop ✦
C — dense: ✦✦✦ ⟟⟟⟟ ⌁⌁⌁ ◇◇◇ ≋≋≋ nocturnal electropop
D — extreme: ░▒▓█ ⌁⌁⌁ ✦✦✦ ⟐⟐⟐ ☾☽☾ ⌬⌬⌬ !!! ??? ///</code></pre><p><strong>Measure:</strong> genre adherence, arrangement, vocal behavior, energy, novelty and failure modes. Repeat each condition before assigning causality.</p><h3>LAB 02 — SYMBOL PLACEMENT</h3><pre><code>A: ✦ nocturnal electropop
B: nocturnal electropop ✦
C: ✦ nocturnal ✦ electropop ✦
D: nocturnal ✦ electropop</code></pre><p><strong>Hypothesis:</strong> placement may matter because the model sees different token context. <strong>Status: E.</strong> No fixed semantic meaning should be assumed.</p><h3>LAB 03 — REPETITION / RUN LENGTH</h3><pre><code>A: glitch
B: glitch glitch glitch
C: glitch_matrix.exe glitch_matrix.exe
D: ⌁⌁⌁ ⌁⌁⌁ ⌁⌁⌁</code></pre><p>Test repeated words, repeated symbols and repeated phrases separately. Record whether repetition changes emphasis, texture, phrasing or nothing measurable.</p><h3>LAB 04 — INVENTED WORDS / FAKE FILES</h3><pre><code>glitch_matrix.exe
umbrella_milkshake2.dll
velvet//signal::404
NEON_PROTOCOL::SLEEP_MODE
render::vocal_focus=NEAR
/usr/local/ghost_mode</code></pre><p>These strings are probes, not commands. If one appears to produce a consistent effect, reproduce it with new invented strings before claiming a pattern.</p><h3>LAB 05 — SEMANTIC NONSENSE / WORD SALAD</h3><pre><code>chrome velvet midnight geometry / glass thunder velvet / lunar cassette pressure
copper heartbeat / soft machinery / fluorescent rain / elastic shadows</code></pre><p>Compare nonsense with an equivalent-length conventional producer brief. This tests whether unusual lexical texture alone correlates with output changes.</p><h3>LAB 06 — PUNCTUATION / CAPS / WHITESPACE</h3><pre><code>A: [Chorus — restrained]
B: [CHORUS — RESTRAINED]
C: [Chorus / restrained!!!]
D: [Chorus—restrained]
E: [ Chorus — restrained ]
F: [Chorus]

[restrained]</code></pre><p>Change only one formatting variable per experiment. Do not infer a hidden parser from a single success.</p><h3>LAB 07 — ULTRA-MINIMAL VS DENSE PROMPTS</h3><pre><code>MINIMAL:
dark electropop, intimate female vocal

MEDIUM:
dark electropop, nocturnal pulse, warm synth bass, intimate female vocal, sparse verses, explosive chorus

DENSE:
identity → groove → instrument roles → vocal behavior → arrangement arc → mix relationships → exclusions</code></pre><p>More words are not automatically more control. Score adherence against prompt length and record where additional detail begins competing with itself.</p><h3>LAB 08 — CONTRADICTION / INSTRUCTION CONFLICT</h3><pre><code>intimate close vocal + huge distant arena vocal
dry vocal + cavernous reverb
sparse arrangement + maximal wall of sound
restrained performance + explosive delivery</code></pre><p><strong>Research target:</strong> which instruction appears to dominate when two desired states conflict? Run multiple generations and log the result rather than declaring a permanent hierarchy.</p><h3>LAB 09 — STRUCTURE-TAG LADDER</h3><pre><code>LEVEL A
[Verse]
[Chorus]
[Bridge]

LEVEL B
[Verse — intimate, sparse]
[Chorus — full arrangement]
[Bridge — stripped back]

LEVEL C
[Verse — intimate, close vocal; sparse drums; low dynamics]
[Pre-Chorus — tension rises; bass opens]
[Chorus — full arrangement; stacked harmony; sustained hook]
[Bridge — strip to pulse and vocal; no new lead instrument]
[Final Chorus — maximum emotional lift; widest arrangement]</code></pre><p>Useful tags to test include <code>[Intro]</code>, <code>[Verse]</code>, <code>[Pre-Chorus]</code>, <code>[Chorus]</code>, <code>[Post-Chorus]</code>, <code>[Hook]</code>, <code>[Bridge]</code>, <code>[Breakdown]</code>, <code>[Build]</code>, <code>[Drop]</code>, <code>[Interlude]</code>, <code>[Instrumental]</code>, <code>[Solo]</code>, <code>[Refrain]</code>, <code>[Final Chorus]</code>, <code>[Outro]</code> and <code>[End]</code>. Treat these as soft conditioning unless Suno explicitly documents otherwise. Current reporting notes that Suno does not publish a complete bracket-tag syntax reference.</p><h3>LAB 10 — DESCRIPTIVE TAGS</h3><pre><code>[Verse — intimate, restrained]
[Chorus — full arrangement, stacked harmony]
[Bridge — fragile, nearly whispered]
[Drop — drums hit hard, bass forward]
[Outro — instruments fall away, clean ending]</code></pre><p>Test descriptive tags against the same lyric with no cues. Record whether the cue affects vocal performance, instrumentation, dynamics, structure or none of the above.</p><h3>LAB 11 — LYRICS AS A CONTROL SURFACE</h3><p>Hold Style constant and vary only the lyric formatting: line length, syllable density, repeated hooks, punctuation, blank lines, section labels and concise performance cues. This is especially useful when testing chorus repeatability and vocal phrasing.</p><pre><code>[Verse — close, conversational]
I said I was fine
but I never was

[Chorus — full voice; sustained final word]
I still hear your name
I still hear your name</code></pre><p>Compare with the same words without cues. The comparison is the evidence.</p><h3>LAB 12 — STYLE BOX AS A PRODUCER BRIEF</h3><pre><code>IDENTITY → GROOVE → PLAYERS → PERFORMANCE → ARC → MIX → CONSTRAINTS</code></pre><p>Example:</p><pre><code>dark electropop → tight nocturnal pulse → warm synth bass + glassy pads + dry electronic drums → intimate low-register lead, controlled verses, lifted chorus → sparse-to-dense arc → centered vocal, clean low end, wide upper field → avoid muddy low mids</code></pre><p>Community reports support this as a useful organizing framework, but it is not an official Suno syntax specification.</p><h3>LAB 13 — V6 / V6-WILD / V6-MINI CONTROL</h3><pre><code>CONTROL: V6 — same prompt / same lyrics / same settings
DISCOVERY: V6-WILD — same prompt / same lyrics / same settings
FAST BRANCH: V6-MINI — same prompt / same lyrics / same settings</code></pre><p>Suno officially positions v6 for precision, v6-wild for exploration and v6-mini for faster access. That makes this a useful model-level control experiment rather than a claim about hidden randomness mechanics.</p><h3>LAB 14 — REFERENCE AUDIO AS A VARIABLE</h3><p>Run text-only and audio-informed versions separately. Do not mix a new reference, new prompt and new lyric at the same time. Record what changes: timing feel, articulation, timbre, groove, arrangement, vocal behavior and mix relationships.</p><h3>LAB 15 — LOCAL EDIT VS FULL REGENERATION</h3><p>If 90% of a song is correct and one section fails, compare a section-level repair with a full regeneration. Local editing changes fewer variables and therefore makes cleaner experiments. V6 officially supports plain-language editing of parts of an existing song and single-lyric updates.</p><h3>LAB 16 — FAILURE-MODE MATRIX</h3><pre><code>VOCAL: buried / distant / wrong texture / flat phrasing
ARRANGEMENT: missing layer / early chorus / wrong section / genre drift
AUDIO: muddy low end / excessive reverb / clipping / pumping / degradation
TIMING: stutter / rushed phrase / repeated phrase corruption
ENDING: cutoff / overrun / unwanted vamp / unresolved finish</code></pre><p>Log failures with the exact model, prompt, settings and reference conditions. A failed generation is data.</p><h3>CONTROLLED EXPERIMENT RECORD — COPY THIS</h3><pre><code>EXPERIMENT ID:
DATE / TIME:
MODEL: V6 / V6-WILD / V6-MINI
STYLE PROMPT:
LYRICS:
STRUCTURE:
SETTINGS:
REFERENCE AUDIO:
VARIABLE:
CONTROL:
TEST CONDITION:
REPEAT COUNT:
RESULT:
OBSERVATIONS:
WHAT IMPROVED:
WHAT FAILED:
REPRODUCED? YES / NO
CONFIDENCE: LOW / MEDIUM / HIGH
NEXT TEST:</code></pre><h3>RESEARCH PROTOCOL</h3><ol><li>Define one question.</li><li>Freeze everything except one variable.</li><li>Run a control.</li><li>Run the changed condition.</li><li>Repeat enough times to detect a pattern.</li><li>Log failures as well as wins.</li><li>Separate observation from explanation.</li><li>Label evidence A–E.</li><li>Retest surprising results with a new prompt.</li><li>Promote a technique only when the evidence justifies it.</li></ol><h3>WHAT NOT TO CLAIM</h3><p>Do not write “this symbol means X,” “this filename unlocks Y,” “this tag always forces Z,” or “this slider guarantees A.” The correct research language is “in our tests,” “reported by users,” “correlated with,” “appeared to,” or “not yet reproduced.”</p><h3>LAB STATUS</h3><p><strong>Current baseline:</strong> V6. <strong>Discovery branch:</strong> V6-Wild. <strong>Fast branch:</strong> V6-Mini. <strong>Experimental syntax:</strong> unverified. <strong>Bracket tags:</strong> useful research probes, not an official command language. <strong>Symbols / gibberish / fake files:</strong> experimental only. <strong>Best evidence:</strong> controlled repeated comparisons with the exact conditions recorded.</p>`;const anchor=document.querySelector('#experimental');if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(lab,anchor.nextSibling);else content.appendChild(lab)};async function boot(){addTheme();if(cfg.title)document.title=`LIL SYNN — ${cfg.title}`;document.querySelector('#topicTitle').textContent=cfg.title||'SUNO V6';document.querySelector('#topicDescription').textContent=cfg.description||'';const manifest=await fetch('../content/manifest.json').then(r=>{if(!r.ok)throw new Error(`Manifest returned ${r.status}`);return r.json()});const roots=[];for(const doc of manifest.documents){const sourcePath=String(doc.html||'').replace(/^content\//,'');const res=await fetch(`../content/${sourcePath}`);if(res.ok){const html=await res.text();roots.push(new DOMParser().parseFromString(html,'text/html'))}}if(!roots.length)throw new Error('The guide source documents could not be loaded.');const sections=[];for(const wantedTitle of wanted){let found=null;for(const root of roots){found=pick(root,wantedTitle);if(found)break}if(found){sections.push(found);const link=document.createElement('a');link.href=`#${found.id}`;link.textContent=found.querySelector('h1,h2,h3')?.textContent?.trim()||wantedTitle;index.appendChild(link)}}if(!sections.length)throw new Error('No configured guide sections matched the source documents.');sections.forEach(s=>content.appendChild(s));addExperimentalLab()}boot().catch(err=>{content.innerHTML=`<div class="guide-section"><h2>Guide loading error</h2><p>${err.message}</p></div>`})})();