Let's create a new release.

This project uses [Semantic Versioning](https://semver.org/) and automated releases via GitHub Actions.

### Version Bumping

- **MAJOR** (`x.0.0`): Breaking changes
- **MINOR** (`0.x.0`): New features (backwards compatible)
- **PATCH** (`0.0.x`): Bug fixes (backwards compatible)

### Release Steps

1. **Update version in 3 files** (e.g., `1.0.2` → `1.0.3`):
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. **Update CHANGELOG.md** with the new version entry at the top:

   ```markdown
   ## [1.0.3] - YYYY-MM-DD

   ### Added/Changed/Fixed

   - Description of change ([#PR](https://github.com/cacoos/trackhands/pull/PR))
   ```

3. **Commit and tag**:

   ```bash
   git add -A
   git commit -m "chore(release): v1.0.3"
   git tag v1.0.3
   git push && git push --tags
   ```

4. **GitHub Actions** automatically builds and publishes the release for all platforms (macOS ARM, macOS Intel, Windows, Linux).

### Notes

- The release workflow extracts changelog content for the GitHub release notes
- Never patch an existing release; always create a new version
- Monitor builds at: https://github.com/cacoos/trackhands/actions
