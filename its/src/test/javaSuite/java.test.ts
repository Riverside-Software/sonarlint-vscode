/* --------------------------------------------------------------------------------------------
 * SonarLint for VisualStudio Code
 * Copyright (C) 2017-2025 SonarSource SA
 * sonarlint@sonarsource.com
 * Licensed under the LGPLv3 License. See LICENSE.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

import { activateAndShowOutput, dumpLogOutput, waitForSonarLintDiagnostics } from '../common/util';
import { expect } from 'chai';

const sampleFolderLocation = '../../../samples/';
const sampleJavaFolderLocation = '../../../samples/sample-java-maven-multi-module/';

const JAVA_LS_TIMEOUT_MILLIS = 30000;

suite('Java Test Suite', () => {

  suiteSetup('Ensure readiness of extension and Java LS', async function () {
    this.timeout(JAVA_LS_TIMEOUT_MILLIS);
    assert.ok(vscode.extensions.getExtension('RiversideSoftware.sonarlint-abl'), 'Extension did not load');
    const javaExtension = vscode.extensions.getExtension('redhat.java');
    assert.ok(javaExtension, 'Java extension did not load');
    const javaExtensionApi = javaExtension?.exports;
    assert.ok(javaExtensionApi.onDidServerModeChange, 'Java extension does not export required API');

    const serverModeChangePromise = new Promise<void>((resolve, _) => {
      javaExtensionApi.onDidServerModeChange((mode: string) => {
        // At this point, we'll wait at most JAVA_LS_TIMEOUT_MILLIS until the Java LS is up in Standard mode
        if (mode === 'Standard') {
          resolve();
        }
      });
    });

    await Promise.all([ serverModeChangePromise, activateAndShowOutput() ]);
  });

  test('should report issue on java file', async function () {
    await vscode.commands.executeCommand('SonarLint.ShowSonarLintOutput');

    const fileUri = vscode.Uri.file(
      path.join(
        __dirname,
        sampleFolderLocation,
        'sample-java-maven-multi-module',
        'module-java/src/main/java/edu/marcelo/App.java'
      )
    );
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);

    // Check that we have 2 diagnostics in the right order
    const diags = await waitForSonarLintDiagnostics(fileUri, { atLeastIssues: 2 });
    assert.deepStrictEqual(diags.map(d => [ d.code, d.message ]), [
      [ 'java:S1130', 'Remove the declaration of thrown exception \'edu.marcelo.App$MyException\', as it cannot be thrown from method\'s body.' ],
      [ 'java:S106', 'Replace this use of System.out by a logger.' ]
    ]);

    // Check that the exception-related diagnostic has 3 code actions
    const rangeInMiddleOfThrowsMyException = new vscode.Range(8, 54, 8, 54);
    const codeActionsResult = (await vscode.commands.executeCommand<(vscode.Command | vscode.CodeAction)[]>('vscode.executeCodeActionProvider', document.uri, rangeInMiddleOfThrowsMyException, vscode.CodeActionKind.QuickFix.value));
    // With old versions of VSCode, code actions are not necessarily filtered on kind
    const expectedActionTitles = [
      "SonarQube: Deactivate rule 'java:S1130'",
      "SonarQube: Remove \"MyException\"",
      "SonarQube: Show issue details for 'java:S1130'"
    ];
    const actualCodeActionTitles = codeActionsResult.filter(c => expectedActionTitles.indexOf(c.title) >= 0).map(c => c.title);
    // Order of code actions is not stable, forcing lexicographic order for assertion
    actualCodeActionTitles.sort((a, b) => a.localeCompare(b));
    assert.deepStrictEqual(actualCodeActionTitles, expectedActionTitles);

    // Check that first fix has an edit that can be applied
    const quickFix = codeActionsResult.filter(c => c.title === 'SonarQube: Remove "MyException"')[0] as vscode.CodeAction;
    const fixApplied = await vscode.workspace.applyEdit(quickFix.edit!);
    assert.strictEqual(fixApplied, true);

    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  }).timeout(60 * 1000);

  test('should report issue on single java test file', async function () {
    await vscode.commands.executeCommand('SonarLint.ShowSonarLintOutput');
    const fileUri = vscode.Uri.file(
      path.join(__dirname, sampleJavaFolderLocation, 'module-java/src/test/java/edu/marcelo', 'AppTest.java')
    );
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);

    const diags = await waitForSonarLintDiagnostics(fileUri);

    assert.deepStrictEqual(diags.length, 2);
    const messages = diags.map(d => d.message);
    expect(messages).to.include('Add a nested comment explaining why this method is empty, throw an UnsupportedOperationException or complete the implementation.');
    expect(messages).to.include('Add at least one assertion to this test case.');

    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  }).timeout(120 * 1000);

  suiteTeardown(() => {
    dumpLogOutput();
  });
});
