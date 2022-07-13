export type Cell = {
  id: string;

  isSelected: boolean;
  relation: number;
  bindToSlides: number[];

  inputs: any;
  outputs: any;
  mediaType: string;
};
