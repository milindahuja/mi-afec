export interface Category {
  id: number;
  name: string;
}

interface Format {
  res: string;
  size: number;
}

export interface Formats {
  [formatName: string]: Format;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: Formats;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface NewVideo {
  name: string,
  videoAuthor: string,
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
