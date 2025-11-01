import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDataTableComponent } from './app-data-table.component';



describe('AppDataTableComponent', () => {
  let component: AppDataTableComponent;
  let fixture: ComponentFixture<AppDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
