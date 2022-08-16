import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-note-save',
  templateUrl: './note-save.page.html',
  styleUrls: ['./note-save.page.scss'],
})
export class NoteSavePage implements OnInit {
  files: any;
  ImageURl: any='';
  GetNotesVehicle: any;
  vehicleDetails: any;
  notes:any;
  base64Image: any='';
  imageURI: any;

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController,
    private actionSheetCtrl: ActionSheetController,
    private file: File,
    private camera: Camera,
    private transfer: FileTransfer,
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
            let formdata= new FormData();
            formdata.append("file",this.files);
            this.api.SetNotePictures(this.vehicleDetails.vehicle_id,formdata).subscribe((res:any)=>{
              console.log(res)
            })
         
            // console.log(this.localUrl)
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
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
       this.camera.getPicture(options).then((imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                this.base64Image  = 'data:image/jpeg;base64,' + imageData;
                this.imageURI = imageData;
                this.uploadFile();
            }, (err) => {
                // Handle error
            });
    }
    saveNotes(){
      console.log(this.notes)
      let data ={
        "note":this.notes,
      }
    var stringify = JSON.stringify(data);
      this.api.SetNote(this.vehicleDetails.vehicle_id,stringify).subscribe((res:any)=>{
        console.log(res);
        if(res){
          this.util.toast("Note saved")
        }
      })
    }
    uploadFile(){
      const fileTransfer: FileTransferObject = this.transfer.create();

      let filename=Date.now();
        let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'image-'+filename,
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
        }
     fileTransfer.upload(this.imageURI, 'https://digital-lab.lu/pick-up/admin/app/set-note-picture.php?driver_id=136&token=4af9c6b8f1ae74b9&vehicle_id=86917', options)
    .then((data) => {
    console.log(data+" Uploaded Successfully");
    this.util.toast("Image uploaded successfully");
  }, (err) => {
    console.log(err);
   
    this.util.toast(err);
  });
    }
}
