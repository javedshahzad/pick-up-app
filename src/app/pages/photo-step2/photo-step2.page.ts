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
  damagaOfflineArray:any=[];
  ifalreadyHave:any=[];
  damagedDataGet: any;
  SuccessfilImageUpload: any;


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
      console.log(this.vehicleDetails);
      this.getDamagedDataVehicle(this.vehicleDetails.vehicle_id);
    })
  }

  ngOnInit() {
  }
  getDamagedDataVehicle(id){
    this.api.GetDamagedData(id).subscribe((res)=>{
      if(res){
        console.log(res)
        let arr=[];
        arr.push(res);
        this.damagedDataGet=arr[0][this.seletedDamage.damagedArea];
        console.log(this.damagedDataGet);
        this.notes=this.damagedDataGet.comment;
        this.base64Image="";
      }
    })
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
 async save(){
    console.log(this.network.isConnctedNetwork);
    if(this.network.isConnctedNetwork){
     this.SuccessfilImageUpload = await this.util.uploadFileFordamagae(this.base64Image,'set-vehicle-pictures.php',this.vehicleDetails.vehicle_id,this.notes,this.seletedDamage.damagedArea);
        if(this.SuccessfilImageUpload){
          this.getDamagedDataVehicle(this.vehicleDetails.vehicle_id);
        }
        // this.gotophotoStep1(this.vehicleDetails);
    }else{
       this.ifalreadyHave=JSON.parse(localStorage.getItem("damageData")) ? JSON.parse(localStorage.getItem("damageData")) : [];
       console.log(this.ifalreadyHave);
       if(this.ifalreadyHave.length > 0){
        this.damagaOfflineArray=this.ifalreadyHave;
        console.log("here");
       }
        let damageData={
          "damage":this.seletedDamage.damagedArea,
          "base64Image":this.base64Image ? this.base64Image : "",
          "vehicle_id": this.vehicleDetails.vehicle_id
        }
        this.damagaOfflineArray.push(damageData);
        localStorage.setItem("damageData",JSON.stringify(this.damagaOfflineArray));
        this.util.toast("Saved");
        this.gotophotoStep1(this.vehicleDetails);

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
      quality: 80,
      targetWidth: 1000,
      targetHeight: 1000,
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
