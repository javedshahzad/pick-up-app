import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera/ngx';
import {
  ActionSheetController,
  NavController
} from '@ionic/angular';
import {
  ApiService
} from 'src/app/services/api.service';
import {
  NetworkService
} from 'src/app/services/network.service';
import {
  StorageService
} from 'src/app/services/storage.service';
import {
  UtilsService
} from 'src/app/services/utils.service';


@Component({
  selector: 'app-note-save',
  templateUrl: './note-save.page.html',
  styleUrls: ['./note-save.page.scss'],
})
export class NoteSavePage implements OnInit {
  files: any = '';
  ImageURl: any = '';
  GetNotesVehicle: any;
  vehicleDetails: any;
  notes: any;
  base64Image: any = '';
  deletePicsArray: any = [];
  notesSaveOffline: any = [];
  ifalreadyHave: any = [];
  ImageUploadedSuccess: any;
  constructor(
      private api: ApiService,
      private util: UtilsService,
      private active: ActivatedRoute,
      private nav: NavController,
      private actionSheetCtrl: ActionSheetController,
      private camera: Camera,
      private network: NetworkService,
      private storage: StorageService

  ) {
      this.active.queryParams.subscribe((res: any) => {
          this.vehicleDetails = res.vehicleDetails;
          if (this.network.isConnctedNetwork) {
              this.getvehicleNotes(this.vehicleDetails.vehicle_id);
          } else {
              this.GetNotesVehicle = res.GetNotesVehicle;
              this.notes = this.GetNotesVehicle?.note;
          }
      })
  }

  ngOnInit() {}
  getvehicleNotes(id) {
      this.api.getNotes(id).subscribe((res: any) => {
          this.GetNotesVehicle = res;
          this.notes = this.GetNotesVehicle?.note;
      })
  }
  showPreviewImage(event: any) {
      this.files = event.target.files[0];
      if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
              this.ImageURl = event.target.result;

          }
          reader.readAsDataURL(event.target.files[0]);
      }

  }
  async presentActionSheet() {
      let actionSheet = await this.actionSheetCtrl.create({
          header: "Select Image source",
          mode: "ios",
          buttons: [{
                  text: 'Camera',
                  icon: "camera",
                  handler: () => {
                      this.takePhoto(this.camera.PictureSourceType.CAMERA);
                  }
              },
              {
                  text: 'Gallery',
                  icon: "images",
                  handler: () => {
                      this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
                  }
              },
              {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {}
              }
          ]
      });

      await actionSheet.present();
  }
  takePhoto(sourceType) {
      const options: CameraOptions = {
          quality: 80,
          targetWidth: 1000,
          targetHeight: 1000,
          sourceType: sourceType,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
          this.base64Image = "data:image/jpeg;base64," + imageData;

      }, (err) => {
          // Handle error
      });
  }
  async saveNotes() {
      this.network.watchNetwork();

      if (this.base64Image) {
          if (this.network.isConnctedNetwork && this.network.checkNetworkType() === 'wifi' || this.network.checkNetworkType() === '4g') {
              //set note picture
              this.ImageUploadedSuccess = await this.util.uploadFile(this.base64Image, 'set-note-pictures.php', this.vehicleDetails.vehicle_id);
              // set notes 
              let data = {
                  "note": this.notes,
                  "pictures_to_delete": this.deletePicsArray
              }
              var stringify = JSON.stringify(data);
              this.api.SetNote(this.vehicleDetails.vehicle_id, stringify).subscribe((res: any) => {});
              if (this.ImageUploadedSuccess) {
                  this.getvehicleNotes(this.vehicleDetails.vehicle_id);
                  this.base64Image = "";
                  this.api.isupdateData.next(true);
              }
          } else {
              this.storage.getObject('notesData').then((res) => {
                  this.ifalreadyHave = res ? res : [];
              })
              if (this.ifalreadyHave.length > 0) {
                  this.notesSaveOffline = this.ifalreadyHave
              }
              let damageData = {
                  "note": this.notes ? this.notes : "",
                  "base64Image": this.base64Image ? this.base64Image : "",
                  "vehicle_id": this.vehicleDetails.vehicle_id,
                  "pictures_to_delete": this.deletePicsArray ? this.deletePicsArray : "",
              }

              this.notesSaveOffline.push(damageData);
              this.storage.setObject('notesData', this.notesSaveOffline).then((res) => {
                  //saved
              });
              this.util.toast("Your data has been saved");

          }
      } else {
          this.util.toast("Please upload picture");
      }

  }
  deletePics(item) {
      var filename = item.split('.').slice(0, -1).join('.')
      document.getElementById(item).remove();
      this.deletePicsArray.push(filename);
  }
  gotoNote(item) {
      this.nav.navigateForward("/note", {
          queryParams: {
              data: item
          }
      });
  }

}