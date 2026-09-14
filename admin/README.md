# LIL SYNN // Command Center

`/admin/` is a read-only operational dashboard for the LIL SYNN repository.

## What it does

- Observes the main-site browser health surface.
- Observes the isolated Suno browser health surface.
- Reads public GitHub repository, commit, and Actions workflow information when the browser can access it.
- Normalizes signals as `PASS`, `WARN`, `FAIL`, or `UNKNOWN`.
- Links back to authoritative GitHub and health pages.

## What it does not do

- It does not deploy.
- It does not mutate the repository.
- It does not rerun, cancel, or delete GitHub workflows/artifacts.
- It does not store or expose GitHub credentials.
- It is not required for the main site or Suno to work.

If the dashboard is unavailable, the monitored systems remain independent.

## Verification

The repository-side regression harness is `admin/admin.test.mjs`. Run it with Node from the repository root:

```bash
node admin/admin.test.mjs
```

Browser verification should also open `/admin/` on the deployed site and confirm the main health, Suno health, GitHub Actions, commit activity, accessibility, and mobile layout surfaces.
