import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  Network
} from '@ionic-native/network/ngx';
import {
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
  selector: 'app-get-vehicle-listings',
  templateUrl: './get-vehicle-listings.page.html',
  styleUrls: ['./get-vehicle-listings.page.scss'],
})
export class GetVehicleListingsPage implements OnInit {
  getAllListings: any = [];
  searchArray: any = [];
  emptySearch: boolean = false;
  ifalreadyHave: any = [];
  userData: any;
  offlineDataArray = [];
  myDriverID: any = "";
  OfflineActions: any = [];
  @Input() dayType;
  constructor(
      private api: ApiService,
      private util: UtilsService,
      private nav: NavController,
      private network: NetworkService,
      private storage: StorageService,
      private WatchNetwork: Network,
  ) {}

  ngOnInit() {
      console.log(navigator.onLine)
      this.api.setDriver();
      this.watchNetworks();
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.myDriverID = this.userData?.driver_id ? this.userData?.driver_id : "";
      console.log(this.dayType);
      this.GetAndSetListings();
  }
  GetAndSetListings() {
      if (this.network.isConnctedNetwork) {
          this.GetAllListingsData();
      } else {
          this.GetDataFromStorage(this.dayType);
      }
  }
  GetAllListingsData() {
      this.api.getListings(this.dayType).subscribe((res: any) => {
          console.log(res);
          if (res) {
              this.getAllListings = res;
              this.searchArray = res;
              this.storeDataInStorage(this.dayType, this.getAllListings)
          }

      })
  }
  gotoUrl(url) {
      this.nav.navigateForward(url);
  }
  pickup(item) {
      if (this.network.isConnctedNetwork) {
          let data = [{
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          }];
          var strigifydata = JSON.stringify(data);
          this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
              console.log(res);
              if (res) {
                  this.util.toast("Vehicle has been puckup");
                  this.GetAllListingsData();
              }
          });
      } else {
          let data = {
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          };
          this.StoreOfflineActions(data);
          this.userData = JSON.parse(localStorage.getItem("userData"));
          this.UpdatedArray(item, this.userData?.driver_id, this.userData.trigram, "pickup");
          this.util.toast("Vehicle has been pickup");
      }

  }
  storeDataInStorage(type, value) {
      this.storage.setObject(type, value).then((res) => {
      })
  }
  GetDataFromStorage(type) {
      this.storage.getObject(type).then((res: any) => {
          console.log(res);
          this.getAllListings = res;
          this.searchArray = res;
      })
  }
  StoreOfflineActions(data) {
      this.storage.getObject('OfflineActions').then((res) => {
          this.ifalreadyHave = res ? res : [];
      });
      if (this.ifalreadyHave.length > 0) {
          this.OfflineActions = this.ifalreadyHave
      }

      this.OfflineActions.push(data);
      this.storage.setObject('OfflineActions', this.OfflineActions).then((res) => {
          //saved
          this.storage.getObject('OfflineActions').then((res) => {
              console.log(res);
          });
      });
  };
  bringBack(item) {
      if (this.network.isConnctedNetwork) {
          let data = [{
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          }];
          var strigifydata = JSON.stringify(data);
          this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
              console.log(res);
              if (res) {
                  this.util.toast("Vehicle has been Back");
                  this.GetAllListingsData();
              }
          });
      } else {
          let data = {
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          };
          this.StoreOfflineActions(data);
          this.UpdatedArray(item, this.userData?.driver_id, this.userData.trigram, "back");
          this.util.toast("Vehicle has been back");

      }
  }
  UpdatedArray(item, driverId, Trigram, type) {
      //find the index of object from array that you want to update
      const objIndex = this.getAllListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);
      // When specific item is not found
      if (objIndex === -1) {
          return;
      }

      // adding pickup driver id AND trigram 
      if (type === "pickup") {
          var updatedObj = {
              ...this.getAllListings[objIndex],
              driver_id_pick_up: driverId,
              driver_trigram_pick_up: Trigram,
          };
      }
      if (type === "back") {
          var updatedObj = {
              ...this.getAllListings[objIndex],
              driver_id_bring_back: driverId,
              driver_trigram_bring_back: Trigram
          };
      }
      // make final new array of objects by combining updated object.
      const UpdatedListings = [
          ...this.getAllListings.slice(0, objIndex),
          updatedObj,
          ...this.getAllListings.slice(objIndex + 1),
      ];

      console.log("original data=", this.getAllListings);
      console.log("updated data=", UpdatedListings);
      this.storeDataInStorage(this.dayType, UpdatedListings);
      setTimeout(() => {
          this.GetAndSetListings();
      }, 1000);
      // this.storage.setObject('getAllListings', UpdatedListings).then((res) => {
      //     this.GetAndSetListings();
      // });
  }
  UnsetIfWrongPickup(item) {
      if (this.network.isConnctedNetwork) {
          let data = [{
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          }];
          var strigifydata = JSON.stringify(data);
          this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
              console.log(res);
              if (res) {
                  this.util.toast("Vehicle unset");
                  this.GetAllListingsData();
              }
          });
      } else {
          let data = {
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          };
          this.StoreOfflineActions(data);
          this.UpdatedArray(item, "0", "", "pickup");
      }
  }
  wrongBringBack(item) {
      if (this.network.isConnctedNetwork) {
          let data = [{
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          }]
          var strigifydata = JSON.stringify(data);
          this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
              console.log(res);
              if (res) {
                  this.util.toast("Vehicle unset");
                  this.GetAllListingsData();
              }
          })
      } else {
          let data = {
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          };
          this.StoreOfflineActions(data);
          this.UpdatedArray(item, "0", "", "back");
      }
  }
  ckeckUp(item) {

      this.nav.navigateForward("/checkup", {
          queryParams: {
              data: item
          }
      });
  }
  gotoNote(item) {
   
      this.nav.navigateForward("/note", {
          queryParams: {
              data: item
          }
      });
  }
  gotophotoStep1(item) {
      this.nav.navigateForward("/photo-step1", {
          queryParams: {
              data: item
          }
      });
  }
  Search(eve) {
      this.emptySearch = false;
      const str = eve.detail.value;
      console.log(str);
      if (str) {
          let arrdata = this.searchArray;
          let x = arrdata.filter((a) => a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
          this.getAllListings = x;
          if (x.length === 0) {
              this.emptySearch = true;
          }
      } else {
          this.getAllListings = this.searchArray;
      }
  }

  watchNetworks() {
      // watch network for a connection
      this.WatchNetwork.onConnect().subscribe((net) => {
          console.log(net, 'network connected!');
          setTimeout(() => {
              console.log('We got a connection, woohoo!');
              this.network.isConnctedNetwork = true;
              this.UploadToServer();
          }, 1000);
      });
  }
  UploadToServer() {
      this.storage.getObject('OfflineActions').then((res) => {
          console.log(res);
          this.offlineDataArray = res ? res : [];
          if (this.offlineDataArray.length > 0) {
              var strigifydata = JSON.stringify(this.offlineDataArray);
              console.log(strigifydata);
              this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
                  console.log(res);
                  if (res) {
                      console.log(res);
                      this.storage.remove('OfflineActions');
                      this.GetAndSetListings()
                  }
              });
          }
      })


  }
}