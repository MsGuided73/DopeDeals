# Task Tracker: API Pricing Standardization

| Task | Status | Notes |
| :--- | :--- | :--- |
| Standardize Pipes API price fields | [x] | Fixed `pipes/route.ts` to map `price` and `compare_at_price` avoiding `toFixed` crashes. |
| Standardize Flower API price fields | [x] | Fixed `flower/route.ts` and `thca-flower/route.ts` |
| Standardize Concentrates/Rigs API price fields | [x] | Fixed `dab-rigs-and-tools/route.ts` |
| Standardize Vapes/Prerolls API price fields | [x] | Fixed `vapes/route.ts`, `thca-pre-rolls/route.ts`, `pre-rolls/route.ts` |
| Standardize other product APIs | [x] | Fixed `accessories/route.ts`, `edibles/route.ts`, `bongs/route.ts`, `bubblers/route.ts`, `nitrous-oxide/route.ts`, `mushrooms/route.ts`, `thca/route.ts` |
| Update Bundles API pricing | [x] | Implemented map logic to standard pricing structure. |
| Test changes with `pnpm build` | [x] | Build successfully compiles (ignoring Windows-specific EPERM symlink warning). |
