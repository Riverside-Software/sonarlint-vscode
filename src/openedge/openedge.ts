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

export async function waitForOpenEdgeCompilation(fileUri: string): Promise<boolean> {
  const extension = getOpenEdgeExtension();
  try {
    const extensionApi = await extension?.activate();
    // Older versions of the ABL extension don't expose waitForCompilation
    if (typeof extensionApi?.waitForCompilation === 'function') {
      return (await extensionApi.waitForCompilation(fileUri)) as boolean;
    }
  } catch (error) {
    console.error(error);
  }
  return true;
}

function getOpenEdgeExtension() {
  return VSCode.extensions.getExtension('riversidesoftware.openedge-abl-lsp');
}
