import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-note-save',
  templateUrl: './note-save.page.html',
  styleUrls: ['./note-save.page.scss'],
})
export class NoteSavePage implements OnInit {
  files: any='';
  ImageURl: any='';
  GetNotesVehicle: any;
  vehicleDetails: any;
  notes:any;
  base64Image: any='';
  imageURI: any;
  deletePicsArray:any=[];
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
      console.log(res.vehicleDetails);
      this.vehicleDetails=res.vehicleDetails;
      this.getvehicleNotes(this.vehicleDetails.vehicle_id)
    })
  }

  ngOnInit() {
  }
  getvehicleNotes(id){
    console.log(id)
    this.api.getNotes(id).subscribe((res:any)=>{
      console.log(res);
      this.GetNotesVehicle=res;
      this.notes=this.GetNotesVehicle.note;
    })
  }
  showPreviewImage(event: any) {
    console.log(event)
    this.files= event.target.files[0];
    console.log(this.files);
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          console.log(event)
          console.log(event)
            this.ImageURl = event.target.result;
        
        }
        reader.readAsDataURL(event.target.files[0]);
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
                this.imageURI = imageData;
                this.util.uploadFile(this.base64Image,'set-note-pictures.php',this.vehicleDetails.vehicle_id);
            }, (err) => {
                // Handle error
            });
    }
    saveNotes(){
      //set note pic
      if(this.files){
        let formdata= new FormData();
        formdata.append("file",this.files);
        this.api.SetNotePictures(this.vehicleDetails.vehicle_id,formdata).subscribe((res:any)=>{
          console.log(res);
        })
      }
          // set notes 
      let data ={
        "note":this.notes,
        "pictures_to_delete":this.deletePicsArray
      }
    var stringify = JSON.stringify(data);
      this.api.SetNote(this.vehicleDetails.vehicle_id,stringify).subscribe((res:any)=>{
        console.log(res);
        if(res){
          this.util.toast("Note has been saved")
        }
      })
      
    }
    deletePics(item){
      var filename=item.split('.').slice(0, -1).join('.')
      console.log(filename)
      this.deletePicsArray.push(item);
    }
}
