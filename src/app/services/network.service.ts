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
  watchNetwork(){
          // watch network for a disconnection
          this.network.onDisconnect().subscribe((res) => {
          this.isConnctedNetwork=false;
          setTimeout(() => {
          this.util.toast('Network disconnected');
          }, 3000);
          console.log(res,'Network disconnected!');
          });
          // watch network for a connection
          this.network.onConnect().subscribe((net) => {

          console.log(net,'network connected!');
          // We just got a connection but we need to wait briefly
          // before we determine the connection type. Might need to wait.
          // prior to doing any api requests as well.
          setTimeout(() => {
          console.log('We got a connection, woohoo!');
          this.isConnctedNetwork=true;
          this.util.toast("Network connected");
          }, 3000);
          });
          this.network.onChange().subscribe((channge:any)=>{
          console.log(channge)
          })
  }
}
