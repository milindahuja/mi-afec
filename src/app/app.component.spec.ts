import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProcessedVideo } from './interfaces';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should initialize properties correctly', () => {
    expect(app.fromHeaderText).toEqual('');
    expect(app.videos).toEqual([]);
    expect(app.showAddVideoForm).toBeFalse();
    expect(app.newVideo).toEqual({ name: '', videoAuthor: '', categories: [] });
    expect(app.videoToEdit).toBeNull();
  });

  it('should call getVideosList on ngOnInit', () => {
    spyOn(app, 'getVideosList');
    app.ngOnInit();
    expect(app.getVideosList).toHaveBeenCalled();
  });

  it('should set videoToEdit and showAddVideoForm when editVideo is called', () => {
  const videoToEdit: ProcessedVideo = {
    id: 1,
    name: 'Video 1',
    author: 'Author 1',
    categories: ['Category 1'],
    highestQualityFormat: 'Format 1',
    releaseDate: '2023-09-28',
  };

  // Call the editVideo function with the test video
  app.editVideo(videoToEdit);

  // Assert that videoToEdit is set
  expect(app.videoToEdit).toEqual(videoToEdit);

  // Assert that fromHeaderText is set correctly
  expect(app.fromHeaderText).toEqual(`Edit Video: ${videoToEdit.name}`);
});


  it('should set showAddVideoForm and reset videoToEdit when addNewVideo is called', () => {
    const videoToEdit = { id: 1, name: 'Video 1', author: 'Author 1', categories: [], highestQualityFormat: '', releaseDate: '' };
    app.videoToEdit = videoToEdit;
    app.addNewVideo();
    expect(app.showAddVideoForm).toBeTrue();
    expect(app.fromHeaderText).toEqual('Add Video');
    expect(app.videoToEdit).toBeNull();
  });
});
