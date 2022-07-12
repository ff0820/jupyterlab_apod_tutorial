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

import { CounterWidget } from './widget';
// import { requestAPI } from './handler';
// import _ from 'lodash';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'toolbar-button:plugin',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

function selectCells(panel: NotebookPanel, notebook: Notebook) {
  let cellsToJson = panel.model?.toJSON();
  console.log('model toJSON', cellsToJson);

  // let cells = panel.model?.cells;

  // if (cells) {
  //   cells.forEach(cell => {
  //     let flag = notebook.isSelectedOrActive(cell);
  //     console.log('isSelected', flag);
  //   });
  // }
}

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
      // get the contents of all the cells
      console.log('model toJSON', panel.model?.toJSON());

      // get the contents of one cells
      console.log(
        'model cell \n',
        panel.model?.cells.get(4).toJSON().outputs?.[0]
      );

      // let cells = panel.model?.cells;

      // _.forEach(cells, cell => {
      //   // let flag = notebook.isSelectedOrActive(cell);
      //   console.log('isSelected', cell);
      // });

      NotebookActions.clearAllOutputs(panel.content);

      //  notebook.widgets
      //    .filter(cell => notebook.isSelectedOrActive(cell))
      //    .map(cell => cell.model.toJSON());
    };

    const button = new ToolbarButton({
      className: 'clear-output-button',
      label: 'Clear All Outputs',
      onClick: clearOutput,
      tooltip: 'Clear All Outputs'
    });

    panel.toolbar.insertItem(10, 'clearOutputs', button);
    return new DisposableDelegate(() => {
      button.dispose();
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
  console.log(
    'JupyterLab extension jupyterlab_apod is activated! FF is testing!!!'
  );

  // Adding a button to the toolbar
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());

  // Declare a widget variable
  let widget: MainAreaWidget<CounterWidget>;

  // Add an application command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'NB2Slides',
    execute: (args: any) => {
      console.log('args into plugin ', args.origin);

      if (!widget || widget.isDisposed) {
        // Create a new widget if one does not exist
        // or if the previous one was disposed after closing the panel
        const content = new CounterWidget();
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
  let tracker = new WidgetTracker<MainAreaWidget<CounterWidget>>({
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
