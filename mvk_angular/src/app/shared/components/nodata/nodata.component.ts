import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nodata',
  templateUrl: './nodata.component.html',
  styleUrls: ['./nodata.component.scss']
})
export class NodataComponent {

  @Input() errorMsg = '';
}
