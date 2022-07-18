import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';
import {
  ToolbarButton,
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker,
  ReactWidget
} from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
  NotebookPanel,
  INotebookModel,
  NotebookActions
} from '@jupyterlab/notebook';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import * as _ from 'lodash';

import testCells from './data/cells';
import { Cell } from './util';
import { NB2SlidesWrapper } from './nb2slides';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'nb2slides:plugin',
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
  cells: any;
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
    this.cells = panel.model?.toJSON();
    console.log('cells from attrs', this.cells);

    const clearOutput = () => {
      NotebookActions.clearAllOutputs(panel.content);
    };

    const getCells = () => {
      // get the contents of all the cells
      console.log('model toJSON', panel.model?.toJSON());

      // get the contents of one cell
      console.log('model cell \n', panel.model?.cells.get(4).toJSON());

      this.cells = panel.model?.toJSON();
      console.log('cells from attrs', this.cells);
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

  getCells = (panel: NotebookPanel) => {
    // get the contents of all the cells
    console.log('model toJSON', panel.model?.toJSON());

    // get the contents of one cell
    console.log('model cell \n', panel.model?.cells.get(4).toJSON());
  };
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
  let toolbarButton = new ButtonExtension();
  app.docRegistry.addWidgetExtension('Notebook', toolbarButton);
  console.log('getCells', toolbarButton.cells);

  // Declare a widget variable
  let widget: MainAreaWidget<NB2SlidesWrapper>;

  // Add an application command
  const command: string = 'nb2slides:open';
  app.commands.addCommand(command, {
    label: 'NB2Slides',
    execute: (args: any) => {
      console.log('args into plugin ', args.origin);

      if (!widget || widget.isDisposed) {
        // get the right format cells
        console.log('getCells', testCells);

        let cells2NB2Slides: Cell[] = [];

        let calCodeLineNum = (code: string) => {
          // 临时调整codeoverview中矩形行高
          return code.split('\n').length * 5;
        };

        for (let i = 0; i < testCells.length; i++) {
          let cellTemp = testCells[i];
          let cell: Cell = {
            no: i,
            id: cellTemp.id,
            cellType: cellTemp.cell_type,
            isSelected: false,
            relation: undefined,
            bindToSlides: [],
            inputs: cellTemp.source,
            outputs: cellTemp.outputs,

            inputLines: calCodeLineNum(cellTemp.source),
            mediaType: 'text'
          };

          cells2NB2Slides.push(cell);
        }

        // Create a new widget if one does not exist
        // or if the previous one was disposed after closing the panel
        const content = new NB2SlidesWrapper({ cells: cells2NB2Slides });
        widget = new MainAreaWidget({ content });
        widget.id = 'nb2slides-jupyterlab';
        widget.title.label = 'NB2Slides';
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
    category: 'NB2Slides',
    args: { origin: 'from the palette' }
  });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<NB2SlidesWrapper>>({
    namespace: 'nb2slides'
  });
  restorer.restore(tracker, {
    command,
    name: () => 'nb2slides'
  });
}

/**
 * Export the plugin as default.
 */
export default plugin;
