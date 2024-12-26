import { Component } from '@angular/core';
import { InfoCardComponent } from "./components/info-card/info-card.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MonitorDivComponent } from './components/monitor-div/monitor-div.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MonitorDivComponent, InfoCardComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'UNIverse-dpt';
  infoCards = [
    {
      imageSrc: 'images/calendar.png',
      imageAlt: 'calendar',
      title: 'Egyéni eseménynaptár',
      description: `Hozz létre egyedi naptárat, amelyet a saját eseményeiddel tudsz feltölteni. 
      Adj az adott eseménynek egy időpontot és meg fog jelenni a naptár táblázatában, az adott napon pedig értesítést is kapsz!`
    },
    {
      imageSrc: 'images/book.png',
      imageAlt: 'book',
      title: 'Korrepetálások',
      description: `Külön csoportok és események adnak helyet néhány szakmai korrepetálásnak.
       Szervezz vagy csatlakozz órákhoz, tanuld meg azt, amit órán nem értettél!`
    },
    {
      imageSrc: 'images/heart.png',
      imageAlt: 'heart',
      title: 'Élménydús egyetemi élet',
      description: `Ne csak a tanulásról szóljon az egyetem! 
      Legyen élményekkel és emlékekkel teli az egyetemi életed. 
      Érdeklődj programok iránt amelyeket ismerősök szerveznek!
      Jelenj meg rajtuk, építs kapcsolatokat!`
    },
    {
      imageSrc: 'images/group.png',
      imageAlt: 'group',
      title: 'Csoportok',
      description: `Fedezd fel a csoportokat vagy akár hozz létre egyet!
      Csatlakozz az ismerőseidhez, szervezzetek közös programokat, posztoljatok képeket, kérjétek el az aznapi anyagot!`
    },
  ]
}
