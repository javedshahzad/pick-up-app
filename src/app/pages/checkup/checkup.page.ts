import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-checkup',
  templateUrl: './checkup.page.html',
  styleUrls: ['./checkup.page.scss'],
})
export class CheckupPage implements OnInit {
  vehicleDetails: any;
  checkedstatus: any={};

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute
  ) { 
    this.active.queryParams.subscribe((res:any)=>{
      console.log(res.data);
      this.vehicleDetails=res.data;
      this.getcheckups(this.vehicleDetails.vehicle_id)
    })
  }

  ngOnInit() {
  }
  getcheckups(id){
    console.log(id)
    this.api.getCheckup(id).subscribe((res:any)=>{
      console.log(res);
      this.checkedstatus=res;
    })
  }
  Cleanvechile(eve){
    if(eve.detail.checked){
      this.checkedstatus.clean_vehicle=1;
    }else{
      this.checkedstatus.clean_vehicle=0;
    }
  }
  vehiclePic(eve){
    if(eve.detail.checked){
      this.checkedstatus.vehicle_pictures=1;
    }else{
      this.checkedstatus.vehicle_pictures=0;
    }
  }
  photosDamage(eve){
    if(eve.detail.checked){
      this.checkedstatus.pictures_of_damage=1;
    }else{
      this.checkedstatus.pictures_of_damage=0;
    }
  }
  windsheilds(eve){
    if(eve.detail.checked){
      this.checkedstatus.windshield_check=1;
    }else{
      this.checkedstatus.windshield_check=0;
    }
  }
  enginelights(eve){
    if(eve.detail.checked){
      this.checkedstatus.engine_light=1;
    }else{
      this.checkedstatus.engine_light=0;
    }
  }
  savecheckup(){
    console.log(this.checkedstatus);
    var jsondata=JSON.stringify(this.checkedstatus);
    this.api.setCheckup(this.vehicleDetails.vehicle_id,jsondata).subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.util.toast("Saved Checkup");
      }
    })
  }
}
