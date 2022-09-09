import {
  Component,
  OnInit
} from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    dayType:any="today";
  constructor(
    private utils : UtilsService
  ) {}
  ngOnInit(): void {
  }

}