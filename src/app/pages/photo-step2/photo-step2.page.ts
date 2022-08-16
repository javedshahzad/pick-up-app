import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-photo-step2',
  templateUrl: './photo-step2.page.html',
  styleUrls: ['./photo-step2.page.scss'],
})
export class PhotoStep2Page implements OnInit {
  seletedDamage: any;
  vehicleDetails: any;
  ImageURl: any;
  files: any;
  notes:any;

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController
  ) { 
    this.active.queryParams.subscribe((res:any)=>{
      console.log(res.data);
      this.seletedDamage=res.data;
      this.vehicleDetails=res.vehicleDetails
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
          console.log(event)
          console.log(event)
            this.ImageURl = event.target.result;
      
            // console.log(this.localUrl)
        }
        reader.readAsDataURL(event.target.files[0]);
    }

  }
  save(){
    let formdata= new FormData();
    formdata.append("file",this.files);
    formdata.append("damage",this.notes);
    this.api.SetNotePictures(this.vehicleDetails.vehicle_id,formdata).subscribe((res:any)=>{
      console.log(res);
      this.util.toast("Saved")
    })
 
  }
}
