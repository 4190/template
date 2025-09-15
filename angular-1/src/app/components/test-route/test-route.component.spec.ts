import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRoute } from './test-route';

describe('TestRoute', () => {
  let component: TestRoute;
  let fixture: ComponentFixture<TestRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
