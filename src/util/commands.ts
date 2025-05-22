/* --------------------------------------------------------------------------------------------
 * SonarLint for VisualStudio Code
 * Copyright (C) 2017-2025 SonarSource SA
 * sonarlint@sonarsource.com
 * Licensed under the LGPLv3 License. See LICENSE.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

/**
 * Commonly used commands
 */
export namespace Commands {
  /**
   * Open Browser
   */
  export const OPEN_BROWSER = 'vscode.open';

  /**
   * Open settings.json
   */
  export const OPEN_JSON_SETTINGS = 'workbench.action.openSettingsJson';

  /**
   * Open settings
   */
  export const OPEN_SETTINGS = 'workbench.action.openSettings';

  export const DEACTIVATE_RULE = 'SonarLint.ABL.DeactivateRule';
  export const ACTIVATE_RULE = 'SonarLint.ABL.ActivateRule';
  export const SHOW_ALL_RULES = 'SonarLint.ABL.ShowAllRules';
  export const SHOW_ACTIVE_RULES = 'SonarLint.ABL.ShowActiveRules';
  export const SHOW_INACTIVE_RULES = 'SonarLint.ABL.ShowInactiveRules';
  export const SHOW_SONARLINT_OUTPUT = 'SonarLint.ABL.ShowSonarLintOutput';
  export const OPEN_RULE_BY_KEY = 'SonarLint.ABL.OpenRuleByKey';
  export const FIND_RULE_BY_KEY = 'SonarLint.ABL.FindRuleByKey';
  export const SHOW_ALL_LOCATIONS = 'SonarLint.ABL.ShowAllLocations';
  export const CLEAR_LOCATIONS = 'SonarLint.ABL.ClearLocations';
  export const NAVIGATE_TO_LOCATION = 'SonarLint.ABL.NavigateToLocation';

  export const INSTALL_MANAGED_JRE = 'SonarLint.ABL.InstallManagedJre';

  export const HIDE_HOTSPOT = 'SonarLint.ABL.HideHotspot';
  export const SHOW_HOTSPOT_DESCRIPTION = 'SonarLint.ABL.ShowHotspotDescription';
  export const CONFIGURE_COMPILATION_DATABASE = 'SonarLint.ABL.ConfigureCompilationDatabase';

  export const CONNECT_TO_SONARQUBE = 'SonarLint.ABL.ConnectToSonarQube';
  export const CONNECT_TO_SONARCLOUD = 'SonarLint.ABL.ConnectToSonarCloud';
  export const EDIT_SONARQUBE_CONNECTION = 'SonarLint.ABL.EditSonarQubeConnection';
  export const EDIT_SONARCLOUD_CONNECTION = 'SonarLint.ABL.EditSonarCloudConnection';
  export const SHARE_CONNECTED_MODE_CONFIG = "SonarLint.ABL.ShareConnectedModeConfiguration";
  export const REMOVE_CONNECTION = 'SonarLint.ABL.RemoveConnection';

  export const ADD_PROJECT_BINDING = 'SonarLint.ABL.AddProjectBinding';
  export const EDIT_PROJECT_BINDING = 'SonarLint.ABL.EditProjectBinding';
  export const REMOVE_PROJECT_BINDING = 'SonarLint.ABL.RemoveProjectBinding';

  export const SHOW_HOTSPOT_LOCATION = 'SonarLint.ABL.ShowHotspotLocation';
  export const SHOW_HOTSPOT_RULE_DESCRIPTION = 'SonarLint.ABL.ShowHotspotRuleDescription';
  export const SHOW_HOTSPOT_DETAILS = 'SonarLint.ABL.ShowHotspotDetails';
  export const OPEN_HOTSPOT_ON_SERVER = 'SonarLint.ABL.OpenHotspotOnServer';
  export const HIGHLIGHT_REMOTE_HOTSPOT_LOCATION = 'SonarLint.ABL.HighlightRemoteHotspotLocation';
  export const CLEAR_HOTSPOT_HIGHLIGHTING = 'SonarLint.ABL.ClearHotspotLocations';
  export const SHOW_HOTSPOTS_IN_OPEN_FILES = 'SonarLint.ABL.ShowHotspotsInOpenFiles';
  export const SCAN_FOR_HOTSPOTS_IN_FOLDER = 'SonarLint.ABL.ScanForHotspotsInFolder';
  export const FORGET_FOLDER_HOTSPOTS = 'SonarLint.ABL.ForgetFolderHotspots';

  export const RESOLVE_ISSUE = 'SonarLint.ABL.ResolveIssue';
  export const REOPEN_LOCAL_ISSUES = 'SonarLint.ABL.ReopenLocalIssues';
  export const TRIGGER_HELP_AND_FEEDBACK_LINK = 'SonarLint.ABL.HelpAndFeedbackLinkClicked';
  export const CHANGE_HOTSPOT_STATUS = 'SonarLint.ABL.ChangeHotspotStatus';
  export const ENABLE_VERBOSE_LOGS = 'SonarLint.ABL.EnableVerboseLogs';
  export const ANALYSE_OPEN_FILE = 'SonarLint.ABL.AnalyseOpenFile';
  export const NEW_CODE_DEFINITION = 'SonarLint.ABL.NewCodeDefinition';
  export const AUTO_BIND_WORKSPACE_FOLDERS = 'SonarLint.ABL.AutoBindWorkspaceFolders';

  export const FOCUS_ON_CONNECTION = 'SonarLint.FocusOnConnection';
}
