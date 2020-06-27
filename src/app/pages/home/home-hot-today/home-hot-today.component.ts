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
import { SalesServicesService } from "../../../services/sales.service";

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

  constructor(
    private productsService: ProductsService,
    private salesServices: SalesServicesService
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;
    let getSales = [];

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

    this.salesServices.getData().subscribe((res) => {
      let i;
      for (i in res) {
        getSales.push({
          product: res[i].product,
          quantity: res[i].quantity,
        });
      }
      //ORDENAR EL ARRY DE MAYOR A MENOR
      getSales.sort((a, b) => {
        return b.quantity - a.quantity;
      });
      //SACAMOS LOS REPETIDOS
      let filterSales = [];
      getSales.forEach((sale) => {
        if (!filterSales.find((res) => res.product == sale.product)) {
          const { product, quantity } = sale;
          filterSales.push({
            product,
            quantity,
          });
        }
      });
      let block = 0;
      //FILTAR LA DATA DE LOS PRODUCTOS QUE CONCIDAN EN LAS VENTAS PARA SACAR LOS DATOS DE EL
      filterSales.forEach((sale, index) => {
        block++;
        //SOLO MOSTRAR 20
        if (index < 20) {
          this.productsService
            .getFilterData("name", sale.product)
            .subscribe((res) => {
              let i;
              for (i in res) {
                this.topSales.push(res);
              }
            });
        }
      });
      //MOSTAR 4 PRODUCTOS POR BANNER
      for (let i = 0; i < Math.round(block / 4); i++) {
        this.topSalesBlock.push(i);
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

  callbackSeller(topSales) {
    if (this.renderBestSeller) {
      this.renderBestSeller = false;
      //CAPTURAR LA CANTIDADA DE BLOQUES QUE TIENE EL DOM
      let topSalesBlock = $(".topSalesBlock");
      let top20Array = [];

      setTimeout(() => {
        for (let i = 0; i < topSalesBlock.length; i++) {
          //AGRUPARA CON 4 PRODUCTOS
          top20Array.push(
            topSales.slice(
              i * topSalesBlock.length,
              i * topSalesBlock.length + topSalesBlock.length
            )
          );

          let f;
          for (f in top20Array[i]) {
            console.log("Categoria", top20Array[i][f].categoty);
            console.log("Imagen", top20Array[i][f].image);
            console.log("Nombre", top20Array[i][f].name);

            $(topSalesBlock[i]).append(
              `
              <div class="ps-product--horizontal">
                <div class="ps-product__thumbnail">
                  <a href="producto/${top20Array[i][f].url}">
                    <img src="assets/img/products/${top20Array[i][f].category}/${top20Array[i][f].image}"/>
                  </a>
                </div>

                <div class="ps-product__content">
                  <a class="ps-product__title" href="producto/${top20Array[i][f].url}"
                    >${top20Array[i][f].name}</a
                  >

                  <div class="ps-product__rating">
                    <select class="ps-rating" data-read-only="true">
                      <option value="1">1</option>
                      <option value="1">2</option>
                      <option value="1">3</option>
                      <option value="1">4</option>
                      <option value="2">5</option>
                    </select>

                    <span>01</span>
                  </div>

                  <p class="ps-product__price">105.30</p>
                </div>
              </div>
              `
            );
          }
        }
      }, topSalesBlock.length * 1000);
    }
    OwlCarouselConfig.fnc();
    CarouselNavigation.fnc();
    //SlickConfig.fnc();
    ProductLightbox.fnc();
    CountDown.fnc();
  }
}
