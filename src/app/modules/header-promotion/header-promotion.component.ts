import { Component, OnInit } from "@angular/core";
import { Path } from "../../config";
import { ProductsService } from "../../services/products.service";

@Component({
  selector: "app-header-promotion",
  templateUrl: "./header-promotion.component.html",
  styleUrls: ["./header-promotion.component.css"],
})
export class HeaderPromotionComponent implements OnInit {
  path: string = Path.url;
  top_banner: Object = null;
  loader: Boolean = false;
  caterory: Object = null;
  url: Object = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loader = true;
    this.productsService.getData().subscribe((resp) => {
      //console.log("resp ", resp);
      let i;
      let size = 0;
      for (i in resp) {
        size++;
      }
      let index = Math.floor(Math.random() * size);
      //console.log("size ", size);
      //MOSTAR BANNER ALEATOREO
      this.top_banner = JSON.parse(resp[Object.keys(resp)[index]].top_banner);
      this.caterory = resp[Object.keys(resp)[index]].category;
      this.url = resp[Object.keys(resp)[index]].url;
      this.loader = false;
    });
  }
}
