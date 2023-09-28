import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { API } from '../constants';
import { Author, Category, ProcessedVideo, Video } from '../interfaces';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  categoriesData: Category[] = [];
  authorsData: Author[] = [];
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Fetch both authors and categories data
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`, this.httpOptions);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`, this.httpOptions);
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
      }),
      catchError((error) => {
        // Handle HTTP errors here
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error for the component to handle
      })
    );
  }

  // Add a new Video
  addNewVideoToAuthorData(authorDataObj: Author): Observable<void> {
    return this.http.post<void>(`${API}/authors`, authorDataObj, this.httpOptions);
  }

  //Edit Video
  updateVideo(authorDataObj: Author): Observable<any> {
    return this.http.put(`${API}/authors/${authorDataObj.id}`, authorDataObj, this.httpOptions);
  }

  //Delete Video
  deleteVideo(authorId: number): Observable<any> {
    return this.http.delete(`${API}/authors/${authorId}`, this.httpOptions);
  }

  //Delete Video
  deleteAuthor(authorId: number): Observable<any> {
    return this.http.delete(`${API}/authors/${authorId}`, this.httpOptions);
  }

  getAuthorsData() {
    return this.authorsData;
  }

  getCategoriesData() {
    return this.categoriesData;
  }

  private getAuthorsAndCategories(): Observable<[Author[], Category[]]> {
    return forkJoin([this.getAuthors(), this.getCategories()]);
  }

  // get the VideoObject with category names and highes quality label
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

  private findHighestQualityFormat(formats: { [key: string]: { res: string; size: number } }): string {
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
