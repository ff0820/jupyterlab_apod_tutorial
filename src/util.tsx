export type Cell = {
  no: number;
  id: string;
  cellType: string;

  isSelected: boolean;
  relation: object | undefined;
  bindToSlides: number[];

  inputs: any;
  outputs: any;

  inputLines: number;
  mediaType: string;
};

export type CellRelation = {
  source: number; // corresponding to cell no
  target: number;
  weight: number;
};

export enum CellState {
  Default = 'darkgray',
  CurrentOn = '#5cd65c',
  Select = 'orange',
  Bind = 'red'
}
