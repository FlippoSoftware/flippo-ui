# Changesets

Each change that should reach npm gets a changeset: `pnpm changeset` asks which packages changed and how (major,
minor, patch) and writes a file here. Commit it with the change.

Releasing: `pnpm changeset version` bumps the versions (and the ranges of the workspace packages that depend on the
bumped ones), writes the CHANGELOGs and deletes the changesets; then `pnpm release` builds and publishes the packages
whose version is not on npm yet. Private packages (`internal-test-utils`, `workspace-tools`) are never published.
