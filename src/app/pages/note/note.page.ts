import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  vehicleDetails: any;
  GetNotesVehicle: any;
  vehicleForOffline: any;
  vehcileArray: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController,
    private storage:StorageService,
    private network:NetworkService
  ) { 
    this.active.queryParams.subscribe((res:any)=>{
      this.vehicleDetails=res.data;
      this.api.isupdateData.subscribe(_isLogin=>{
        this.getvehicleNotes(this.vehicleDetails.vehicle_id);
      });
  
    })
  }

  ngOnInit() {
  }
  getvehicleNotes(id){
    if(this.network.isConnctedNetwork){
      this.api.getNotes(id).subscribe((res:any)=>{
        if(res){
          this.GetNotesVehicle=res;
          this.vehicleForOffline=res;
          this.vehicleForOffline.vehicle_id=id;
          this.vehcileArray.push(this.vehicleForOffline)
          this.storage.setObject("vehicleNotesOffline",this.vehcileArray).then((res)=>{
    
          })
        }
      })
    }else{
      this.storage.getObject('vehicleNotesOffline').then((res)=>{
        if(res){
          let arrdata=res;
        let x =arrdata.filter((a)=>a.vehicle_id === id);
         this.GetNotesVehicle=x[0];
        }
      })
    }
  }
  editNote(){
    this.nav.navigateForward("/note-save",{queryParams:{vehicleDetails:this.vehicleDetails,GetNotesVehicle:this.GetNotesVehicle}})
  }
}
