import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Author, NewVideo, ProcessedVideo, Video } from "./../interfaces";
import { DataService } from "../data.service";

@Component({
  selector: "app-video-form",
  templateUrl: "./videos-form.component.html",
  styleUrls: ["./videos-form.component.css"],
})
export class VideosFormComponent implements OnInit{
  @Input() videoToEdit!: ProcessedVideo | null;
  @Output() formSubmission: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshVideos: EventEmitter<void> = new EventEmitter<void>();
  @Output() showAddForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  videoForm: FormGroup;
  fromHeaderText: string = "";
  showAddVideoForm = false;
  newVideo: NewVideo = {
    name: "",
    videoAuthor: "",
    categories: [],
  };
  authorOptions: string[] = [
    "David Munch",
    "Li Sun Chi",
    "Steven Scorsese",
    "Milind Ahuja",
  ];

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.videoForm = this.formBuilder.group({
      name: ["", Validators.required],
      videoAuthor: ["", Validators.required],
      categories: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    // Populate the form fields with the selected video's data
    if(this.videoToEdit) {
      this.newVideo = {
        name: this.videoToEdit.name,
        videoAuthor: this.videoToEdit.author,
        categories: [...this.videoToEdit.categories],
      };
    }
  }

  // Get the current date in a formatted string
  private getFormattedDate() {
    return new Date().toISOString().slice(0, 10);
  }

  // Check if an author exists for a given video ID
  private doesAuthorExist(idToFind: number, authorsData: Author[]) {
    return authorsData.find((author) =>
      author.videos.some((video) => video.id === idToFind)
    );
  }

  // Generate a unique video ID based on existing data
  private generateVideoId() {
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

  // Get category IDs by names
  private getCategoryIdsByNames(categories: string[]): number[] {
    return categories
      .map((name) =>
        this.dataService.categoriesData.find(
          (category) => category.name === name
        )
      )
      .filter((category) => !!category)
      .map((category) => category!.id);
  }

  onSubmit() {
    this.formSubmission.emit(this.newVideo);
    this.resetAddVideoForm();
  }

  // Handle adding or editing a video
  handleVideo() {
    const {
      name: videoName,
      videoAuthor,
      categories: videoCategories,
    } = this.newVideo;

    // Check if the video author exists
    const authorObjExists = this.dataService.authorsData.find(
      (author) => author.name === videoAuthor
    );

    if (!this.videoToEdit && authorObjExists) {
      this.updateAuthor(authorObjExists, this.newVideo);
    } else if (this.videoToEdit) {
      const authorObj = this.doesAuthorExist(
        this.videoToEdit!.id,
        this.dataService.authorsData
      );
      this.updateExistingVideo(authorObj);
    } else {
      this.addNewAuthor();
    }
    this.resetAddVideoForm();
  }

  // Add a new author, if not already exists
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
      // Show a success message to the user
      alert(`"${newVideo.name}" added successfully!`);
      //this.refreshVideos.emit();
    });
  }

  // Edit an existing video
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
        this.videoToEdit = null;
      });
    }
  }

  // Update an existing author with a new video
  updateAuthor(authorObj: Author, newVideoObj: NewVideo) {
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

    this.dataService.updateVideo(authorObj).subscribe();
  }

  cancelAddVideoForm() {
    this.resetAddVideoForm();
  }

  // Reset the video form and hide it
  resetAddVideoForm() {
    this.newVideo = {
      name: "",
      videoAuthor: "",
      categories: [],
    };
    this.showAddForm.emit(this.showAddVideoForm);
    this.fromHeaderText = "";
    // Refresh the list of videos
    this.refreshVideos.emit();
  }
}
