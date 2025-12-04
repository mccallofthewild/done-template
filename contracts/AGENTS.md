# Done Contracts Workspace

Each subdirectory under `contracts/` is an independent Bun package that exports a Done contract via `Done.serve()`. Packages should:

1. Depend on `@donezone/contract-types` for ambient Done typings.
2. Keep entrypoints under `src/` so `done.json` can point to them.
3. Expose a default export compatible with the Done runtime.
4. Avoid node/bun built-ins that are not part of the Done runtime.

Use `bunx done build` from the workspace root to bundle all listed contracts, or `bunx done dev` for the hot reload loop backed by Done Local Chain.
