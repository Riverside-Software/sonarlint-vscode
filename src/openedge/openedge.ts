import * as VSCode from 'vscode';
import { SonarLintExtendedLanguageClient } from '../lsp/client';
import { ExtendedClient } from '../lsp/protocol';

export async function getOpenEdgeConfig(
  languageClient: SonarLintExtendedLanguageClient,
  fileUri: string
): Promise<ExtendedClient.GetOpenEdgeConfigResponse> {
  const extension = getOpenEdgeExtension();
  try {
    const extensionApi = await extension?.activate();
    if (extensionApi) {
      const rslt = await extensionApi.getFileInfo(fileUri);
      return rslt as ExtendedClient.GetOpenEdgeConfigResponse;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

function getOpenEdgeExtension() {
  return VSCode.extensions.getExtension('riversidesoftware.openedge-abl-lsp');
}
