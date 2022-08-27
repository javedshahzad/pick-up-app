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
        this.api.setDriver();
        this.watchNetworks();
        this.userData = JSON.parse(localStorage.getItem("userData"));
        this.myDriverID = this.userData?.driver_id ? this.userData?.driver_id : "";
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

    storeDataInStorage(type, value) {
        this.storage.setObject(type, value).then((res) => {})
    }
    GetDataFromStorage(type) {
        this.storage.getObject(type).then((res: any) => {
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
        });
    };
    PickupBringbackActions(item, way, action) {
        if (this.network.isConnctedNetwork) {
            let data = [{
                "way": way,
                "vehicle_id": item.vehicle_id,
                "action": action
            }];
            var strigifydata = JSON.stringify(data);
            this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
                if (res) {
                    this.util.toast("Vehicle has been " + way);
                    this.GetAllListingsData();
                }
            });
        } else {
            let data = {
                "way": way,
                "vehicle_id": item.vehicle_id,
                "action": action
            };
            this.StoreOfflineActions(data);
            this.userData = JSON.parse(localStorage.getItem("userData"));
            if (way === 'pick_up' && action === 'unset') {
                this.UpdatedArray(item, "0", "", "pickup");

            }
            if (way === 'pick_up' && action === 'set') {
                this.UpdatedArray(item, this.userData?.driver_id, this.userData.trigram, "pickup");
            }
            if (way === 'bring_back' && action === 'set') {
                this.UpdatedArray(item, this.userData?.driver_id, this.userData.trigram, "back");
            }
            if (way === 'bring_back' && action === 'unset') {
                this.UpdatedArray(item, "0", "", "back");
            }
            this.util.toast("Vehicle has been " + way);
        }

    }

    UpdatedArray(item, driverId, Trigram, type) {
        const objIndex = this.getAllListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);
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
        // adding bring back driver id AND trigram 
        if (type === "back") {
            var updatedObj = {
                ...this.getAllListings[objIndex],
                driver_id_bring_back: driverId,
                driver_trigram_bring_back: Trigram
            };
        }
        const UpdatedListings = [
            ...this.getAllListings.slice(0, objIndex),
            updatedObj,
            ...this.getAllListings.slice(objIndex + 1),
        ];
        this.storeDataInStorage(this.dayType, UpdatedListings);
        setTimeout(() => {
            this.GetAndSetListings();
        }, 1000);
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
            setTimeout(() => {
                this.network.isConnctedNetwork = true;
                this.UploadToServer();
            }, 1000);
        });
    }
    UploadToServer() {
        this.storage.getObject('OfflineActions').then((res) => {
            this.offlineDataArray = res ? res : [];
            if (this.offlineDataArray.length > 0) {
                var strigifydata = JSON.stringify(this.offlineDataArray);
                this.api.pickupAndBringBack(strigifydata).subscribe((res: any) => {
                    if (res) {
                        this.storage.remove('OfflineActions');
                        this.GetAndSetListings()
                    }
                });
            }
        })


    }
}