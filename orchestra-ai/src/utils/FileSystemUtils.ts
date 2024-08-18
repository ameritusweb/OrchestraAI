import * as vscode from 'vscode';
import { initialState, StateShape } from '../constants/initialState';

export class FileSystemUtils {
  async getOrCreateStateFile(context: vscode.ExtensionContext): Promise<vscode.Uri> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error('No workspace folder open');
    }

    const rootUri = workspaceFolders[0].uri;
    const orchestraFolderUri = vscode.Uri.joinPath(rootUri, '.orchestra-ai');
    const stateFileUri = vscode.Uri.joinPath(orchestraFolderUri, 'state.orc');

    try {
      await vscode.workspace.fs.stat(orchestraFolderUri);
    } catch {
      // Folder doesn't exist, create it
      await vscode.workspace.fs.createDirectory(orchestraFolderUri);
    }

    try {
      await vscode.workspace.fs.stat(stateFileUri);
    } catch {
      // File doesn't exist, create it with initial state
      await this.writeStateFile(stateFileUri, initialState);
    }

    return stateFileUri;
  }

  async readStateFile(fileUri: vscode.Uri): Promise<StateShape> {
    try {
      const data = await vscode.workspace.fs.readFile(fileUri);
      const parsedData = JSON.parse(data.toString());
      // Merge the parsed data with the initial state to ensure all keys exist
      return this.mergeWithInitialState(parsedData);
    } catch (error) {
      console.error('Error reading state file:', error);
      return initialState;
    }
  }

  async writeStateFile(fileUri: vscode.Uri, data: StateShape): Promise<void> {
    try {
      await vscode.workspace.fs.writeFile(fileUri, Buffer.from(JSON.stringify(data, null, 2), 'utf8'));
    } catch (error) {
      console.error('Error writing state file:', error);
    }
  }

  private mergeWithInitialState(data: Partial<StateShape>): StateShape {
    return this.deepMerge(initialState, data) as StateShape;
  }

  private deepMerge(target: any, source: any): any {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
}