import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { LayoutService } from 'src/app/layout.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  @ViewChild('complainList', { static: true }) complainList: any;
  @ViewChild('categoryName', { static: true }) categoryName: ElementRef;

  categoryForm: FormGroup;
  private categoryId: number;

  serviceTypeList = [
    { id: 1, text: 'Data' },
    { id: 2, text: 'Voice' },
    { id: 3, text: 'Both' }
  ];


  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private layoutService: LayoutService) {

    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Add Category' })

  }

  ngOnInit() {
    this.categoryForm = new FormBuilder().group({
      category: ['', Validators.compose([Validators.required])],
      serviceTypeId: ["", Validators.compose([Validators.required])],
      isEnable: [true, Validators.compose([Validators.required,])],
    });
    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params.id;

      if (this.categoryId != 0 && this.categoryId != undefined) {
        this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Edit Category' });
        this.categoryService.getCategory(this.categoryId).subscribe((x: any): any => {
          this.categoryForm.controls["category"].setValue(x.data.category);
          this.categoryForm.controls["serviceTypeId"].setValue(x.data.serviceType.id);
          this.categoryForm.controls["isEnable"].setValue(x.data.isEnable);
        });
      }
    });
    this.categoryName.nativeElement.focus();
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (valid) {
      if (!this.categoryId) {
        this.categoryService.addCategory(value.category, value.serviceTypeId, value.isEnable).subscribe(x => {
          if (x.success) {
            this.layoutService.showMessageSuccess('Category added successfully.');
            this.router.navigate(["/category-list"]);
          } else {
            this.layoutService.showMessageError(x.message);
          }
        });
      } else {

        this.categoryService.editServiceProvider(this.categoryId.toString(), value.category, value.serviceTypeId, value.isEnable).subscribe((x: any) => {
          if (x.success) {
            this.layoutService.showMessageSuccess('Category edited successfully.');
          } else {
            this.layoutService.showMessageError(x.message);
          }
          this.router.navigate(['/category-list']);
        }, (err) => {
          this.layoutService.showMessageError(err.message);
        });
      }
    } else {
      this.layoutService.showMessageError('Input(s) are not valid.');
    }
  }
}
