import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import {
    ActionSheetController,
    NavController
} from '@ionic/angular';
import {
    ApiService
} from 'src/app/services/api.service';
import {
    UtilsService
} from 'src/app/services/utils.service';
import {
    Camera,
    CameraOptions
} from '@ionic-native/camera/ngx';
import {
    NetworkService
} from 'src/app/services/network.service';
import {
    StorageService
} from 'src/app/services/storage.service';

@Component({
    selector: 'app-photo-step2',
    templateUrl: './photo-step2.page.html',
    styleUrls: ['./photo-step2.page.scss'],
})
export class PhotoStep2Page implements OnInit {
    seletedDamage: any;
    vehicleDetails: any;
    ImageURl: any = '';
    files: any;
    notes: any;
    base64Image: string = '';
    damagaOfflineArray: any = [];
    ifalreadyHave: any = [];
    damagedDataGet: any;
    SuccessfilImageUpload: any;


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
            this.seletedDamage = res.data;
            this.vehicleDetails = res.vehicleDetails;
            this.getDamagedDataVehicle(this.vehicleDetails.vehicle_id);
        })
    }

    ngOnInit() {}
    getDamagedDataVehicle(id) {
        this.api.GetDamagedData(id).subscribe((res) => {
            if (res) {
                let arr = [];
                arr.push(res);
                this.damagedDataGet = arr[0][this.seletedDamage.damagedArea];
                this.notes = this.damagedDataGet?.comment;
            }
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
    async save() {
        if (this.base64Image) {
            if (this.network.isConnctedNetwork && this.network.checkNetworkType() === 'wifi' || this.network.checkNetworkType() === '4g') {
                this.SuccessfilImageUpload = await this.util.uploadFileFordamagae(this.base64Image, 'set-vehicle-pictures.php', this.vehicleDetails.vehicle_id, this.notes, this.seletedDamage.damagedArea);
                if (this.SuccessfilImageUpload) {
                    this.getDamagedDataVehicle(this.vehicleDetails.vehicle_id);
                }
            } else {
                this.storage.getObject('damageData').then((res) => {
                    this.ifalreadyHave = res ? res : [];
                })
                if (this.ifalreadyHave.length > 0) {
                    this.damagaOfflineArray = this.ifalreadyHave;
                }
                let damageData = {
                    "damage": this.seletedDamage.damagedArea,
                    "base64Image": this.base64Image ? this.base64Image : "",
                    "vehicle_id": this.vehicleDetails.vehicle_id,
                    "comment": this.notes ? this.notes : ""
                }
                this.damagaOfflineArray.push(damageData);
                this.storage.setObject('damageData', this.damagaOfflineArray).then((res) => {
                    //saved
                })
                this.util.toast("Your data has been saved");
            }
        } else {
            this.util.toast("Please upload picture");
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
                    handler: () => {

                    }
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
            ;
            // Handle error
        });
    }
    gotophotoStep1(item) {
        this.nav.navigateForward("/photo-step1", {
            queryParams: {
                data: item
            }
        });
    }
}