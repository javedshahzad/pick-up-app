import {
  Component,
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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  todayListings: any = [];
  searchArray: any = [];
  emptySearch: boolean = false;
  ifalreadyHave: any = [];
  userData: any;
  BringBackSaveOffline: any = [];
  offlineDataArray = [];
  myDriverID: any = "";
  OfflineActions: any = [];

  constructor(
      private api: ApiService,
      private util: UtilsService,
      private nav: NavController,
      private network: NetworkService,
      private storage: StorageService,
      private WatchNetwork: Network,
  ) {}
  ngOnInit(): void {
      console.log(navigator.onLine)
      this.api.setDriver();
      this.GetAndSetListings();
      this.watchNetworks();
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.myDriverID = this.userData?.driver_id ? this.userData?.driver_id : "";
  }
  GetAndSetListings() {
      if (this.network.isConnctedNetwork) {
          this.getTodayListings();
      } else {
          this.storage.getObject('todayListings').then((res) => {
              console.log(res);
              this.todayListings = res;
          });
      }
  }
  getTodayListings() {
      this.api.getListings("today").subscribe((res: any) => {
          console.log(res);
          if (res) {
              this.todayListings = res;
              this.searchArray = res;
              this.storage.setObject('todayListings', this.todayListings).then((res) => {});
              //localStorage.setItem('todayListings',JSON.stringify(this.todayListings));

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
                  this.util.toast("Vehicle Picked up");
                  this.getTodayListings();
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
          this.updatedArrayPickup(item, this.userData?.driver_id, "ADU");
          this.util.toast("Vehicle has been pickup");
      }

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
          console.log(res);
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
                  this.getTodayListings();
              }
          });
      } else {
          let data = {
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          };
          this.StoreOfflineActions(data);
          this.updatedArrayBringBack(item, this.userData?.driver_id, "ADU");
          this.util.toast("Vehicle has been back");

      }
  }
  updatedArrayPickup(item, driverIdPickup, driverPickupTrigram) {

      //find the index of object from array that you want to update
      const objIndex = this.todayListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);
      // When specific item is not found
      if (objIndex === -1) {
          return;
      }

      // adding pickup driver id AND trigram 
      const updatedObj = {
          ...this.todayListings[objIndex],
          driver_id_pick_up: driverIdPickup,
          driver_trigram_pick_up: driverPickupTrigram,
      };
      // make final new array of objects by combining updated object.
      const UpdatedListings = [
          ...this.todayListings.slice(0, objIndex),
          updatedObj,
          ...this.todayListings.slice(objIndex + 1),
      ];

      console.log("original data=", this.todayListings);
      console.log("updated data=", UpdatedListings);
      this.storage.setObject('todayListings', UpdatedListings).then((res) => {
          this.GetAndSetListings();
      });
  }
  updatedArrayBringBack(item, bringbackId, bringbackTrigram) {
      //find the index of object from array that you want to update
      const objIndex = this.todayListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);
      // When specific item is not found
      if (objIndex === -1) {
          return;
      }
      // adding bring back driver id AND trigram  
      const updatedObj = {
          ...this.todayListings[objIndex],
          driver_id_bring_back: bringbackId,
          driver_trigram_bring_back: bringbackTrigram
      };

      // make final new array of objects by combining updated object.
      const UpdatedListings = [
          ...this.todayListings.slice(0, objIndex),
          updatedObj,
          ...this.todayListings.slice(objIndex + 1),
      ];

      console.log("original data=", this.todayListings);
      console.log("updated data=", UpdatedListings);
      this.storage.setObject('todayListings', UpdatedListings).then((res) => {
          this.GetAndSetListings();
      });
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
                  this.util.toast("Vehicle unsetd");
                  this.getTodayListings();
              }
          });
      } else {
          let data = {
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          };
          this.StoreOfflineActions(data);
          this.updatedArrayPickup(item, "0", "");
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
                  this.util.toast("Vehicle unsetd");
                  this.getTodayListings();
              }
          })
      } else {
          let data = {
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          };
          this.StoreOfflineActions(data);
          this.updatedArrayBringBack(item, "0", "");
      }
  }
  ckeckUp(item) {
      console.log(item);
      this.nav.navigateForward("/checkup", {
          queryParams: {
              data: item
          }
      });
  }
  gotoNote(item) {
      console.log(item);
      this.nav.navigateForward("/note", {
          queryParams: {
              data: item
          }
      });
  }
  gotophotoStep1(item) {
      console.log(item);
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
          this.todayListings = x;
          if (x.length === 0) {
              this.emptySearch = true;
          }
      } else {
          this.todayListings = this.searchArray;
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