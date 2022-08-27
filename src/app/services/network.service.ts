import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  isConnctedNetwork:boolean=navigator.onLine;
  constructor(
    private network: Network,
    private util:UtilsService
  ) { }
  checkNetworkType(){
   return this.network.type;
  }
  watchNetwork(){
          // watch network for a disconnection
          this.network.onDisconnect().subscribe((res) => {
          this.isConnctedNetwork=false;
          setTimeout(() => {
          this.util.toast('Network disconnected');
          }, 1000);
          });
          this.network.onConnect().subscribe((net) => {
          setTimeout(() => {
          this.isConnctedNetwork=true;
          this.util.toast("Network connected");
          }, 1000);
          });
          this.network.onChange().subscribe((channge:any)=>{
          })
  }
}
