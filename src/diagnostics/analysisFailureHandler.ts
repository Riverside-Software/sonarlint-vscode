/* --------------------------------------------------------------------------------------------
 * SonarLint for VisualStudio Code
 * Copyright (C) 2017-2025 SonarSource SA
 * sonarlint@sonarsource.com
 * Licensed under the LGPLv3 License. See LICENSE.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as VSCode from 'vscode';
import { logToSonarLintOutput } from '../util/logging';

export class AnalysisFailureHandler {
  private static _instance: AnalysisFailureHandler;
  private diagnosticCollection: VSCode.DiagnosticCollection;
  private analysisTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private static readonly ANALYSIS_TIMEOUT_MS = 10000; // 10 seconds timeout for analysis

  static init(context: VSCode.ExtensionContext): void {
    AnalysisFailureHandler._instance = new AnalysisFailureHandler();
    context.subscriptions.push(AnalysisFailureHandler._instance.diagnosticCollection);
    
    // Add a disposable to clear all timeouts when the extension is deactivated
    context.subscriptions.push({
      dispose: () => {
        AnalysisFailureHandler._instance.clearAllTimeouts();
      }
    });
  }

  constructor() {
    this.diagnosticCollection = VSCode.languages.createDiagnosticCollection('sonarlint-analysis-failure');
  }
  
  /**
   * Clears all analysis timeouts
   */
  private clearAllTimeouts(): void {
    for (const [_, timeout] of this.analysisTimeouts) {
      clearTimeout(timeout);
    }
    this.analysisTimeouts.clear();
  }

  static get instance(): AnalysisFailureHandler {
    return AnalysisFailureHandler._instance;
  }

  /**
   * Tracks an analysis request for the given file and sets a timeout
   * @param fileUri The URI of the file being analyzed
   */
  trackAnalysisRequest(fileUri: VSCode.Uri): void {
    const uriString = fileUri.toString();
    
    // Clear any existing timeout for this file
    this.clearAnalysisTimeout(uriString);
    
    // Set a new timeout to detect analysis failures
    const timeout = setTimeout(() => {
      logToSonarLintOutput(`Analysis timeout for ${uriString}`);
      this.reportAnalysisFailure(fileUri, 'Analysis timed out');
      this.analysisTimeouts.delete(uriString);
    }, AnalysisFailureHandler.ANALYSIS_TIMEOUT_MS);
    
    this.analysisTimeouts.set(uriString, timeout);
    logToSonarLintOutput(`Tracking analysis request for ${uriString}`);
  }
  
  /**
   * Clears the analysis timeout for the given file URI
   * @param uriString The string representation of the file URI
   */
  private clearAnalysisTimeout(uriString: string): void {
    const existingTimeout = this.analysisTimeouts.get(uriString);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.analysisTimeouts.delete(uriString);
    }
  }

  /**
   * Reports an analysis failure for the given file
   * @param fileUri The URI of the file that failed analysis
   * @param reason Optional reason for the failure
   */
  reportAnalysisFailure(fileUri: VSCode.Uri, reason?: string): void {
    const uriString = fileUri.toString();
    logToSonarLintOutput(`Reporting analysis failure for ${uriString}${reason ? `: ${reason}` : ''}`);
    
    // Clear any existing timeout for this file
    this.clearAnalysisTimeout(uriString);
    
    // Create a diagnostic at the first line of the file
    const diagnostic = new VSCode.Diagnostic(
      new VSCode.Range(0, 0, 0, 0),
      'CABL scan failed. Please check logs or configuration.',
      VSCode.DiagnosticSeverity.Error
    );
    
    // Set source to identify it as a CABL analysis failure
    diagnostic.source = 'cabl-analysis-failure';
    
    // Add the diagnostic to the collection
    this.diagnosticCollection.set(fileUri, [diagnostic]);
  }

  /**
   * Clears analysis failure diagnostics for the given file
   * @param fileUri The URI of the file to clear diagnostics for
   */
  clearAnalysisFailure(fileUri: VSCode.Uri): void {
    const uriString = fileUri.toString();
    
    // Clear any existing timeout for this file
    this.clearAnalysisTimeout(uriString);
    
    // Clear the diagnostic
    this.diagnosticCollection.delete(fileUri);
  }

  /**
   * Clears all analysis failure diagnostics
   */
  clearAllAnalysisFailures(): void {
    this.diagnosticCollection.clear();
  }

  /**
   * Disposes the diagnostic collection
   */
  dispose(): void {
    this.diagnosticCollection.dispose();
  }
}