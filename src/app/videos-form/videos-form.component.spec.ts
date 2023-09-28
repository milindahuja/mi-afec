import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideosFormComponent } from './videos-form.component';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';
import { of } from 'rxjs';
import { Author, NewVideo, ProcessedVideo, Video } from '../interfaces';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '../button/button.component';

describe('VideosFormComponent', () => {
  let component: VideosFormComponent;
  let fixture: ComponentFixture<VideosFormComponent>;
  let dataService: DataService;
  let utilsService: UtilsService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [VideosFormComponent, ButtonComponent],
      imports: [ReactiveFormsModule, HttpClientModule, FormsModule],
      providers: [DataService, UtilsService, FormBuilder],
    });

    fixture = TestBed.createComponent(VideosFormComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    utilsService = TestBed.inject(UtilsService);
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form on initialization', () => {
    expect(component.videoForm.value).toEqual({ name: '', videoAuthor: '', categories: [] });
  });

  it('should handleVideo for editing an existing video', () => {
    const existingAuthor: Author = {
      id: 1,
      name: 'Existing Author',
      videos: [
        {
          id: 1,
          name: 'Existing Video',
          catIds: [1],
          releaseDate: '2023-01-01',
          formats: {
            one: { res: '720p', size: 500 },
          },
        },
      ],
    };

    const editedVideo: ProcessedVideo = {
      id: 1,
      name: 'Edited Video',
      author: 'Existing Author',
      categories: ['Category 2'],
      highestQualityFormat: '1080p',
      releaseDate: '2023-02-01',
    };

    spyOn(dataService, 'updateVideo').and.returnValue(of(null));
    spyOn(utilsService, 'findAuthorByVideoId').and.returnValue(existingAuthor);
    spyOn(utilsService, 'findAuthorByName').and.returnValue(existingAuthor);

    component.videoToEdit = editedVideo;
    component.newVideo = {
      name: 'Edited Video',
      videoAuthor: 'Existing Author',
      categories: ['Category 2'],
    };
    component.handleVideo();

    expect(dataService.updateVideo).toHaveBeenCalledWith(existingAuthor);
    expect(dataService.updateVideo).toHaveBeenCalledTimes(1);

    // Verify if the form is reset
    expect(component.newVideo).toEqual({ name: '', videoAuthor: '', categories: [] });
  });

  it('should cancelAddVideoForm and reset the form', () => {
    component.newVideo = {
      name: 'New Video',
      videoAuthor: 'New Author',
      categories: ['Category 1'],
    };
    component.cancelAddVideoForm();
    expect(component.newVideo).toEqual({ name: '', videoAuthor: '', categories: [] });
  });
});
