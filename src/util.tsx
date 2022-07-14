export type Cell = {
  id: string;
  cellType: string;

  isSelected: boolean;
  relation: number | undefined;
  bindToSlides: number[];

  inputs: any;
  outputs: any;
  mediaType: string;
};
