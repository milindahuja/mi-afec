import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideosTableComponent } from './videos-table.component';
import { ProcessedVideo } from '../interfaces';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('VideosTableComponent', () => {
  let component: VideosTableComponent;
  let fixture: ComponentFixture<VideosTableComponent>;
  let dataService: DataService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [VideosTableComponent],
      providers: [DataService, UtilsService],
      imports: [HttpClientModule, FormsModule]
    });

    fixture = TestBed.createComponent(VideosTableComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    utilsService = TestBed.inject(UtilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sorting state', () => {
    const expectedSortingState = {
      name: 'asc',
      author: 'asc',
      categories: 'asc',
      releaseDate: 'asc',
      highestQualityFormat: 'asc',
    };
    
    // Check individual properties of the sortingState object
    expect(component.sortingState['name']).toEqual(expectedSortingState.name);
    expect(component.sortingState['author']).toEqual(expectedSortingState.author);
    expect(component.sortingState['categories']).toEqual(expectedSortingState.categories);
    expect(component.sortingState['releaseDate']).toEqual(expectedSortingState.releaseDate);
    expect(component.sortingState['highestQualityFormat']).toEqual(expectedSortingState.highestQualityFormat);
  });
  

  it('should update filteredVideos when videos change', () => {
    const videos: ProcessedVideo[] = [
      {
        id: 1,
        name: 'Video 1',
        author: 'Author 1',
        categories: ['Category 1'],
        highestQualityFormat: '1080p',
        releaseDate: '2023-01-01',
      },
      {
        id: 2,
        name: 'Video 2',
        author: 'Author 2',
        categories: ['Category 2'],
        highestQualityFormat: '720p',
        releaseDate: '2023-02-01',
      },
    ];

    component.videos = videos;
    component.ngOnChanges({
      videos: {
        currentValue: videos,
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.filteredVideos).toEqual(videos);
  });

  it('should filter videos based on search text', () => {
    // Arrange
    component.videos = [
      {
        id:1,
        name: 'Video 1',
        author: 'Author 1',
        categories: ['Category 1'],
        releaseDate: '2023-01-01',
        highestQualityFormat: '1080p',
      },
      {
        id:2,
        name: 'Video 2',
        author: 'Author 2',
        categories: ['Category 2'],
        releaseDate: '2023-02-01',
        highestQualityFormat: '720p',
      },
    ];

    component.searchText = 'Video 1'; // Set the search text to 'Video 1'

    // Act
    component.searchVideos(); // Call the searchVideos method

    // Assert
    expect(component.filteredVideos.length).toEqual(1); // Expect one video to remain in the filtered list
    expect(component.filteredVideos[0].name).toEqual('Video 1'); // Expect the filtered video to be 'Video 1'
  });

  it('should call editVideo with the correct video when editClicked is called', () => {
    // Arrange
    const sampleVideo: ProcessedVideo = {
      id: 1,
      name: 'Sample Video',
      author: 'Sample Author',
      categories: ['Category 1', 'Category 2'],
      releaseDate: '2023-01-01',
      highestQualityFormat: '1080p',
    };

    // Act
    component.editClicked(sampleVideo); // Call the editClicked method

    // Assert
    expect(component.editVideo).toHaveBeenCalledWith(sampleVideo); // Verify that editVideo was called with the sample video
  });

  it('should show all videos when searchText is empty', () => {
    // Arrange
    component.videos = [
      {
        id: 1,
        name: 'Video 1',
        author: 'Author 1',
        categories: ['Category 1'],
        releaseDate: '2023-01-01',
        highestQualityFormat: '1080p',
      },
      {
        id: 2,
        name: 'Video 2',
        author: 'Author 2',
        categories: ['Category 2'],
        releaseDate: '2023-02-01',
        highestQualityFormat: '720p',
      },
    ];

    // Set searchText to an empty string
    component.searchText = '';

    // Act
    component.showAllVideos();

    // Assert
    expect(component.filteredVideos).toEqual(component.videos); // Verify that filteredVideos contains all videos
  });

});
