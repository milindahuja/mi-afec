import { Component, OnInit } from "@angular/core";
import { DataService } from "./services/data.service";
import { NewVideo, ProcessedVideo } from "./interfaces";

@Component({
  selector: "mi-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  fromHeaderText: string = "";
  videos: ProcessedVideo[] = [];
  showAddVideoForm = false;
  newVideo: NewVideo = {
    name: "",
    videoAuthor: "",
    categories: [],
  };

  // Create a variable to hold the video to be edited
  videoToEdit: ProcessedVideo | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getVideosList();
  }

  // Fetch the list of videos
  getVideosList() {
    this.dataService.getVideos().subscribe((videos) => {
      this.videos = videos;
    });
  }

  // Function to initiate editing a video
  editVideo(video: ProcessedVideo) {
    // Set the videoToEdit to the selected video
    this.videoToEdit = video;

    // Show the form for editing
    this.showAddVideoForm = true;
    this.fromHeaderText = `Edit Video: ${this.newVideo.name}`;
  }

  // Listen to the showAddForm event from VideosFormComponent
  handleShowAddForm(showAddForm: boolean) {
    this.showAddVideoForm = showAddForm;
  }

  addNewVideo(){
    if(this.videoToEdit) {
      this.videoToEdit = null;
    }
    this.showAddVideoForm = true; 
    this.fromHeaderText = 'Add Video';
  }
}
