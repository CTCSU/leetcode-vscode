// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import { ViewColumn } from "vscode";
import { openKeybindingsEditor, promptHintMessage } from "../utils/uiUtils";
import { ILeetCodeWebviewOption, LeetCodeWebview } from "./LeetCodeWebview";
import { markdownEngine } from "./markdownEngine";
import { ISubmitEvent } from "../shared";

class LeetCodeSubmissionProvider extends LeetCodeWebview {

    protected readonly viewType: string = "leetcode.submission";
    private result: IResult;

    public show(resultString: string): void {
        this.result = this.parseResult(resultString);
        this.showWebviewInternal();
        this.showKeybindingsHint();
    }
    public getSubmitEvent(): ISubmitEvent {
        return this.result.system_message as unknown as ISubmitEvent
    }

    protected getWebviewOption(): ILeetCodeWebviewOption {
        return {
            title: "Submission",
            viewColumn: ViewColumn.Two,
        };
    }

    protected getWebviewContent(): string {
        const styles: string = markdownEngine.getStyles();
        const title: string = `## ${this.result.messages[0]}`;
        const messages: string[] = this.result.messages.slice(1).map((m: string) => `* ${m}`);
        const sections: string[] = Object.keys(this.result)
            .filter((key: string) => (key !== "messages" && key !== "system_message"))
            .map((key: string) => [
                `### ${key}`,
                "```",
                this.result[key].join("\n"),
                "```",
            ].join("\n"));
        const body: string = markdownEngine.render([
            title,
            ...messages,
            ...sections,
        ].join("\n"));
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src vscode-resource:; style-src vscode-resource:;"/>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${styles}
            </head>
            <body class="vscode-body 'scrollBeyondLastLine' 'wordWrap' 'showEditorSelection'" style="tab-size:4">
                ${body}
            </body>
            </html>
        `;
    }

    protected onDidDisposeWebview(): void {
        super.onDidDisposeWebview();
    }

    private async showKeybindingsHint(): Promise<void> {
        await promptHintMessage(
            "hint.commandShortcut",
            'You can customize shortcut key bindings in File > Preferences > Keyboard Shortcuts with query "leetcode".',
            "Open Keybindings",
            (): Promise<any> => openKeybindingsEditor("leetcode solution"),
        );
    }

    private parseResult(raw: string): IResult {
        return JSON.parse(raw);
    }
}

interface IResult {
    [key: string]: string[];
    messages: string[];
}


export const leetCodeSubmissionProvider: LeetCodeSubmissionProvider = new LeetCodeSubmissionProvider();
