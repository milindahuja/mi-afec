import { Component, Input, OnInit } from "@angular/core";
import { ProcessedVideo } from "../interfaces";

@Component({
  selector: "mi-videos-table",
  templateUrl: "./videos-table.component.html",
  styleUrls: ["./videos-table.component.css"],
})
export class VideosTableComponent implements OnInit {
  @Input() videos: ProcessedVideo[] = [];
  filteredVideos: ProcessedVideo[] = [];
  searchText: string = "";
  // Define a sorting state object for each property
  sortingState: { [key: string]: "asc" | "desc" } = {};

  
  ngOnInit(): void {
    this.filteredVideos = this.videos;

    // Initial sorting direction
    this.initializeSortingState();
  }

  private initializeSortingState() {
    // Initialize sorting directions for sortable columns
    this.sortingState = {
      name: 'asc',
      author: 'asc',
      categories: 'asc',
      releaseDate: 'asc',
    };
  }

  // Function to sort the videos by a given property
  sortBy(property: keyof ProcessedVideo) {
    const currentSorting = this.sortingState[property] || "asc"; // Get the current sorting direction

    this.filteredVideos.sort((a, b) => {
      const valueA = this.getPropertyValue(a, property).toLowerCase();
      const valueB = this.getPropertyValue(b, property).toLowerCase();

      if (currentSorting === "asc") {
        return valueA.localeCompare(valueB); // Ascending order
      } else {
        return valueB.localeCompare(valueA); // Descending order
      }
    });

    // Toggle sorting direction for the property
    this.sortingState[property] = currentSorting === "asc" ? "desc" : "asc";
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
      return ""; // Handle other types as needed
    }
  }


  // Function to perform a search when the Search button is clicked
  searchVideos() {
    // Convert the search text to lowercase for case-insensitive search
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
          )
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
      // If the search text is empty, show all videos
      this.filteredVideos = this.videos;
    } else {
      return;
    }
  }
}
