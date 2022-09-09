import {
  Component,
  OnInit
} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  dayType:any="yesterday";
  constructor(
    private utils : UtilsService
  ) {
     
  }
  ngOnInit(): void {
  
  }

}