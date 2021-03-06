import { Component, OnInit } from "@angular/core";
import { Path } from "../../config";
import { CategoriesService } from "src/app/services/categories.service";
import { SubCategoriesService } from "src/app/services/sub-categories.service";
declare var jQuery: any;
declare var $: any;
@Component({
  selector: "app-fotter",
  templateUrl: "./fotter.component.html",
  styleUrls: ["./fotter.component.css"],
})
export class FotterComponent implements OnInit {
  path: string = Path.url;
  categories: Object = null;
  sub_categories: Array<any> = [];
  render: boolean = true;
  categoriesList: Array<any> = [];
  constructor(
    private categorieService: CategoriesService,
    private subCtegoriesServices: SubCategoriesService
  ) {}

  ngOnInit() {
    this.categorieService.getData().subscribe((res) => {
      this.categories = res;
      //recorrido por el objeto de la data de categorias
      let i;
      for (i in res) {
        //separer los nombres de categroias
        this.categoriesList.push(res[i].name);
      }
    });
  }

  callback() {
    if (this.render) {
      this.render = false;
      let arraySubcategories = [];
      //separer cada item de las categoriesList
      this.categoriesList.forEach((category) => {
        this.subCtegoriesServices
          .getFilterData("category", category)
          .subscribe((res) => {
            //reccorido por la coleccionde subcategorias y clasificamos por categorias
            let i;
            for (i in res) {
              arraySubcategories.push({
                category: res[i].category,
                subcategory: res[i].name,
                url: res[i].url,
              });
            }
            //rrecorremos arraySubcategories para buscar conicidencias con los nombres de categorias
            for (i in arraySubcategories) {
              if (category == arraySubcategories[i].category) {
                $(`[category-footer="${category}"]`).after(
                  `<a href="productos/${arraySubcategories[i].url}">${arraySubcategories[i].subcategory}</a>`
                );
              }
            }
          });
      });
    }
  }
}
