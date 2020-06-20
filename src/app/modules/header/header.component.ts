import { Component, OnInit } from "@angular/core";
import { Path } from "../../config";
import { CategoriesService } from "src/app/services/categories.service";
import { SubCategoriesService } from "src/app/services/sub-categories.service";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  path: string = Path.url;
  categories: Object = null;
  sub_categories: Array<any> = [];
  state_callback: Boolean = true;

  constructor(
    private categorieService: CategoriesService,
    private subCtegoriesServices: SubCategoriesService
  ) {}

  ngOnInit() {
    this.categorieService.getData().subscribe((res) => {
      //console.log(res);
      this.categories = res;
      //SUB CATEGORIAS
      let i;
      for (i in res) {
        //console.log(res[i].title_list);
        this.sub_categories.push(JSON.parse(res[i].title_list));
        //console.log(this.sub_categories);
      }
    });
  }

  //funcion que se dispara cuando se renderizan las categorias
  callback() {
    if (this.state_callback) {
      this.state_callback = false;
      let array_subcategorias = [];

      this.sub_categories.forEach((titleList) => {
        //console.log(titleList);
        ///SEPARAR LOS TITULOS
        for (let i = 0; i < titleList.length; i++) {
          //console.log(titleList[i]);
          //collection de sub categorias  filtrado con la lista de titulos
          this.subCtegoriesServices
            .getFilterData("title_list", titleList[i])
            .subscribe((res) => {
              //console.log(res);
              array_subcategorias.push(res);
              //recorrer la coleccion de general subcategorias
              let f;
              let g;
              let arrayTitleName = [];
              for (f in array_subcategorias) {
                //console.log(array_subcategorias[f]);
                for (g in array_subcategorias[f]) {
                  arrayTitleName.push({
                    titleList: array_subcategorias[f][g].title_list,
                    subcategory: array_subcategorias[f][g].name,
                    url: array_subcategorias[f][g].url,
                  });
                }
              }

              //recorre el array de objetos nuevos para buscar coincidencias
              for (f in arrayTitleName) {
                if (titleList[i] == arrayTitleName[f].titleList) {
                  //imprimir en la el nombre de subcategoria debajo del listado que es
                  // console.log("subcategory ", arrayTitleName[f].subcategory);
                  // console.log("titleList ", titleList[i]);

                  $(`[titleList='${titleList[i]}']`).append(`
                    <li>
                      <a href="products/${arrayTitleName[f].url}">${arrayTitleName[f].subcategory}</a>
                    </li>
                  `);
                }
              }
            });
        }
      });
    }
  }
}
