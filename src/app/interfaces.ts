export interface IUUID {
  uuid: string;
}

export interface IStep extends IUUID {
  active: boolean;
}

export interface ITrack extends IUUID {
  steps: Array<IStep>;
  muted: boolean;
  name: string;
  filePath: string | null;
}

export interface IPattern extends IUUID {
  tracks: Array<ITrack>;
  name: string;
}

export interface IComposition extends IUUID {
  patterns: Array<IPattern>;
  bpm: number;
  name: string;
  currentlySelectedPattern: string;
}
