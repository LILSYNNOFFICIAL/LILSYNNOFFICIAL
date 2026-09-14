# Browser Health Dashboards Design

## Goal
Provide mobile-first, browser-executable health dashboards for both the main LIL SYNN site and the isolated `/Suno` project without replacing their existing Node-based Site Doctors.

## Design
- `/site-health.html` is the main-site browser QA surface.
- `/Suno/health.html` is the isolated Suno browser QA surface.
- Each dashboard runs same-origin fetch checks from the deployed browser and reports PASS / WARN / FAIL per check.
- Checks cover reachable HTML pages, discovered internal links, referenced local assets, metadata/landmarks, JSON manifests/indexes, and project-specific required resources.
- Node/npm checks remain explicitly labeled as server/repository checks and are never falsely reported as browser-passed.
- The main dashboard treats `/Suno` as a separate project and links to its dedicated dashboard.
- The Suno dashboard stays self-contained under `/Suno` and does not depend on root scripts or configuration.
- Documentation pages explain how to open the dashboards and what each check can and cannot prove.

## Constraints
- Preserve the existing main-site Site Doctor.
- Preserve the existing Suno Site Doctor and tests.
- Do not add Suno infrastructure to root build tooling.
- Do not make Suno failures block the main-site dashboard or Site Doctor.
- Mobile-first layout and accessible status output.
