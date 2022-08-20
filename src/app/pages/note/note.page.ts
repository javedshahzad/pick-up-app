import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  vehicleDetails: any;
  GetNotesVehicle: any;

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController
  ) { 
    this.active.queryParams.subscribe((res:any)=>{
      console.log(res.data);
      this.vehicleDetails=res.data;
      this.api.isupdateData.subscribe(_isLogin=>{
        this.getvehicleNotes(this.vehicleDetails.vehicle_id);
      });
  
    })
  }

  ngOnInit() {
  }
  getvehicleNotes(id){
    console.log(id)
    this.api.getNotes(id).subscribe((res:any)=>{
      console.log(res);
      this.GetNotesVehicle=res;
    })
  }
  editNote(){
    this.nav.navigateForward("/note-save",{queryParams:{vehicleDetails:this.vehicleDetails,GetNotesVehicle:this.GetNotesVehicle}})
  }
}
