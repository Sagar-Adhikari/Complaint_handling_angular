import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
  @ViewChild('complainList', { static: true }) complainList: any;
  @ViewChild('slider', { static: true }) slider: any;

  categoryData: any;
  private categoryId: number;
  isFirstPage = true;
  complainId: string = '';

  sliderClicked(event: any) {
    if (event === 'left') {
      this.isFirstPage = false
    } else {
      this.isFirstPage = true;
    }
  }

  constructor(
    public layoutService: LayoutService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router

  ) {
    this.layoutService.setLayout({ allowFooter: false, pageTitle: 'Category Details' });
    this.layoutService.setLoading(true);
  }

  ngOnInit() {
    this.categoryId = +this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.categoryService.getCategory(this.categoryId).subscribe(x => {
        if (x.success) {
          this.categoryData = x.data;
          this.complainList.loadList("category", this.categoryId);
        } else {
          this.categoryData = undefined
          this.complainList.clear();
          this.layoutService.showMessageWarning("category not found!");
        }
        this.layoutService.setLoading(false);
      });
    } else {
      this.layoutService.setLoading(false);
    }
  }

  deleteCategory() {
    this.layoutService.setLoading(true);
    this.categoryService.deleteCategory(this.categoryId).subscribe((x: any) => {
      if (x.success) {
        this.layoutService.showMessageSuccess('Category deleted successfully!');
        this.router.navigate(['/category-list']);
      } else {
        this.layoutService.showMessageError(x.message);
      }

    }, err => {
      this.layoutService.showMessageError(err.message);
    });
  }

  showComplain(id: string) {
    this.complainId = id;
    this.isFirstPage = false;
  }
}
