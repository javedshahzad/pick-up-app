import {
  Injectable
} from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController
} from '@ionic/angular';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import {
  environment
} from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  base64Image: any;
  userData: any;
  public baseUrl = environment.BaseUrl;
  constructor(
      private loadingCtrl: LoadingController,
      private toastr: ToastController,
      private transfer: FileTransfer,
      private nav: NavController,
  ) {}
  async toast(message) {
      const toast = await this.toastr.create({
          message: message,
          color: 'secondary',
          duration: 3000,
          mode: "ios",
      });
      toast.present();
      //end of toast
  }
  showLoader() {
      this.loadingCtrl.create({
          message: 'Please wait...',
          spinner: "lines-sharp",
          duration: 5000,
          mode: "ios"
      }).then((res) => {
          res.present();
      });

  }
  hideLoader() {
      this.loadingCtrl.dismiss().then((res) => {
        
      }).catch((error) => {
      });
  }
  async uploadFile(base64Image, url, vehcileId) {
      const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
          spinner: "lines-sharp",
          mode: "ios"
      });
      await loading.present();
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.base64Image = base64Image;
      const fileTransfer: FileTransferObject = this.transfer.create();

      let filename = Date.now();
      let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: filename + '-file.jpg',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
      }
      fileTransfer.upload(this.base64Image, this.baseUrl + url + "?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId, options)
          .then((data) => {
             
              this.toast("Your data has been saved");
              loading.dismiss();
              return true;
          }, (err) => {
       
              this.toast("Error while uploading");
              return false;
          });
  }
  async uploadFileFordamagae(base64Image, url, vehcileId, note, damage) {
      const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
          spinner: "lines-sharp",
          mode: "ios"
      });
      await loading.present();
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.base64Image = base64Image;
      const fileTransfer: FileTransferObject = this.transfer.create();

      let filename = Date.now();
      let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: filename + '-file.jpg',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
          params: {
              "damage": damage ? damage : "",
              "comment": note ? note : ""
          }
      }
      fileTransfer.upload(this.base64Image, this.baseUrl + url + "?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId, options)
          .then((data) => {
              this.toast("Your data has been saved");
              loading.dismiss();
              return true;
          }, (err) => {
   
              this.toast("Error while uploading");
              return false;
          });
  }

  goBack() {
      this.nav.back();
  }
}