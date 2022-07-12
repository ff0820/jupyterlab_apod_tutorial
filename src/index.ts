import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import {
  ToolbarButton,
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  NotebookPanel,
  INotebookModel,
  NotebookActions,
  Notebook
} from '@jupyterlab/notebook';

import { NB2Slides } from './nb2slides';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'toolbar-button:plugin',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  /**
   * Create a new extension for the notebook panel widget.
   *
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const clearOutput = () => {
      NotebookActions.clearAllOutputs(panel.content);
    };

    const getCells = () => {
      // get the contents of all the cells
      console.log('model toJSON', panel.model?.toJSON());

      // get the contents of one cell
      console.log('model cell \n', panel.model?.cells.get(4).toJSON());
    };

    const button = new ToolbarButton({
      className: 'clear-output-button',
      label: 'Clear All Outputs',
      onClick: clearOutput,
      tooltip: 'Clear All Outputs'
    });

    const button2 = new ToolbarButton({
      className: 'get-cells-button',
      label: 'Get Cells',
      onClick: getCells,
      tooltip: 'Get Cells'
    });

    panel.toolbar.insertItem(10, 'clearOutputs', button);
    panel.toolbar.insertItem(11, 'getCells', button2);
    return new DisposableDelegate(() => {
      button.dispose();
      button2.dispose();
    });
  }
}

/**
 * Activate the extension.
 * @param app
 * @param palette
 * @param restorer
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer
) {
  console.log('the JupyterLab main application:', app);

  // Adding a button to the toolbar
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());

  // Declare a widget variable
  let widget: MainAreaWidget<NB2Slides>;

  // Add an application command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'NB2Slides',
    execute: (args: any) => {
      console.log('args into plugin ', args.origin);

      if (!widget || widget.isDisposed) {
        // Create a new widget if one does not exist
        // or if the previous one was disposed after closing the panel
        const content = new NB2Slides({});
        widget = new MainAreaWidget({ content });
        widget.id = 'apod-jupyterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      widget.content.update();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({
    command,
    category: 'Tutorial',
    args: { origin: 'from the palette' }
  });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<NB2Slides>>({
    namespace: 'apod'
  });
  restorer.restore(tracker, {
    command,
    name: () => 'apod'
  });
}

/**
 * Export the plugin as default.
 */
export default plugin;
