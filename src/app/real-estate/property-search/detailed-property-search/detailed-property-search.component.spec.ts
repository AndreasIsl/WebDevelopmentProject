import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPropertySearchComponent } from './detailed-property-search.component';

describe('DetailedPropertySearchComponent', () => {
  let component: DetailedPropertySearchComponent;
  let fixture: ComponentFixture<DetailedPropertySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedPropertySearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedPropertySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
