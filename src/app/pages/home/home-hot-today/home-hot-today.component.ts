import { Component, OnInit } from "@angular/core";
import { Path } from "../../../config";
import {
  OwlCarouselConfig,
  CarouselNavigation,
  SlickConfig,
  ProductLightbox,
  CountDown,
} from "../../../funtions.js";

import { ProductsService } from "../../../services/products.service";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-home-hot-today",
  templateUrl: "./home-hot-today.component.html",
  styleUrls: ["./home-hot-today.component.css"],
})
export class HomeHotTodayComponent implements OnInit {
  path: String = Path.url;
  indexes: Array<any> = [];
  products: Array<any> = [];
  render: Boolean = true;
  cargando: Boolean = false;
  topSales: Array<any> = [];
  topSalesBlock: Array<any> = [];
  renderBestSeller: Boolean = true;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.cargando = true;

    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;

    this.productsService.getData().subscribe((resp) => {
      let i;
      for (i in resp) {
        getProducts.push({
          offer: JSON.parse(resp[i].offer),
          stock: resp[i].stock,
        });

        this.products.push(resp[i]);
      }

      //Recorremos cada oferta y stock para clasificar las ofertas actuales y los productos que si tengan stock

      for (i in getProducts) {
        fechaOferta = new Date(
          parseInt(getProducts[i]["offer"][2].split("-")[0]),
          parseInt(getProducts[i]["offer"][2].split("-")[1]) - 1,
          parseInt(getProducts[i]["offer"][2].split("-")[2])
        );

        if (hoy < fechaOferta && getProducts[i]["stock"] > 0) {
          this.indexes.push(i);
          this.cargando = false;
        }
      }
    });
  }

  /*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

  callback() {
    if (this.render) {
      this.render = false;

      /*=============================================
			Seleccionar del DOM los elementos de la galería mixta
			=============================================*/

      let galleryMix_1 = $(".galleryMix_1");
      let galleryMix_2 = $(".galleryMix_2");
      let galleryMix_3 = $(".galleryMix_3");

      /*=============================================
			Seleccionar del DOM los elementos de la oferta
			=============================================*/

      let offer_1 = $(".offer_1");
      let offer_2 = $(".offer_2");
      let offer_3 = $(".offer_3");

      /*=============================================
			Recorremos todos los índices de productos
			=============================================*/

      for (let i = 0; i < galleryMix_1.length; i++) {
        /*=============================================
				Recorremos todos las fotografías de la galería de cada producto
				=============================================*/
        for (
          let f = 0;
          f < JSON.parse($(galleryMix_1[i]).attr("gallery")).length;
          f++
        ) {
          /*=============================================
					Agregar imágenes grandes
					=============================================*/

          $(galleryMix_2[i]).append(
            `
              <div class="item">
								<a href="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${
              JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]
            }">
                  <img src="assets/img/products/${$(galleryMix_1[i]).attr(
                    "category"
                  )}/gallery/${
              JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]
            }"></a>
              </div>`
          );

          /*=============================================
					Agregar imágenes pequeñas
					=============================================*/

          $(galleryMix_3[i]).append(
            `<div class="item">
                <img src="assets/img/products/${$(galleryMix_1[i]).attr(
                  "category"
                )}/gallery/${
              JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]
            }">
              </div>
            `
          );
        }

        /*=============================================
				Capturamos el array de ofertas de cada producto
				=============================================*/

        let offer = JSON.parse($(offer_1[i]).attr("offer"));

        /*=============================================
				Capturamos el precio de cada producto
				=============================================*/

        let price = Number($(offer_1[i]).attr("price"));

        /*=============================================
				Preguntamos si es descuento
				=============================================*/

        if (offer[0] == "Disccount") {
          $(offer_1[i]).html(
            `<span>Ahorras <br> $${((price * offer[1]) / 100).toFixed(
              2
            )}</span>`
          );

          $(offer_2[i]).html(
            `$${(price - (price * offer[1]) / 100).toFixed(2)}`
          );
        }

        /*=============================================
				Preguntamos si es precio fijo
				=============================================*/

        if (offer[0] == "Fixed") {
          $(offer_1[i]).html(
            `<span>Ahorras <br> $${(price - offer[1]).toFixed(2)}</span>`
          );

          $(offer_2[i]).html(`$${offer[1]}`);
        }

        /*=============================================
				Agregamos la fecha al descontador
				=============================================*/

        $(offer_3[i]).attr(
          "data-time",
          new Date(
            parseInt(offer[2].split("-")[0]),
            parseInt(offer[2].split("-")[1]) - 1,
            parseInt(offer[2].split("-")[2])
          )
        );
      }
    }
    OwlCarouselConfig.fnc();
    CarouselNavigation.fnc();
    //SlickConfig.fnc();
    ProductLightbox.fnc();
    CountDown.fnc();
  }
}
