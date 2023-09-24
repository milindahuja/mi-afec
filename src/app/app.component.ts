import { Component, OnInit } from "@angular/core";
import { DataService } from "./data.service";
import { Author, NewVideo, ProcessedVideo, Video } from "./interfaces";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "mi-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  videoForm: FormGroup;
  fromHeaderText: string = "";
  videos: ProcessedVideo[] = [];
  showAddVideoForm = false;
  newAuthorObj: Author[] = [];
  authorOptions: string[] = [
    "David Munch",
    "Li Sun Chi",
    "Steven Scorsese",
    "Milind Ahuja",
  ];
  newVideo: NewVideo = {
    name: "",
    videoAuthor: "",
    categories: [],
  };

  // Create a variable to hold the video to be edited
  videoToEdit: ProcessedVideo | null = null;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    // Initialize the form with validators
    this.videoForm = this.formBuilder.group({
      name: ["", Validators.required],
      videoAuthor: ["", Validators.required],
      categories: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.getVideosList();
  }

  getVideosList() {
    // Fetch and store video data
    this.dataService.getVideos().subscribe((videos) => {
      this.videos = videos;
    });
  }

  generateUniqueId() {
    return Math.floor(Math.random() * 1000);
  }

  handleVideo() {
    const {
      name: videoName,
      videoAuthor,
      categories: videoCategories,
    } = this.newVideo;

    console.log('this.videoToEdit', this.videoToEdit);
    console.log('videoAuthor', videoAuthor);

    const authorObjExists = this.dataService.authorsData.find(
      (author) => author.name === videoAuthor
    );

    console.log('authorObjExists', authorObjExists);

    if(!this.videoToEdit && authorObjExists) {
      this.updateAuthor(authorObjExists, this.newVideo);
    } 
    else if(this.videoToEdit) {
      const authorObj = this.doesAuthorExist(
        this.videoToEdit!.id,
        this.dataService.authorsData
      );
      this.updateExistingVideo(authorObj);
    }
    else {
      this.addNewAuthor();
    }
   /*  if (this.videoToEdit) {
      authorObj = this.doesAuthorExist(
        this.videoToEdit!.id,
        this.dataService.authorsData
      );

      if (authorObj) {
        const editedVideoIndex = authorObj.videos.findIndex(
          (video) => video.id === this.videoToEdit!.id
        );

        if (editedVideoIndex !== -1) {
          // Update the existing video object
          const editedVideo: Video = {
            id: this.videoToEdit!.id,
            catIds: this.getCategoryIdsByNames(videoCategories),
            name: videoName,
            releaseDate: formattedDate,
            formats: {
              one: { res: "1080p", size: 1000 },
            },
          };

          authorObj.videos[editedVideoIndex] = editedVideo;
        }

        this.dataService.updateVideo(authorObj).subscribe(() => {
          this.getVideosList();
          this.videoToEdit = null;
        });
      }
    } else {
      // Adding a new video
      const newAuthorId = this.dataService.authorsData.length + 1;
      const maxVideoId = this.generateVideoId() + 1;
      const newVideo: Video = {
        id: maxVideoId,
        catIds: this.getCategoryIdsByNames(videoCategories),
        name: videoName,
        releaseDate: formattedDate,
        formats: {
          one: { res: "1080p", size: 1000 },
        },
      };

      const authorObj: Author = {
        id: newAuthorId,
        name: videoAuthor,
        videos: [newVideo],
      };

      this.dataService.addNewVideoToAuthorData(authorObj).subscribe(() => {
        this.getVideosList();
      });
    } */

    this.resetAddVideoForm();
  }

  //If author does not exisiting while adding the video
  addNewAuthor() {
    const newAuthorId = this.dataService.authorsData.length + 1;
      const maxVideoId = this.generateVideoId() + 1;
      const newVideo: Video = {
        id: maxVideoId,
        catIds: this.getCategoryIdsByNames(this.newVideo.categories),
        name: this.newVideo.name,
        releaseDate: this.getFormattedDate(),
        formats: {
          one: { res: "1080p", size: 1000 },
        },
      };

      const authorObj: Author = {
        id: newAuthorId,
        name: this.newVideo.videoAuthor,
        videos: [newVideo],
      };

      this.dataService.addNewVideoToAuthorData(authorObj).subscribe(() => {
        this.getVideosList();
      });
  }

  //edit the existing video
  updateExistingVideo(authorObj: Author | undefined) {

    authorObj = this.doesAuthorExist(
      this.videoToEdit!.id,
      this.dataService.authorsData
    );

    if (authorObj) {
      const editedVideoIndex = authorObj.videos.findIndex(
        (video) => video.id === this.videoToEdit!.id
      );

      if (editedVideoIndex !== -1) {
        const editedVideo: Video = {
          id: this.videoToEdit!.id,
          catIds: this.getCategoryIdsByNames(this.newVideo.categories),
          name: this.newVideo.name,
          releaseDate: authorObj.videos[editedVideoIndex].releaseDate,
          formats: {
            one: { res: "1080p", size: 1000 },
          },
        };

        authorObj.videos[editedVideoIndex] = editedVideo;
      }

      this.dataService.updateVideo(authorObj).subscribe(() => {
        this.getVideosList();
        this.videoToEdit = null;
      });
    }
  }

  //add the video if author already exists
  updateAuthor(authorObj:Author, newVideoObj: NewVideo) {
    console.log('updateAuthor', authorObj);

      const newVideo: Video = {
        id: this.generateVideoId() + 1,
        catIds: this.getCategoryIdsByNames(newVideoObj.categories),
        name: newVideoObj.name,
        releaseDate: this.getFormattedDate(),
        formats: {
          one: { res: "1080p", size: 1000 },
        },
      };

      authorObj.videos.push(newVideo);

      console.log('authorObj', authorObj);

      this.dataService.updateVideo(authorObj).subscribe(() => {
        this.getVideosList();
        //this.videoToEdit = null;
      });
  }

  getFormattedDate() {
    return new Date().toISOString().slice(0, 10);
  }

  doesAuthorExist(idToFind: number, authorsData: Author[]) {
    return authorsData.find((author) =>
      author.videos.some((video) => video.id === idToFind)
    );
  }

  generateVideoId() {
    let id = 0;
    for (const person of this.dataService?.authorsData) {
      for (const video of person.videos) {
        if (video.id > id) {
          id = video.id;
        }
      }
    }

    return id;
  }

  resetAddVideoForm() {
    // Reset the newVideo object
    this.newVideo = {
      name: "",
      videoAuthor: "",
      categories: [],
    };
    // Hide the form
    this.showAddVideoForm = false;
  }

  cancelAddVideoForm() {
    this.resetAddVideoForm();
  }

  getCategoryIdsByNames(categories: string[]): number[] {
    return categories
      .map((name) =>
        this.dataService.categoriesData.find(
          (category) => category.name === name
        )
      )
      .filter((category) => !!category)
      .map((category) => category!.id);
  }

  // Function to initiate editing a video
  editVideo(video: ProcessedVideo) {
    console.log("editVideo", video);
    // Set the videoToEdit to the selected video
    this.videoToEdit = video;

    // Populate the form fields with the selected video's data
    this.newVideo = {
      name: this.videoToEdit.name,
      videoAuthor: this.videoToEdit.author,
      categories: [...this.videoToEdit.categories],
    };
    console.log("this.newVideo", this.newVideo);
    // Show the form for editing
    this.showAddVideoForm = true;
    this.fromHeaderText = `Edit Video: ${this.newVideo.name}`;
  }
}
