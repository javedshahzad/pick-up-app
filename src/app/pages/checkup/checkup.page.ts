import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Network
} from '@ionic-native/network/ngx';
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
  selector: 'app-checkup',
  templateUrl: './checkup.page.html',
  styleUrls: ['./checkup.page.scss'],
})
export class CheckupPage implements OnInit {
  vehicleDetails: any;
  checkedstatus: any = {};
  OfflineArray: any = [];
  ifAlreadyCheckups: any = [];
  OfflineCheckupsActions: any = [];
  arrayForUpload: any = [];
  constructor(
      private api: ApiService,
      private util: UtilsService,
      private active: ActivatedRoute,
      private network: NetworkService,
      private storage: StorageService,
      private WatchNetwork: Network,
  ) {
      this.active.queryParams.subscribe((res: any) => {
          console.log(res.data);
          this.vehicleDetails = res.data;
          this.getcheckups(this.vehicleDetails.vehicle_id);
          this.watchNetworks()
      })
  }

  ngOnInit() {
    
  }
  getcheckups(id) {
      if (this.network.isConnctedNetwork) {
          console.log(id)
          this.api.getCheckup(id).subscribe((res: any) => {
              console.log(res);
              this.checkedstatus = res;
              this.checkedstatus.vehicle_id = id;
              this.storeOfflineData(this.checkedstatus)
          });
      } else {
          this.GetOfflineCheckupData(id)
      }
  };
  storeOfflineData(data) {
      this.storage.getObject('offlineChechup').then((res) => {
          this.OfflineArray = res ? res : [];
          let arrdata = this.OfflineArray;
          let x = arrdata.filter((a) => a.vehicle_id === data.vehicle_id);
          if (x.length > 0) {
            this.checkedstatus=x[0];
            this.UpdatedArray(this.checkedstatus);
              console.log("have already")
          } else {
              this.OfflineArray.push(data);
              this.storage.setObject("offlineChechup", this.OfflineArray).then((res) => {
                  console.log(res);
              });
          }
      });
  }
  GetOfflineCheckupData(id) {
      this.storage.getObject("offlineChechup").then((res) => {
          console.log(res);
          this.OfflineArray = res ? res : [];
          let arrdata = this.OfflineArray;
          let x = arrdata.filter((a) => a.vehicle_id === id);
          console.log(x);
          if (x.length > 0) {
              this.checkedstatus = x[0];
          }
      })
  }
  Cleanvechile(eve) {
      if (eve.detail.checked) {
          this.checkedstatus.clean_vehicle = 1;
      } else {
          this.checkedstatus.clean_vehicle = 0;
      }
  }
  vehiclePic(eve) {
      if (eve.detail.checked) {
          this.checkedstatus.vehicle_pictures = 1;
      } else {
          this.checkedstatus.vehicle_pictures = 0;
      }
  }
  photosDamage(eve) {
      if (eve.detail.checked) {
          this.checkedstatus.pictures_of_damage = 1;
      } else {
          this.checkedstatus.pictures_of_damage = 0;
      }
  }
  windsheilds(eve) {
      if (eve.detail.checked) {
          this.checkedstatus.windshield_check = 1;
      } else {
          this.checkedstatus.windshield_check = 0;
      }
  }
  enginelights(eve) {
      if (eve.detail.checked) {
          this.checkedstatus.engine_light = 1;
      } else {
          this.checkedstatus.engine_light = 0;
      }
  }
  savecheckup() {
      console.log(this.checkedstatus);
      if (this.network.isConnctedNetwork) {
          var jsondata = JSON.stringify(this.checkedstatus);
          this.api.setCheckup(this.vehicleDetails.vehicle_id, jsondata).subscribe((res: any) => {
              console.log(res);
              if (res) {
                  this.UpdatedArray(this.checkedstatus);
                  this.util.toast("Saved Checkup");
              }
          });
      } else {

          this.StoreOfflineCheckupsActions(this.checkedstatus);
          this.UpdatedArray(this.checkedstatus);
      }
  }

  UpdatedArray(item) {
    //find the index of object from array that you want to update
    const objIndex = this.OfflineArray.findIndex(obj => obj.vehicle_id === item.vehicle_id);
    // When specific item is not found
    if (objIndex === -1) {
        return;
    }

    // adding pickup driver id AND trigram 
  
        var updatedObj = {
            ...this.OfflineArray[objIndex],
            clean_vehicle: item.clean_vehicle,
            engine_light: item.engine_light,
            pictures_of_damage: item.pictures_of_damage,
            vehicle_pictures: item.vehicle_pictures,
            windshield_check: item.windshield_check,
        };
    
    // make final new array of objects by combining updated object.
    const UpdatedListings = [
        ...this.OfflineArray.slice(0, objIndex),
        updatedObj,
        ...this.OfflineArray.slice(objIndex + 1),
    ];
    console.log("updated data=", UpdatedListings);
    this.storage.setObject("offlineChechup", UpdatedListings).then((res) => {
      console.log(res);
  });
     

}
  StoreOfflineCheckupsActions(data) {
      this.storage.getObject('OfflineCheckupsActions').then((res) => {
          console.log(res);
          this.ifAlreadyCheckups = res ? res : [];
      });
      if (this.ifAlreadyCheckups.length > 0) {
          this.OfflineCheckupsActions = this.ifAlreadyCheckups
      }
      let arrdata = this.OfflineCheckupsActions;
      let x = arrdata.filter((a) => a.vehicle_id === data.vehicle_id);
      if (x.length > 0) {
          for (var i = 0; i < this.OfflineCheckupsActions.length; i++) {
              if (this.OfflineCheckupsActions[i].vehicle_id == data.vehicle_id) {
                  this.OfflineCheckupsActions.splice(i, 1);
              }
          }
      }
   
          this.OfflineCheckupsActions.push(data);
          this.storage.setObject('OfflineCheckupsActions', this.OfflineCheckupsActions).then((res) => {
              //saved
              this.util.toast("Saved Checkup");
              this.storage.getObject('OfflineCheckupsActions').then((res) => {
                  console.log(res);
              });
          });
  
  }

  uploadCheckupsToServer() {
      this.storage.getObject('OfflineCheckupsActions').then((res) => {
          this.arrayForUpload = res ? res : [];
      });
      console.log(this.arrayForUpload);
      if (this.arrayForUpload.length > 0) {
        this.checkedstatus = this.arrayForUpload[0];
        var jsondata = JSON.stringify(this.checkedstatus);
        this.api.setCheckup(this.checkedstatus.vehicle_id, jsondata).subscribe((res: any) => {
            console.log(res);
            if (res) {
                this.RemoveUploadedItem();
              
            }
        });
    } else {
        this.storage.remove("OfflineCheckupsActions");
        console.log("Uploaded alll")
    }
  }
  RemoveUploadedItem() {
      this.arrayForUpload.splice(0, 1);
      console.log(this.arrayForUpload);
      this.storage.setObject('OfflineCheckupsActions', this.arrayForUpload).then((res) => {
      });
      this.uploadCheckupsToServer();
  }
  watchNetworks() {
      // watch network for a connection
      this.WatchNetwork.onConnect().subscribe((net) => {
          console.log(net, 'network connected!');
          setTimeout(() => {
              console.log('From checkups!');
              this.network.isConnctedNetwork = true;
              this.uploadCheckupsToServer();
          }, 800);
      });
  }
}