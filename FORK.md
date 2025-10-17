## Fork Guidelines

* General
  * No copyrighted material should be included in the fork
  * The name `SonarQube for IDE` should not be used in the fork
  * Should be used exclusively for ABL analysis
  * Should not conflict with the official extension (both extensions should be installable in parallel)
    * Independant views, settings, commands, ...
  * No connection possible to SonarCloud, and remove references to SonarCloud as it will never be possible to analyze ABL on SonarCloud
  * Remove references to `repox.jfrog.io` in `package-lock.json` (use `registry.npmjs.org`)

* In package.json
  * Publisher changed from `SonarSource` to `RiversideSoftware`
  * Extension Id changed from `sonarlint-vscode` to `sonarlint-abl`
  * Settings prefix changed from `sonarlint` to `sonarlint-abl`
  * Commands prefix changed from `SonarLint.` to `SonarLint.ABL.` and from `SonarQube.` to `SonarQube.ABL`.
  * Commands category changed from `SonarQube` to `CABL`
  * View name changed from `SonarLint.` to `sonarlint-abl.` and from `SonarQube.` to `sonarqube-abl.`
  * Remove walkthrough section

* Somewhere else:
  * Prefix of setContext attributes changed from `sonarqube` to `sonarlint-abl`
