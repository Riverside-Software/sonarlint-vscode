import { SonarLintDocumentation } from '../commons';
import { Command } from 'vscode';
import { Commands } from '../util/commands';

export interface HelpAndFeedbackItem {
  id: string;
  label?: string;
  url?: string;
  icon?: string;
  viewItem: boolean;
  command?: Command;
}

export const helpAndFeedbackItems: HelpAndFeedbackItem[] = [
  {
    id: 'docs',
    label: 'Read Documentation',
    url: SonarLintDocumentation.BASE_DOCS_URL,
    icon: 'book',
    viewItem: true
  },
  {
    id: 'getHelp',
    label: 'Get Help | Report Issue',
    url: 'https://github.com/Riverside-Software/sonar-openedge/issues',
    icon: 'comment-discussion',
    viewItem: true
  },
  {
    id: 'suggestFeature',
    label: 'Suggest a Feature',
    url: 'https://www.sonarsource.com/products/sonarlint/roadmap/',
    icon: 'extensions',
    viewItem: true
  },
  {
    id: 'checkLogs',
    label: 'See Extension Logs',
    icon: 'output',
    viewItem: true,
    command: {
      command: Commands.ENABLE_LOGS_AND_SHOW_OUTPUT,
      title: 'Show SonarQube Output'
    }
  },
  {
    id: 'sonarQubeProductPage',
    label: 'SonarQube Server',
    url: 'https://www.sonarsource.com/products/sonarqube/',
    icon: 'n/a',
    viewItem: false
  },
  {
    id: 'connectedModeDocs',
    url: 'https://docs.sonarsource.com/sonarqube-for-ide/vs-code/team-features/connected-mode/',
    viewItem: false
  },
  {
    id: 'compareServerProducts',
    url: 'https://www.sonarsource.com/plans-and-pricing/sonarcloud/',
    viewItem: false
  },
  {
    id: 'sonarQubeEditionsDownloads',
    url: 'https://www.sonarsource.com/products/sonarqube/downloads/',
    viewItem: false
  },
  {
    id: 'sonarLintWalkthrough',
    viewItem: false,
    command: {
      command: 'workbench.action.openWalkthrough',
      title: 'Welcome to SonarQube for IDE!',
      arguments: ['SonarSource.sonarlint-vscode#SonarLint.walkthrough', false]
    }
  },
];
