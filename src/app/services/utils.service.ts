import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingCtrl:LoadingController,
    private toastr:ToastController
  ) { }
  async toast(message){
    const  toast = await this.toastr.create({
    message:message,
    color:'secondary',
    duration:3000,
    mode:"ios",
    });
    toast.present();
  //end of toast
  }
  showLoader() {
    this.loadingCtrl.create({
      message: 'Please wait...',
      spinner:"lines-sharp",
      duration:5000,
      mode:"ios"
    }).then((res) => {
      res.present();
    });

  }
  hideLoader() {
    this.loadingCtrl.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }

}
