(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const val = id => document.getElementById(id)?.value?.trim() || '';
  const checked = name => $$(`input[name="${name}"]:checked`).map(x => x.value);
  const setOutput = text => { const out = $('#tool-output'); if (out) out.value = text; };
  const copyOutput = async () => { const out=$('#tool-output'); if(!out) return; try { await navigator.clipboard.writeText(out.value); const b=$('#copy-output'); if(b){const t=b.textContent;b.textContent='COPIED';setTimeout(()=>b.textContent=t,1200);} } catch { out.select(); document.execCommand('copy'); } };
  const resetForm = () => { const f=$('#tool-form'); if(f) f.reset(); setOutput(''); $$('.choice.selected').forEach(x=>x.classList.remove('selected')); };
  document.addEventListener('click', e => {
    const copy=e.target.closest('#copy-output'); if(copy){copyOutput();return;}
    const reset=e.target.closest('#reset-tool'); if(reset){resetForm();return;}
    const choice=e.target.closest('.choice'); if(choice){const group=choice.parentElement; $$('.choice',group).forEach(x=>x.classList.remove('selected'));choice.classList.add('selected'); if(choice.dataset.value){const target=document.getElementById(choice.dataset.target);if(target)target.value=choice.dataset.value;}}
  });

  function join(parts){return parts.filter(Boolean).join(', ');}
  function promptArchitect(){
    const intent=val('intent'), genre=val('genre'), mood=val('mood'), era=val('era'), vocals=val('vocals'), arrangement=val('arrangement'), production=val('production'), structure=val('structure'), instruments=checked('instrument'), constraints=val('constraints');
    if(!intent && !genre && !mood){setOutput('Start with the creative intent, genre, or mood so the architect has something concrete to build from.');return;}
    const lines=[];
    lines.push(`CORE INTENT: ${intent||'Create a coherent, emotionally focused song.'}`);
    if(genre) lines.push(`STYLE / GENRE: ${genre}`);
    if(era) lines.push(`ERA / REFERENCE LANGUAGE: ${era}`);
    if(mood) lines.push(`EMOTIONAL DIRECTION: ${mood}`);
    if(vocals) lines.push(`VOCAL IDENTITY: ${vocals}`);
    if(instruments.length) lines.push(`INSTRUMENTATION: ${instruments.join(', ')}`);
    if(arrangement) lines.push(`ARRANGEMENT: ${arrangement}`);
    if(production) lines.push(`PRODUCTION: ${production}`);
    if(structure) lines.push(`STRUCTURE / ARC: ${structure}`);
    if(constraints) lines.push(`CONSTRAINTS: ${constraints}`);
    lines.push('PRIORITY: Preserve the core intent first; use secondary descriptors only when they reinforce the intended audible result.');
    setOutput(lines.join('\n'));
  }

  function styleBuilder(){
    const genre=val('style-genre'), sub=val('style-sub'), era=val('style-era'), mood=val('style-mood'), vocal=val('style-vocal'), inst=checked('style-instrument'), texture=val('style-texture'), mix=val('style-mix');
    if(!genre){setOutput('Choose a primary genre or style family first.');return;}
    const style=[genre,sub,era,mood,vocal,inst.length?inst.join(', '):'',texture,mix].filter(Boolean).join(', ');
    setOutput(`STYLE DIRECTION\n${style}\n\nENGINEERING NOTE\nKeep the strongest identity words near the front. Prefer concrete audible characteristics over long adjective chains.`);
  }

  const tagCatalog=['[Intro]','[Verse]','[Pre-Chorus]','[Chorus]','[Post-Chorus]','[Bridge]','[Breakdown]','[Build]','[Drop]','[Interlude]','[Instrumental]','[Solo]','[Hook]','[Outro]'];
  function lyricsBuilder(){
    const title=val('lyrics-title'), sections=$$('.section-row').map(r=>({tag:$('.section-tag',r)?.value||'',note:$('.section-note',r)?.value||''})).filter(x=>x.tag);
    if(!sections.length){setOutput('Add at least one song section.');return;}
    const text=[title?`TITLE: ${title}`:'',''].concat(sections.map(x=>`${x.tag}${x.note?` — ${x.note}`:''}`)).join('\n');
    setOutput(text+`\n\nTAG REFERENCE\n${tagCatalog.join(' · ')}\n\nSTRUCTURE CHECK\n${sections.length} sections assembled. Keep tags clear and use section notes only for intentional performance/arrangement direction.`);
  }
  function addSection(){
    const host=$('#section-list'); if(!host)return;
    const row=document.createElement('div');row.className='section-row';row.innerHTML='<select class="section-tag"><option>[Intro]</option><option>[Verse]</option><option>[Pre-Chorus]</option><option>[Chorus]</option><option>[Bridge]</option><option>[Breakdown]</option><option>[Build]</option><option>[Drop]</option><option>[Instrumental]</option><option>[Solo]</option><option>[Outro]</option></select><input class="section-note" placeholder="Performance / arrangement note"><button type="button" class="remove-row" aria-label="Remove section">×</button>';host.appendChild(row);
  }
  document.addEventListener('click',e=>{if(e.target.closest('#add-section'))addSection();if(e.target.closest('.remove-row'))e.target.closest('.section-row')?.remove();});

  function controls(){
    const goal=val('control-goal'), variance=val('control-variance'), problem=val('control-problem');
    if(!goal){setOutput('Choose the result you want before changing controls.');return;}
    const strategy={
      'predictable':'Keep the prompt/style focused and use conservative creative variation. Change one variable at a time.',
      'explore':'Allow more variation, but keep the core identity words stable so experiments remain comparable.',
      'repair':'Preserve what already works. Prefer local editing, section replacement, stems, or production before a full regeneration.',
      'voice':'Lock the desired vocal identity first; avoid changing multiple identity variables while diagnosing the result.'
    }[variance]||'Change one control at a time and compare outputs against the same creative target.';
    setOutput(`CONTROL STRATEGY\nGOAL: ${goal}\n${problem?`CURRENT PROBLEM: ${problem}\n`:''}\nRECOMMENDATION\n${strategy}\n\nTEST METHOD\n1. Establish a baseline.\n2. Change one meaningful variable.\n3. Compare the audible result, not the expectation.\n4. Keep the better branch and document the change.`);
  }

  const issues={
    vocals:['Vocal identity drifts','Keep the identity description consistent; test voice/identity variables separately and avoid rewriting unrelated prompt sections.','/suno/voices'],
    structure:['Arrangement ignores requested structure','Simplify structural language, make section intent explicit, then test a shorter prompt before adding more detail.','/suno/prompting'],
    mix:['Mix feels crowded or harsh','Reduce competing instructions and diagnose arrangement before stacking processing. Use stems/editing when the source is already good.','/suno/production'],
    repetition:['Generation becomes repetitive','Change one structural or rhythmic variable, compare variants, and avoid stuffing the prompt with contradictory descriptors.','/suno/sliders'],
    section:['One section is wrong','Use surgical section editing instead of regenerating the whole song when the rest is strong.','/suno/editing'],
    audio:['Reference/upload result is off','Confirm the reference is appropriate for the intended task and separate source problems from prompt problems.','/suno/audio']
  };
  function troubleshoot(){
    const key=val('issue'); const item=issues[key]; if(!item){setOutput('Choose the symptom that best describes the actual failure.');return;}
    setOutput(`DIAGNOSIS\n${item[0]}\n\nLIKELY DIRECTION\n${item[1]}\n\nNEXT REFERENCE\n${location.origin}${item[2]}\n\nRESCUE RULE\nDo not regenerate blindly. Preserve good information and make the smallest effective intervention.`);
  }

  const workflows={
    song:['01 — DEFINE','Choose the model/context, creative intent, identity, lyrics/structure and reference inputs.','02 — GENERATE','Create controlled variants and evaluate the actual outputs.','03 — SELECT','Choose the strongest branch and preserve it as the baseline.','04 — REPAIR','Use editing, stems or targeted changes before restarting.','05 — PRODUCE','Arrange, process, automate and refine in Studio.','06 — QC / RELEASE','Check vocals, timing, mix, export, credits, rights and release assets.'],
    vocal:['01 — IDENTITY','Define the desired vocal identity and emotional performance.','02 — GENERATE','Run controlled variants while holding identity stable.','03 — DIAGNOSE','Separate voice problems from lyric, arrangement and mix problems.','04 — REPAIR','Use section editing or stems where appropriate.','05 — MIX','Shape space, dynamics and balance around the vocal.','06 — QC','Listen on multiple systems and verify the final export.'],
    instrumental:['01 — CONCEPT','Define genre, era, mood, groove and instrument roles.','02 — GENERATE','Test controlled variations.','03 — ARRANGEMENT','Select and refine the strongest structure.','04 — EDIT','Repair local sections rather than throwing away a strong take.','05 — PRODUCTION','Use Studio, MIDI, effects and automation for refinement.','06 — MASTER','QC the mix and final export.']
  };
  function workflow(){
    const key=val('workflow-type')||'song';const data=workflows[key]||workflows.song;const steps=[];for(let i=0;i<data.length;i+=2)steps.push(`${data[i]}\n${data[i+1]}`);setOutput(`CREATOR WORKFLOW\n\n${steps.join('\n\n')}`);
  }

  const handlers={'prompt-architect':promptArchitect,'style-builder':styleBuilder,'lyrics-builder':lyricsBuilder,'controls':controls,'troubleshooter':troubleshoot,'workflow':workflow};
  const tool=document.body.dataset.tool;
  if(handlers[tool]){ $('#generate-tool')?.addEventListener('click',handlers[tool]); $('#reset-tool')?.addEventListener('click',()=>setTimeout(()=>{if(tool==='lyrics-builder'){$('#section-list').innerHTML='';addSection();}},0)); }
  if(tool==='lyrics-builder' && !$('.section-row')) addSection();
})();
