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
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  tomorrowListings: any = [];
  searchArray: any = [];
  emptySearch: boolean = false;
  userData: any = '';
  myDriverID: any = '';
  ifalreadyHave: any = [];
  OfflineActionTommorow: any = [];
  offlineDataArray: any = [];
  constructor(
      private api: ApiService,
      private util: UtilsService,
      private nav: NavController,
      private network: NetworkService,
      private storage: StorageService,
      private WatchNetwork: Network,
  ) {
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.myDriverID = this.userData?.driver_id ? this.userData?.driver_id : "";
  }
  ngOnInit(): void {
      this.watchNetworks();
      this.getTomorwoLists();
  }
  getTomorwoLists() {
      if (this.network.isConnctedNetwork) {
          this.getTomorrowListings();
      } else {
          this.storage.getObject('tomorrowListings').then((res) => {
              this.tomorrowListings = res;
          });
      }
  }
  getTomorrowListings() {
      this.api.getListings("tomorrow").subscribe((res: any) => {
          console.log(res);
          if (res) {
              this.tomorrowListings = res;
              this.searchArray = res;
              this.storage.setObject('tomorrowListings', this.tomorrowListings).then((res) => {

              });;
              //localStorage.setItem('tomorrowListings',JSON.stringify(this.tomorrowListings));
          }

      })
  }

  Search(eve) {
      const str = eve.detail.value;
      if (str) {
          let arrdata = this.searchArray;
          let x = arrdata.filter((a) => a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
          this.tomorrowListings = x;
          if (x.length === 0) {
              this.emptySearch = true;
          }
      } else {
          this.tomorrowListings = this.searchArray;
      }
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
                  this.getTomorwoLists();
              }
          });
      } else {
          let data = {
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          };
          this.StoreOfflineActionTommorow(data);
          this.userData = JSON.parse(localStorage.getItem("userData"));
          this.UpdatedArray(item, this.userData?.driver_id, "ADU", "pickup");
          this.util.toast("Vehicle has been pickup");
      }

  }
  StoreOfflineActionTommorow(data) {
      this.storage.getObject('OfflineActionTommorow').then((res) => {
          this.ifalreadyHave = res ? res : [];
      });
      if (this.ifalreadyHave.length > 0) {
          this.OfflineActionTommorow = this.ifalreadyHave
      }

      this.OfflineActionTommorow.push(data);
      this.storage.setObject('OfflineActionTommorow', this.OfflineActionTommorow).then((res) => {
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
                  this.getTomorwoLists();
              }
          });
      } else {
          let data = {
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "set"
          };
          this.StoreOfflineActionTommorow(data);
          this.UpdatedArray(item, this.userData?.driver_id, "ADU", "back");
          this.util.toast("Vehicle has been back");

      }
  }
  UpdatedArray(item, driverId, Trigram, type) {

      //find the index of object from array that you want to update
      const objIndex = this.tomorrowListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);
      // When specific item is not found
      if (objIndex === -1) {
          return;
      }

      // adding pickup driver id AND trigram 
      if (type === "pickup") {
          var updatedObj = {
              ...this.tomorrowListings[objIndex],
              driver_id_pick_up: driverId,
              driver_trigram_pick_up: Trigram,
          };
      }
      if (type === "back") {
          var updatedObj = {
              ...this.tomorrowListings[objIndex],
              driver_id_bring_back: driverId,
              driver_trigram_bring_back: Trigram
          };
      }
      // make final new array of objects by combining updated object.
      const UpdatedListings = [
          ...this.tomorrowListings.slice(0, objIndex),
          updatedObj,
          ...this.tomorrowListings.slice(objIndex + 1),
      ];

      console.log("original data=", this.tomorrowListings);
      console.log("updated data=", UpdatedListings);
      this.storage.setObject('tomorrowListings', UpdatedListings).then((res) => {
          this.getTomorwoLists();
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
                  this.getTomorwoLists();
              }
          });
      } else {
          let data = {
              "way": "pick_up",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          };
          this.StoreOfflineActionTommorow(data);
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
                  this.util.toast("Vehicle unsetd");
                  this.getTomorwoLists();
              }
          })
      } else {
          let data = {
              "way": "bring_back",
              "vehicle_id": item.vehicle_id,
              "action": "unset"
          };
          this.StoreOfflineActionTommorow(data);
          this.UpdatedArray(item, "0", "", "back");
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
      this.storage.getObject('OfflineActionTommorow').then((res) => {
          console.log(res);
          this.offlineDataArray = res ? res : [];
          if (this.offlineDataArray.length > 0) {
              var strigifydata = JSON.stringify(this.offlineDataArray);
              console.log(strigifydata);
              this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
                  console.log(res);
                  if (res) {
                      console.log(res);
                      this.storage.remove('OfflineActionTommorow');
                      this.getTomorwoLists()
                  }
              });
          }
      })


  }
}