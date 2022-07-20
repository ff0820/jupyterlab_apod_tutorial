// CodeOverview
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

// ControlPanel
export type SlideMeta = {
  title: string;
  author?: string;
  theme?: string;
};

export type SlideData = {
  active: boolean;

  connectedCells: Cell[];
  constrait: Contraint;

  tag: string;
  titles: Title[];
  bulletPoints: BulletPoints[];

  layouts: []; // Todo: to be specified
  navis: []; // Todo: to be specified
};

export type Contraint = {
  audienceLevel: number;
  detailLevel: number;
};

export type Title = {
  title: string;
  type: SourceType;
  weight?: number;
  isChosen: boolean;
};

export type BulletPoints = {
  bullet: string;
  type: SourceType;
  weight?: number;
  isChosen: boolean;
};

export enum SourceType {
  Markdown = 'markdown',
  Code = 'code'
}
