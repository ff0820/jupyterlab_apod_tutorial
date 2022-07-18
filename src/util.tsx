export type Cell = {
  no: number;
  id: string;
  cellType: string;

  isSelected: boolean;
  relation: number | undefined;
  bindToSlides: number[];

  inputs: any;
  outputs: any;

  inputLines: number;
  mediaType: string;
};
