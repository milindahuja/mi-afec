import { Injectable } from "@angular/core";
import { Author, Category, Formats, ProcessedVideo } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  // get selected Video Index
  findVideoIndex(author: Author | undefined, videoId: number): number {
    if (!author) {
      return -1;
    }
    return author.videos.findIndex((v) => v.id === videoId);
  }

  //get Formatted Date
  getFormattedDate() {
    return new Date().toISOString().slice(0, 10);
  }

  // generate a unique video ID based on existing data
  generateVideoId(authorsData: Author[]) {
    let id = 0;
    for (const person of authorsData) {
      for (const video of person.videos) {
        if (video.id > id) {
          id = video.id;
        }
      }
    }
    return id + 1;
  }

  // get category IDs by names
  getCategoryIdsByNames(
    categories: string[],
    categoriesData: Category[]
  ): number[] {
    return categories
      .map((name) => categoriesData.find((category) => category.name === name))
      .filter((category) => !!category)
      .map((category) => category!.id);
  }

  // find author by Name
  findAuthorByName(
    authorName: string,
    authorsData: Author[]
  ): Author | undefined {
    return authorsData.find((author) => author.name === authorName);
  }

  // find Author Index
  findAuthorIndexByName(authorName: string, authorsData: Author[]): number {
    return authorsData.findIndex(
      (author) => author.name === authorName
    );
  }

  // find author by video id
  findAuthorByVideoId(id: number, authorsData: Author[]): Author | undefined {
    return authorsData.find((author) =>
      author.videos.some((video) => video.id === id)
    );
  }

  createFormatsFromHighestQualityLabel(label: string): Formats | null {
    const parts = label.split(' ');
    if (parts.length !== 2) {
      return null; // Invalid label format
    }
  
    const [formatName, resolution] = parts;
  
    return {
      [formatName]: { res: resolution, size: 0 },
    };
  }

  // Helper function to get the property value and convert to string if needed
  getPropertyValue(
    obj: ProcessedVideo,
    property: keyof ProcessedVideo
  ): string {
    const value = obj[property];

    if (typeof value === "string") {
      return value; // Property is already a string, no conversion needed
    } else if (typeof value === "number") {
      return value.toString(); // Convert numbers to string
    } else if (Array.isArray(value)) {
      return value.join(", "); // Convert arrays to comma-separated string
    } else {
      return "";
    }
  }
}
