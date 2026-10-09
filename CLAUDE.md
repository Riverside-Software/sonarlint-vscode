# OpenEdge fork of sonarlint-vscode

This repository is Riverside Software's fork of SonarSource's sonarlint-vscode (extension `RiversideSoftware.sonarlint-abl`, branded "CABL").

- `origin` = Riverside-Software fork, `upstream` = SonarSource
- One branch per upstream release: `OpenEdge-x.y` (e.g. `OpenEdge-5.3`)
- Depends on the matching fork of sonarlint-language-server (`../sonarlint-language-server`, branches `OpenEdge-a.b`, versions `a.b.99001`)
- Fork rules are listed in `FORK.md` (renamed ids/settings/commands/views, no SonarCloud, ABL only, can be installed next to the official extension)

## Tags

- Upstream release tags look like `5.3.0+80328` (`x.y.z+build`). Only these are merged.

## Merging new upstream releases

Merge every upstream release tag newer than the latest `OpenEdge-x.y` branch, oldest first, each one on its own branch created from the previous one. **Never push** unless explicitly asked.

1. `git fetch upstream --tags`, then list release tags with `git tag --sort=v:refname | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+$'`.
   - Only one branch per `x.y`: when several patch tags exist (`5.2.0+…`, `5.2.1+…`, `5.2.3+…`), merge only the latest one.
2. Create the branch from the previous OpenEdge branch:
   `git checkout -b OpenEdge-x.y OpenEdge-<previous>`
3. Merge the tag: `git merge --no-ff --no-edit <tag>` (default message: `Merge tag '<tag>' into OpenEdge-x.y`).
4. Resolve conflicts, then `git commit --no-edit`:
   - **Version** — `"version"` in `package.json` and `package-lock.json` (2 places): take the tag's side (`x.y.z`). It is changed in step 7.
   - **`package.json`** — keep the fork side for everything listed in `FORK.md`, and apply upstream's other changes (new settings, commands, views, dependency bumps...) translated to the fork naming:
     - `name: sonarlint-abl`, `displayName: CABL`, ABL description, `publisher: RiversideSoftware`, icon `images/sonarlint_wave_128px.png`, Riverside homepage / repository / bugs URLs
     - `keywords` reduced to `ABL`, `activationEvents: workspaceContains:openedge-project.json`, `extensionDependencies: RiversideSoftware.openedge-abl-lsp`
     - prefixes `sonarlint.` → `sonarlint-abl.` (settings), `SonarLint.` → `SonarLint.ABL.` and `SonarQube.` → `SonarQube.ABL.` (commands), category `CABL`, views `sonarlint-abl.` / `sonarqube-abl.`, language model tools `sonarqube-abl_XXX`
     - no SonarCloud settings/connections, no walkthrough, no languages other than ABL
     - `"jarDependencies": []` — the language server and analyzers are downloaded by the `Jenkinsfile`, ignore upstream analyzer and SLLS version bumps there (but note the upstream SLLS version for step 5)
   - **`package-lock.json`** — regenerate using `npm install`, never modify the file yourself
   - **TypeScript sources (`src/**`, `test/**`, `its/**`, `dogfood/**`)** — apply the upstream change, but keep the fork renames: `sonarlint-abl.` setting/context keys (`setContext` prefix `sonarlint-abl` instead of `sonarqube`), `SonarLint.ABL.` / `SonarQube.ABL.` command ids, `sonarlint-abl.` / `sonarqube-abl.` view and webview ids (e.g. `sonarlint-abl.PluginStatuses`), no SonarCloud code paths. New upstream ids/keys introduced by the tag must be renamed the same way, otherwise the extension conflicts with the official one.
   - Fork-only files that must survive (usually merge cleanly): `Jenkinsfile`, `FORK.md`, `README.md`, `CLAUDE.md`, `src/openedge/openedge.ts`, OpenEdge additions in `src/lsp/protocol.ts` / `src/lsp/server.ts` / `src/extension.ts`, `images/sonarlint.svg`, `images/sonarlint_wave_128px.png`.
   - Sanity checks:
     - No conflict markers left: `git grep -n '^<<<<<<<'`.
     - `git grep -n "'sonarlint\.\|\"sonarlint\.\|SonarLint\.[a-z]\|SonarQube\.[a-z]" -- src package.json` should not show new upstream ids that were not renamed.
     - The file list of `git diff <tag> --name-only` (after the merge commit) should match the one of `git diff <previous-tag> <previous-merge> --name-only`, where `<previous-merge>` is `git log --first-parent --merges -1 --format=%h OpenEdge-<previous>`, apart from files added/removed upstream. Currently ~65 files.
     - `npm install && npm run compile` must succeed.
5. Commit `SLLS a.b.99001`, where `a.b` is the major.minor of the upstream `sonarlint-language-server` version in the tag's `jarDependencies` (`git show <tag>:package.json | grep -A1 '"sonarlint-language-server"'`, e.g. `5.3.0.78466` → `5.3.99001`; the SLLS version does not always match the extension version, e.g. extension 4.45 used SLLS 4.15). Change exactly one line: `def slintlsVersion` in `Jenkinsfile`.

   First check that `../sonarlint-language-server` has branch `OpenEdge-a.b` whose project version is `a.b.99001` (`git -C ../sonarlint-language-server show OpenEdge-a.b:pom.xml | grep -m2 '<version>'`). If not, stop and ask. Skip this commit if the SLLS version did not change.
6. Only when asked: commit `CABL <version>` to bump `def cablVersion` (and `def prgsRulesVersion` if needed) in `Jenkinsfile`.
7. Commit `Version x.y.99001`: set `"version"` to `x.y.99001` in `package.json` and in both places at the top of `package-lock.json` (also for patch tags: `5.2.3` becomes `5.2.99001`). Later fork releases on the same branch increment the counter (`x.y.99002`, ...).

Commit messages for steps 5 to 7 are only the title (`SLLS 5.3.99001`, `CABL 3.8.1`, `Version 5.3.99001`), plus the attribution trailer.
