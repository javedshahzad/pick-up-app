import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  LoadingController,
  NavController
} from '@ionic/angular';
import {
  ApiService
} from 'src/app/services/api.service';
import {
  NetworkService
} from 'src/app/services/network.service';
import {
  UtilsService
} from 'src/app/services/utils.service';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import {
  environment
} from 'src/environments/environment.prod';
import {
  StorageService
} from 'src/app/services/storage.service';

@Component({
  selector: 'app-pendings',
  templateUrl: './pendings.page.html',
  styleUrls: ['./pendings.page.scss'],
})
export class PendingsPage implements OnInit {
  DamageData: any = [];
  NotesData: any = [];
  userData: any;
  base64Image: any;
  public baseUrl = environment.BaseUrl;
  damageIndex: any = 0;
  damageLength: any = 0;
  damageChecks: any = 1;
  damagaSyncData: any = '';

  NotesIndex: any = 0;
  NotesLength: any = 0;
  NotesChecks: any = 1;
  NotesSyncData: any = '';
  constructor(
      private api: ApiService,
      private util: UtilsService,
      private active: ActivatedRoute,
      private nav: NavController,
      private network: NetworkService,
      private loadingCtrl: LoadingController,
      private transfer: FileTransfer,
      private storage: StorageService
  ) {}

  ngOnInit() {
      this.getPendingData();
  }
  getPendingData() {
      this.storage.getObject('damageData').then((res) => {
          console.log(res);
          this.DamageData = res ? res : [];
      });
      this.storage.getObject('notesData').then((res) => {
          console.log(res);
          this.NotesData = res ? res : [];
      })
      //this.DamageData = JSON.parse(localStorage.getItem("damageData")) ? JSON.parse(localStorage.getItem("damageData")) :[];
      //this.NotesData = JSON.parse(localStorage.getItem("notesData")) ? JSON.parse(localStorage.getItem("notesData")) :[];
      console.log(this.DamageData);
      console.log(this.NotesData);
  }
  syncData() {
      console.log(this.network.isConnctedNetwork, this.network.checkNetworkType());
      if (this.network.isConnctedNetwork && this.network.checkNetworkType() === 'wifi' || this.network.checkNetworkType() === '4g') {
          this.damageLength = this.DamageData.length;
          this.NotesLength = this.NotesData.length
          if (this.damageLength > 0) {

              this.damagaSyncData = this.DamageData[this.damageIndex];
              this.OffLineuploadFileFordamagae(this.damagaSyncData.base64Image, 'set-vehicle-pictures.php', this.damagaSyncData.vehicle_id, this.damagaSyncData.comment, this.damagaSyncData.damage, this.damagaSyncData);
          }
          if (this.NotesLength > 0) {
              this.NotesSyncData = this.NotesData[this.NotesIndex];
              this.OffLineuploadFileForNotesData(this.NotesSyncData.base64Image, 'set-note-pictures.php', this.NotesSyncData.vehicle_id)
              // set notes 
              let data = {
                  "note": this.NotesSyncData.note,
                  "pictures_to_delete": this.NotesSyncData.pictures_to_delete
              }
              var stringify = JSON.stringify(data);
              this.api.SetNote(this.NotesSyncData.vehicle_id, stringify).subscribe((res: any) => {
                  console.log(res);
              });
          }
      } else {
          this.util.toast("Please connect to a wifi or 4G to sync data");
      }
  }

  async OffLineuploadFileForNotesData(base64Image, url, vehcileId) {
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
              if (this.NotesChecks === this.NotesLength) {
                  console.log("All pushed");
                  this.storage.remove('notesData');
                  this.getPendingData();
                  this.util.toast("Data has been saved");
              } else {
                  this.RemoveUploadedItemForNotes(this.damageIndex)
                  this.NotesChecks++;
                  this.NotesIndex++;
                  this.syncData();
              }

              console.log(JSON.stringify(data) + " Uploaded Successfully");

              loading.dismiss();
              return true;
          }, (err) => {
              console.log(err);
              this.util.toast("Error while uploading");
              return false;
          });
  }


  async OffLineuploadFileFordamagae(base64Image, url, vehcileId, note, damage, data) {
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
              if (this.damageChecks === this.damageLength) {
                  console.log("All pushed");
                  this.storage.remove('damageData');
                  this.getPendingData();
                  this.util.toast("Data has been saved");
              } else {
                  this.RemoveUploadedItemForDamaged(this.damageIndex)
                  this.damageChecks++;
                  this.damageIndex++;
                  this.syncData();
              }

              console.log(JSON.stringify(data) + " Uploaded Successfully");

              loading.dismiss();
              return true;
          }, (err) => {
              console.log(err);
              this.util.toast("Error while uploading");
              return false;
          });
  }
  RemoveUploadedItemForDamaged(id) {
      this.DamageData.splice(0, 1);
      this.storage.setObject('damageData', this.DamageData).then((res) => {
          //saved updated
          this.storage.getObject('damageData').then((res) => {
              this.DamageData = res ? res : [];
          })
      });
  }

  RemoveUploadedItemForNotes(id) {
      this.DamageData.splice(0, 1);
      this.storage.setObject('damageData', this.DamageData).then((res) => {
          //saved updated
          this.storage.getObject('notesData').then((res) => {
              this.NotesData = res ? res : [];
          });
      });
  }


}