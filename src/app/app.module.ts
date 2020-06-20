import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./modules/header/header.component";
import { HeaderPromotionComponent } from "./modules/header-promotion/header-promotion.component";
import { HeaderMobileComponent } from "./modules/header-mobile/header-mobile.component";
import { NewletterComponent } from "./modules/newletter/newletter.component";
import { FotterComponent } from "./modules/fotter/fotter.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ProductsComponent } from "./pages/products/products.component";
import { ProductComponent } from "./pages/product/product.component";
import { SearchComponent } from "./pages/search/search.component";
import { Error404Component } from "./pages/error404/error404.component";
import { HomeBannerComponent } from "./pages/home/home-banner/home-banner.component";
import { HomeServicesComponent } from "./pages/home/home-services/home-services.component";
import { HomePromotionsComponent } from "./pages/home/home-promotions/home-promotions.component";
import { HomeHotTodayComponent } from "./pages/home/home-hot-today/home-hot-today.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderPromotionComponent,
    HeaderMobileComponent,
    NewletterComponent,
    FotterComponent,
    HomeComponent,
    ProductsComponent,
    ProductComponent,
    SearchComponent,
    Error404Component,
    HomeBannerComponent,
    HomeServicesComponent,
    HomePromotionsComponent,
    HomeHotTodayComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
