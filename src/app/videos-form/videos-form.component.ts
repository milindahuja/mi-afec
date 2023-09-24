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

  private findAuthorByName(authorName: string): Author | undefined {
    return this.dataService.authorsData.find((author) => author.name === authorName);
  }

  // Add a new author, if not already exists
  private updateAuthorOrAddNew(author: Author | undefined, name: string, categories: string[]) {
    if (!author) {
      const newAuthorId = this.dataService.authorsData.length + 1;
      author = {
        id: newAuthorId,
        name,
        videos: [],
      };
      this.dataService.authorsData.push(author);
    }
  
    const maxVideoId = this.generateVideoId() + 1;
    const newVideo: Video = {
      id: maxVideoId,
      catIds: this.getCategoryIdsByNames(categories),
      name,
      releaseDate: this.getFormattedDate(),
      formats: {
        one: { res: "1080p", size: 1000 },
      },
    };
  
    author.videos.push(newVideo);
  
    this.dataService.updateVideo(author).subscribe(() => {
     this.showSuccessMessage(`"${newVideo.name}" added successfully!`);
    });
  }

  //edit video
  private updateExistingVideo(authorToUpdate: Author | undefined, name: string, categories: string[]) {
    if (authorToUpdate) {
      const editedVideoIndex = authorToUpdate.videos.findIndex(
        (video) => video.id === this.videoToEdit!.id
      );
  
      if (editedVideoIndex !== -1) {
        const editedVideo: Video = {
          id: this.videoToEdit!.id,
          catIds: this.getCategoryIdsByNames(categories),
          name,
          releaseDate: authorToUpdate.videos[editedVideoIndex].releaseDate,
          formats: {
            one: { res: "1080p", size: 1000 },
          },
        };
  
        authorToUpdate.videos[editedVideoIndex] = editedVideo;
      }
  
      this.dataService.updateVideo(authorToUpdate).subscribe(() => {
        this.videoToEdit = null;
        this.showSuccessMessage(`"${name}" updated successfully!`);
      });
    }
  }
  
  // add new video with new Author
  private addNewAuthor(name: string, videoAuthor: string, categories: string[]) {
    const newAuthorId = this.dataService.authorsData.length + 1;
    const maxVideoId = this.generateVideoId() + 1;
    const newVideo: Video = {
      id: maxVideoId,
      catIds: this.getCategoryIdsByNames(categories),
      name,
      releaseDate: this.getFormattedDate(),
      formats: {
        one: { res: "1080p", size: 1000 },
      },
    };
  
    const author: Author = {
      id: newAuthorId,
      name: videoAuthor,
      videos: [newVideo],
    };
  
    this.dataService.addNewVideoToAuthorData(author).subscribe(() => {
      this.showSuccessMessage(`"${newVideo.name}" added successfully!`);
    });
  }
  
  private showSuccessMessage(message: string) {
    alert(message);
  }

  private findAuthorById(authorId: number): Author | undefined {
    return this.dataService.authorsData.find((author) =>
      author.videos.some((video) => video.id === authorId)
    );
  }

  onSubmit() {
    this.formSubmission.emit(this.newVideo);
    this.resetAddVideoForm();
  }

  // Handle adding or editing a video
  handleVideo() {
    const { name, videoAuthor, categories } = this.newVideo;
  
    const authorExists = this.findAuthorByName(videoAuthor);
  
    if (!this.videoToEdit && authorExists) {
      this.updateAuthorOrAddNew(authorExists, name, categories);
    } else if (this.videoToEdit) {
      const authorToUpdate = this.findAuthorById(this.videoToEdit!.id);
      this.updateExistingVideo(authorToUpdate, name, categories);
    } else {
      this.addNewAuthor(name, videoAuthor, categories);
    }
  
    this.resetAddVideoForm();
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
