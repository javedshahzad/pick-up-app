import {
  Component,
  OnInit
} from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  dayType:any="tomorrow";
  constructor(
    private utils : UtilsService
  ) {
   
  }
  ngOnInit(): void {
  
  }
  
}