import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { API } from './constants';
import { Author, Category, ProcessedVideo, Video } from './interfaces';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  categoriesData: Category[] = [];
  authorsData: Author[] = [];

  constructor(private http: HttpClient) {}

  // Fetch both authors and categories data
  getAuthorsAndCategories(): Observable<[Author[], Category[]]> {
    const authors$ = this.http.get<Author[]>(`${API}/authors`);
    const categories$ = this.http.get<Category[]>(`${API}/categories`);
    return forkJoin([authors$, categories$]);
  }

  // Transform author and category data into ProcessedVideo objects
  getVideos(): Observable<ProcessedVideo[]> {
    return this.getAuthorsAndCategories().pipe(
      map(([authors, categories]) => {
        const videos: ProcessedVideo[] = [];
        this.authorsData = authors;
        this.categoriesData = categories;
        authors.forEach((author) => {
          author.videos.forEach((video) => {
            const processedVideo = this.mapVideoToProcessedVideo(video, author, categories);
            videos.push(processedVideo);
          });
        });

        return videos;
      })
    );
  }

  // Add a new Video
  addNewVideoToAuthorData(authorDataObj: Author): Observable<void> {
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<void>(`${API}/authors`, authorDataObj);
  }

  //Edit Video
  updateVideo(authorDataObj: Author): Observable<any> {
    return this.http.put(`${API}/authors/${authorDataObj.id}`, authorDataObj);
  }

  //Delete Video
  deleteVideo(authorDataObj: Author): Observable<any> {
    return this.http.delete(`${API}/authors/${authorDataObj.id}`);
  }

  getAuthorsData() {
    return this.authorsData;
  }

  getCategoriesData() {
    return this.categoriesData;
  }


  private mapVideoToProcessedVideo(
    video: Video,
    author: Author,
    categories: Category[]
  ): ProcessedVideo {
    const highestQualityFormatName = this.findHighestQualityFormat(video.formats);
    const highestQualityFormat = video.formats[highestQualityFormatName];
    const label = `${highestQualityFormatName} ${highestQualityFormat.res}`;

    const processedVideo: ProcessedVideo = {
      id: video.id,
      name: video.name,
      author: author.name,
      categories: this.mapCategoryIdsToNames(video.catIds, categories),
      highestQualityFormat: label,
      releaseDate: video.releaseDate,
    };

    return processedVideo;
  }

  findHighestQualityFormat(formats: { [key: string]: { res: string; size: number } }): string {
    let highestQualityFormat = '';

    // Iterate through the video formats to find the highest quality format
    for (const formatName in formats) {
      const format = formats[formatName];

      if (!highestQualityFormat) {
        highestQualityFormat = formatName;
      } else {
        const currentSize = format.size;
        const currentRes = format.res;
        const highestSize = formats[highestQualityFormat].size;
        const highestRes = formats[highestQualityFormat].res;

        if (currentSize > highestSize || (currentSize === highestSize && currentRes > highestRes)) {
          highestQualityFormat = formatName;
        }
      }
    }
    return highestQualityFormat;
  }
  
  private mapCategoryIdsToNames(catIds: number[], categories: Category[]): string[] {
    return catIds.map((catId) => {
      const category = categories.find((cat) => cat.id === catId);
      return category ? category.name : 'Unknown Category';
    });
  }
}
