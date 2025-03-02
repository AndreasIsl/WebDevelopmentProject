import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewListingComponent } from './new-listing.component';

describe('NewListingComponent', () => {
  let component: NewListingComponent;
  let fixture: ComponentFixture<NewListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
