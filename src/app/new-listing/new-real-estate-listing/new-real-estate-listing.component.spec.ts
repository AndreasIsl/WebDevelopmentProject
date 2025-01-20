import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRealEstateListingComponent } from './new-real-estate-listing.component';

describe('NewRealEstateListingComponent', () => {
  let component: NewRealEstateListingComponent;
  let fixture: ComponentFixture<NewRealEstateListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRealEstateListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRealEstateListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
