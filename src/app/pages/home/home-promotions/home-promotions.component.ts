import { Component, OnInit } from "@angular/core";
import { Path } from "../../../config";
import { ProductsService } from "src/app/services/products.service";
@Component({
  selector: "app-home-promotions",
  templateUrl: "./home-promotions.component.html",
  styleUrls: ["./home-promotions.component.css"],
})
export class HomePromotionsComponent implements OnInit {
  path: string = Path.url;
  banner_default: Array<any> = [];
  category: Array<any> = [];
  url: Array<any> = [];
  loader: Boolean = false;

  constructor(private productServices: ProductsService) {}

  ngOnInit() {
    this.loader = true;
    let index = 0;
    this.productServices.getData().subscribe((res) => {
      let i;
      let size = 0;
      for (i in res) {
        size++;
      }

      if (size > 5) {
        index = Math.floor(Math.random() * (size - 2));
      }
      //selecionar data con limites
      this.productServices
        .getLimitData(Object.keys(res)[index], 2)
        .subscribe((res) => {
          let i;
          for (i in res) {
            this.banner_default.push(res[i].default_banner);
            this.category.push(res[i].category);
            this.url.push(res[i].url);
            this.loader = false;
          }
        });
    });
  }
}
