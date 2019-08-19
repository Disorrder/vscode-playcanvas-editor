const vscode = require('vscode');

function activate(context) {
    console.log("qweqwe")
	let disposable = vscode.commands.registerCommand('extension.playcanvas', () => {
		vscode.window.showInformationMessage('TODO: open editor tab!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

console.log("ASDASD", module.exports);
