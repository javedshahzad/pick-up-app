import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-photo-step2',
  templateUrl: './photo-step2.page.html',
  styleUrls: ['./photo-step2.page.scss'],
})
export class PhotoStep2Page implements OnInit {
  seletedDamage: any;
  vehicleDetails: any;
  ImageURl: any='';
  files: any;
  notes:any;
  base64Image: string='';

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private network:NetworkService
  ) { 
    this.active.queryParams.subscribe((res:any)=>{
      console.log(res.data);
      this.seletedDamage=res.data;
      this.vehicleDetails=res.vehicleDetails;
      console.log(this.vehicleDetails)
    })
  }

  ngOnInit() {
  }
  showPreviewImage(event: any) {
    console.log(event)
    this.files= event.target.files[0];
    console.log(this.files);
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.ImageURl = event.target.result;
      
            // console.log(this.localUrl)
        }
        reader.readAsDataURL(event.target.files[0]);
    }

  }
  save(){
    if(this.network.isConnctedNetwork){
       this.util.uploadFile(this.base64Image,'set-vehicle-pictures.php',this.vehicleDetails.vehicle_id);
      let formdata= new FormData();
      formdata.append("damage", this.seletedDamage.damagedArea);
      this.api.SetVehiclePictures(this.vehicleDetails.vehicle_id,formdata).subscribe((res:any)=>{
        console.log(res);
      })
    }else{
      let damagaOfflineArray=[];
       let ifalreadyHave=JSON.parse(localStorage.getItem("damageData"));
       if(ifalreadyHave != null || ifalreadyHave !=''){
        damagaOfflineArray= ifalreadyHave
       }else{
        let damageData={
          "damage":this.seletedDamage.damagedArea,
          "base64Image":this.base64Image,
          "vehicle_id": this.vehicleDetails.vehicle_id,
        }
        damagaOfflineArray.push(damageData);
        localStorage.setItem("damageData",JSON.stringify(damageData));
       }

    }

 
  }

  async presentActionSheet() {
    let actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image source",
      mode:"ios",
      buttons: [
        {
          text: 'Camera',
        icon:"camera",
          handler: () => {
            console.log('Destructive clicked');
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Gallery',
          icon:"images",
          handler: () => {
            console.log('Archive clicked');
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    await actionSheet.present();
  }
  takePhoto(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
       this.camera.getPicture(options).then((imageData) => {
                this.base64Image  = "data:image/jpeg;base64,"+imageData;
             
            }, (err) => {
              console.log(err);
                // Handle error
            });
    }
    gotophotoStep1(item){
      console.log(item);
      this.nav.navigateForward("/photo-step1",{queryParams:{data:item}});
    }
}
