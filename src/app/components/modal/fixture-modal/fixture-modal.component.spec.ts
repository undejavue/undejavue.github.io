import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureModalComponent } from './fixture-modal.component';

describe('FixtureModalComponent', () => {
  let component: FixtureModalComponent;
  let fixture: ComponentFixture<FixtureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
