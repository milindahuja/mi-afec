import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Author, ProcessedVideo } from "../interfaces";
import { DataService } from "../sevices/data.service";
import { UtilsService } from "../sevices/utils.service";

@Component({
  selector: "mi-videos-table",
  templateUrl: "./videos-table.component.html",
  styleUrls: ["./videos-table.component.css"],
})
export class VideosTableComponent implements OnInit, OnChanges {
  @Input() videos: ProcessedVideo[] = [];
  @Input() editVideo!: (video: ProcessedVideo) => void; // Function to initiate editing
  @Output() refreshVideos: EventEmitter<void> = new EventEmitter<void>();

  filteredVideos: ProcessedVideo[] = [];
  searchText: string = "";
  // Define a sorting state object for each property
  sortingState: { [key: string]: "asc" | "desc" } = {};

   // Helper function to handle the deletion process
   private handleDeleteVideo(video: ProcessedVideo) {
    const authorObj = this.utilsService.findAuthorByName(video.author, this.dataService.authorsData);
    if (authorObj) {
      const videoIndex = this.utilsService.findVideoIndex(authorObj, video.id);
      if (videoIndex !== -1) {
        // Update the API with the updated author data
        this.updateAuthorData(authorObj, videoIndex);
      }
    }
  }

  // Helper function to update author data in the API
  private updateAuthorData(authorObj: Author, videoIndex: number) {
    if(authorObj.videos.length === 1) {
      this.dataService.deleteAuthor(authorObj.id).subscribe();
    } else {
      authorObj.videos.splice(videoIndex, 1);
      this.dataService.updateVideo(authorObj).subscribe();
    }
    this.refreshVideos.emit();
  }

  // Update filteredVideos whenever the videos input property changes
  private updateFilteredVideos() {
    this.filteredVideos = this.videos;
  }

    // Initialize sorting directions for sortable columns
  private initializeSortingState() {
    this.sortingState = {
      name: "asc",
      author: "asc",
      categories: "asc",
      releaseDate: "asc",
      highestQualityFormat: "asc"
    };
  }

  constructor(private dataService: DataService, private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.updateFilteredVideos();
    this.initializeSortingState(); // Initial sorting direction
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["videos"] && !changes["videos"].firstChange) {
      // Videos input property has changed, and it's not the first change
      this.updateFilteredVideos();
    }
  }

  // Function to handle "Edit" button click
  editClicked(video: ProcessedVideo) {
    this.editVideo(video); 
  }

  // Function to sort the videos by a given property
  sortBy(property: keyof ProcessedVideo) {
    const currentSorting = this.sortingState[property] || "asc"; // Get the current sorting direction

    this.filteredVideos.sort((a, b) => {
      const valueA = this.utilsService.getPropertyValue(a, property).toLowerCase();
      const valueB = this.utilsService.getPropertyValue(b, property).toLowerCase();

      if (currentSorting === "asc") {
        return valueA.localeCompare(valueB); // Ascending order
      } else {
        return valueB.localeCompare(valueA); // Descending order
      }
    });

    // Toggle sorting direction for the property
    this.sortingState[property] = currentSorting === "asc" ? "desc" : "asc";
  }

  // Function to perform a search when the Search button is clicked
  searchVideos() {
    const searchText = this.searchText.toLowerCase();
    if (searchText.trim() === "") {
      // If the search text is empty, show all videos
      this.filteredVideos = this.videos;
    } else {
      // Filter the videos based on the search text
      const filteredVideos = this.videos.filter((video) => {
        return (
          video.name.toLowerCase().includes(searchText) ||
          video.author.toLowerCase().includes(searchText) ||
          video.categories.some((category) =>
            category.toLowerCase().includes(searchText)
          ) ||
          video.releaseDate.toLowerCase().includes(searchText) || 
          video.highestQualityFormat.toLowerCase().includes(searchText)
        );
      });

      // Update the displayed videos with the filtered results
      this.filteredVideos = filteredVideos;
    }
  }

  // show all videos when search box is empty
  showAllVideos() {
    const searchText = this.searchText.toLowerCase();
    if (searchText.trim() === "") {
      this.filteredVideos = this.videos;
    } else {
      return;
    }
  }

  deleteVideo(video: ProcessedVideo) {
    // Confirm with the user before deleting
    const confirmDelete = confirm(`Are you sure you want to delete "${video.name}"?`);
    if (confirmDelete) {
      this.handleDeleteVideo(video);
    }
  }
}
