import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Author, Category, NewVideo, ProcessedVideo, Video } from './interfaces';

@Component({
  selector: 'mi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  videos: ProcessedVideo[] = [];
  showAddVideoForm = false;
  categoriesData: Category[] = []
  lengthOfAuthorsResponse: number = 0;
  newAuthorObj: Author[] = [];
  newVideo: NewVideo = {
    name: '',
    videoAuthor: '',
    categories:[]
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Fetch and store video data
    this.dataService.getVideos().subscribe((videos) => {
      this.videos = videos;
    });

    //get length of the author's response to generate id
    this.dataService.getAuthorsAndCategories().subscribe(([authors, categories]) => {
      this.lengthOfAuthorsResponse = authors.length;
      this.categoriesData = categories;
    });
  }

  generateUniqueId() {
    return Math.floor(Math.random() * 1000); 
  }

  addVideo() {
   // Generate a unique video ID
  const newAuthorId = this.lengthOfAuthorsResponse+1;
  const newVideoId = this.videos.length+1
  // Access the data from the newVideo object
  const videoName = this.newVideo.name;
  const videoAuthor = this.newVideo.videoAuthor;
  const videoCategories = this.newVideo.categories;
  const currentDate = new Date(); // Get the current date
  const formattedDate = currentDate.toISOString().slice(0, 10); // Format it as "YYYY-MM-DD"

  // Create a new video object
  const newVideo: Video = {
    id: newVideoId,
    catIds: this.getCategoryIdsByNames(videoCategories), // You can populate this based on categories later
    name: videoName,
    releaseDate: formattedDate, // You can populate this based on your requirements
    formats: {
      one: { res: '1080p', size: 1000 }, // Default format
    },
  };

  // Check if the author already exists in newAuthorObj
  let authorObj = this.newAuthorObj.find((author) => author.name === videoAuthor);

  if (!authorObj) {
    // If the author doesn't exist, create a new author object
    authorObj = {
      id: newAuthorId,
      name: videoAuthor,
      videos: [],
    };
    // Push the new author object to newAuthorObj
    this.newAuthorObj.push(authorObj);
  }

  console.log('this.newAuthorObj', authorObj);

  // Push the new video object to the author's videos array
  authorObj.videos.push(newVideo);

  // Reset the form and hide it
  this.resetAddVideoForm();
  }

  resetAddVideoForm() {
    // Reset the newVideo object
    /* this.newVideo = {
      name: '',
      videoAuthor: '',
      categories:[]
    } */
    // Hide the form
    this.showAddVideoForm = false;
  }

  cancelAddVideoForm() {
    this.showAddVideoForm = false; // Hide the form
  }

  getCategoryIdsByNames(categories: string[]): number[] {
    return categories
    .map((name) => this.categoriesData.find((category) => category.name === name))
    .filter((category) => category !== undefined)
    .map((category) => category!.id);
  }
}
