# LIL SYNN: THE MUSICAL REALMS — third-party 3D asset licenses

All assets below are free. Everything is **CC0 1.0 (public domain)**: no attribution required, commercial use OK.
Credits are listed anyway (good practice; optional in an in-game credits screen). Downloaded 2026-11-28.
Nothing paid was used. "Standard" Quaternius editions are the free tiers; their license files state CC0.

| Shipped file | Contents | Author | Source URL | License | Version / retrieval |
|---|---|---|---|---|---|
| nature_trees.glb | CommonTree_1-5, TwistedTree_1-3, Pine_1/2/3/5, DeadTree_1-2 | Quaternius | https://quaternius.itch.io/stylized-nature-megakit (also https://quaternius.com/packs/stylizednaturemegakit.html) | CC0 1.0 | Stylized Nature MegaKit [Standard] free edition, itch upload 11055123 |
| nature_plants.glb | Bushes, Flower_3/Flower_4 (single+group), 4 grass clumps, Clover, Fern, Plant_1/7, 2 mushrooms, Petal_1-5 | Quaternius | same as above | CC0 1.0 | same as above |
| nature_rocks.glb | Rock_Medium_1-3, pebbles, rock-path pieces | Quaternius | same as above | CC0 1.0 | same as above |
| nature_logs.glb | tree_stump_01, dead_tree_trunk (simplified, re-textured to WebP) | Rob Tuytel / Poly Haven | https://polyhaven.com/a/tree_stump_01 , https://polyhaven.com/a/dead_tree_trunk | CC0 1.0 | Poly Haven 1k glTF |
| hero_male_base.glb | Superhero_Male base body (eyes/eyebrows removed) + 43 animation clips | Quaternius | https://quaternius.itch.io/universal-base-characters + https://quaternius.itch.io/universal-animation-library | CC0 1.0 | Universal Base Characters [Standard] (upload 15861669) + Universal Animation Library [Standard] UAL1_Standard.glb (upload 17958403) |
| animal_cat.glb | Rigged toy cat, LOD0+LOD1, 12 clips | Vuena | https://github.com/Vuena/free-low-poly-animals-cc0 | CC0 1.0 (LICENSE.txt in repo: "Cute Pets & Wildlife FREE Sample - CC0 1.0") | commit 5193189ee05866edf554a73e01536f533e65d24b (2026-11-26). Note: the Sketchfab mirror of this model is CC BY 4.0; we use the GitHub CC0 copy. |
| animal_fox.glb | Rigged fox, 12 clips | Quaternius | https://quaternius.com/packs/ultimateanimatedanimals.html (Google Drive glTF folder) | CC0 1.0 | Ultimate Animated Animal Pack, glTF |
| animal_shibainu.glb | Rigged Shiba Inu, 12 clips | Quaternius | same as fox | CC0 1.0 | same as fox |
| hdri/kloofendal_48d_partly_cloudy_puresky_{2k,1k}.hdr | Daytime sky HDRI | Greg Zaal (original), Jarod Guest (sky edits) / Poly Haven | https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky | CC0 1.0 | Poly Haven 2k + 1k .hdr |
| hdri/qwantani_sunset_puresky_{2k,1k}.hdr | Sunset sky HDRI | Greg Zaal (photography), Jarod Guest (processing) / Poly Haven | https://polyhaven.com/a/qwantani_sunset_puresky | CC0 1.0 | Poly Haven 2k + 1k .hdr |

License texts: CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/ · Poly Haven license https://polyhaven.com/license

Modifications made (all permitted by CC0): kits merged into multi-node GLBs, textures resized to <=1024 and converted to WebP,
meshes welded/quantized and meshopt-compressed, Poly Haven logs decimated, hero eye/eyebrow meshes removed, UAL animations
retargeted onto the base character by identical bone names, animations resampled.

Not used (deliberately): three.js example Soldier.glb / Xbot.glb — the repo is MIT, but those characters/animations originate
from Mixamo, whose terms are Adobe's, not MIT; the Quaternius CC0 rig replaces them cleanly.
Optional extra already in the workspace (not copied): /workspace/work/blender-kit/hdri/pink_sunrise_2k.hdr (Poly Haven, CC0) for a pink magic-hour sky.

## Also used by the game code (not in the table above)
| Component | Source | Version | License | Notes |
|---|---|---|---|---|
| three.js (+ examples/jsm addons: EffectComposer, RenderPass, UnrealBloomPass, OutputPass, GTAOPass, RGBELoader, GLTFLoader, SkeletonUtils, meshopt decoder) | https://github.com/mrdoob/three.js via cdn.jsdelivr.net | r160 (0.160.0) | MIT | Loaded from the CDN at runtime; copyright notice: Copyright © 2010-2024 three.js authors. |
| Procedural textures, fallback characters, gloomlings, portal, sky, water and FX | written for this game (game/js/*.js) | Stage 1 | Original project code | Generated at runtime; no third-party art. |
| Music | LIL SYNN | see MUSIC_RIGHTS.md | Per user statement; see register | Not CC0. |
