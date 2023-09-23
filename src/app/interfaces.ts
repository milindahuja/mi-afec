export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: {
    [key: string]: {
      res: string;
      size: number;
    };
  };
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface NewVideo {
  name: '',
  videoAuthor: '',
  categories: string[]
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: string[];
  highestQualityFormat: string;
  releaseDate: string;
}
