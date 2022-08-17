import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      ReactiveFormsModule,
    ],
  providers: [
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    Network,
    { provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
