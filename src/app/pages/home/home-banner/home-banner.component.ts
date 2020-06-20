import { Component, OnInit } from "@angular/core";
import { Path } from "../../../config";
import { ProductsService } from "src/app/services/products.service";
import { OwlCarouselConfig, CarouselNavigation } from "../../../funtions.js";

@Component({
  selector: "app-home-banner",
  templateUrl: "./home-banner.component.html",
  styleUrls: ["./home-banner.component.css"],
})
export class HomeBannerComponent implements OnInit {
  path: string = Path.url;
  banner_home: Array<any> = [];
  category: Array<any> = [];
  url: Array<any> = [];
  render: Boolean = true;
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
        index = Math.floor(Math.random() * (size - 5));
      }
      //selecionar data con limites
      this.productServices
        .getLimitData(Object.keys(res)[index], 5)
        .subscribe((res) => {
          let i;
          for (i in res) {
            this.banner_home.push(JSON.parse(res[i].horizontal_slider));
            this.category.push(res[i].category);
            this.url.push(res[i].url);
            this.loader = false;
          }
        });
    });
  }

  callback() {
    if (this.render) {
      this.render = false;
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
    }
  }
}
