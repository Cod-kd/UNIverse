import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface University {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  // Universities + faculties data
  private readonly universities: University[] = [
    { label: "Állatorvostudományi Egyetem", value: "ÁTE" },
    { label: "Andrássy Gyula Budapesti Német Nyelvű Egyetem", value: "AUB" },
    { label: "Budapesti Corvinus Egyetem", value: "BCE" },
    { label: "Budapesti Gazdasági Egyetem", value: "BGE" },
    { label: "Budapesti Metropolitan Egyetem", value: "METU" },
    { label: "Budapesti Műszaki és Gazdaságtudományi Egyetem", value: "BME" },
    { label: "Debreceni Egyetem", value: "DE" },
    { label: "Debreceni Református Hittudományi Egyetem", value: "DRHE" },
    { label: "Dunaújvárosi Egyetem", value: "DUE" },
    { label: "Edutus Egyetem", value: "EDUTUS" },
    { label: "Eötvös Loránd Tudományegyetem", value: "ELTE" },
    { label: "Eszterházy Károly Katolikus Egyetem", value: "EKKE" },
    { label: "Evangélikus Hittudományi Egyetem", value: "EHE" },
    { label: "Gál Ferenc Egyetem", value: "GFE" },
    { label: "Károli Gáspár Református Egyetem", value: "KRE" },
    { label: "Kodolányi János Egyetem", value: "KJE" },
    { label: "Közép-európai Egyetem", value: "KEE" },
    { label: "Liszt Ferenc Zeneművészeti Egyetem", value: "LFZE" },
    { label: "Magyar Képzőművészeti Egyetem", value: "MKE" },
    { label: "Magyar Táncművészeti Egyetem", value: "MTE" },
    { label: "Milton Friedman Egyetem", value: "MILTON" },
    { label: "Miskolci Egyetem", value: "ME" },
    { label: "Moholy-Nagy Művészeti Egyetem", value: "MOME" },
    { label: "Nemzeti Közszolgálati Egyetem", value: "NKE" },
    { label: "Neumann János Egyetem", value: "NJE" },
    { label: "Nyíregyházi Egyetem", value: "NYE" },
    { label: "Óbudai Egyetem", value: "OE" },
    { label: "Országos Rabbiképző – Zsidó Egyetem", value: "OR-ZSE" },
    { label: "Pannon Egyetem", value: "PE" },
    { label: "Pázmány Péter Katolikus Egyetem", value: "PPKE" },
    { label: "Pécsi Tudományegyetem", value: "PTE" },
    { label: "Semmelweis Egyetem", value: "SE" },
    { label: "Soproni Egyetem", value: "SOE" },
    { label: "Magyar Agrár- és Élettudományi Egyetem", value: "MATE" },
    { label: "Széchenyi István Egyetem", value: "SZE" },
    { label: "Színház- és Filmművészeti Egyetem", value: "SZFE" },
    { label: "Szegedi Tudományegyetem", value: "SZTE" },
    { label: "Tokaj-Hegyalja Egyetem", value: "THE" }
  ];

  private readonly faculties: Record<string, string[]> = {
    'ÁTE': [
      'Állatorvostudományi Kar'
    ],
    'AUB': [
      'Interdiszciplináris Kar'
    ],
    'BCE': [
      'Gazdálkodástudományi Kar',
      'Társadalomtudományi Kar',
      'Közgazdaságtudományi Kar'
    ],
    'BGE': [
      'Kereskedelmi, Vendéglátóipari és Idegenforgalmi Kar',
      'Külkereskedelmi Kar',
      'Pénzügyi és Számviteli Kar'
    ],
    'METU': [
      'Művészeti és Kreatívipari Kar',
      'Üzleti, Kommunikációs és Turisztikai Kar'
    ],
    'BME': [
      'Építészmérnöki Kar',
      'Építőmérnöki Kar',
      'Gépészmérnöki Kar',
      'Közlekedésmérnöki és Járműmérnöki Kar',
      'Természettudományi Kar',
      'Vegyészmérnöki és Biomérnöki Kar',
      'Villamosmérnöki és Informatikai Kar',
      'Gazdaság- és Társadalomtudományi Kar'
    ],
    'DE': [
      'Állam- és Jogtudományi Kar',
      'Általános Orvostudományi Kar',
      'Bölcsészettudományi Kar',
      'Egészségügyi Kar',
      'Fogorvostudományi Kar',
      'Gazdaságtudományi Kar',
      'Gyógyszerésztudományi Kar',
      'Informatikai Kar',
      'Mezőgazdaság-, Élelmiszertudományi és Környezetgazdálkodási Kar',
      'Műszaki Kar',
      'Népegészségügyi Kar',
      'Természettudományi és Technológiai Kar',
      'Zeneművészeti Kar'
    ],
    'DRHE': [
      'Teológiai Kar',
      'Tanítóképzési Kar'
    ],
    'DUE': [
      'Informatikai Kar',
      'Társadalomtudományi Kar',
      'Műszaki Kar'
    ],
    'EDUTUS': [
      'Műszaki Kar',
      'Gazdálkodástudományi Kar'
    ],
    'ELTE': [
      'Állam- és Jogtudományi Kar',
      'Bárczi Gusztáv Gyógypedagógiai Kar',
      'Bölcsészettudományi Kar',
      'Informatikai Kar',
      'Pedagógiai és Pszichológiai Kar',
      'Társadalomtudományi Kar',
      'Természettudományi Kar',
      'Tanító- és Óvóképző Kar'
    ],
    'EKKE': [
      'Bölcsészettudományi és Művészeti Kar',
      'Gazdaság- és Társadalomtudományi Kar',
      'Pedagógiai Kar',
      'Természettudományi Kar'
    ],
    'EHE': [
      'Teológiai Kar'
    ],
    'GFE': [
      'Egészség- és Szociális Tudományi Kar',
      'Gazdasági Kar',
      'Pedagógiai Kar',
      'Teológiai Kar'
    ],
    'KRE': [
      'Állam- és Jogtudományi Kar',
      'Bölcsészet- és Társadalomtudományi Kar',
      'Hittudományi Kar',
      'Pedagógiai Kar',
      'Szociális és Egészségtudományi Kar'
    ],
    'KJE': [
      'Gazdaságtudományi és Menedzsment Kar',
      'Kulturális, Kommunikációs és Turisztikai Kar'
    ],
    'KEE': [
      'Közpolitikai Iskola',
      'Történelem- és Társadalomtudományi Kar',
      'Kognitív Tudományi Tanszék'
    ],
    'LFZE': [
      'Billentyűs és Akkordikus Hangszerek Tanszéke',
      'Egyházzene Tanszék',
      'Ének Tanszék',
      'Fúvós Tanszék',
      'Jazztanszék',
      'Karmester és Kóruskarnagyképző Tanszék',
      'Népzene Tanszék',
      'Vonós Tanszék',
      'Zeneismeret Tanszék',
      'Zenetudományi Tanszék'
    ],
    'MKE': [
      'Képzőművészeti Kar',
      'Művészetelméleti Kar'
    ],
    'MTE': [
      'Táncművész Kar',
      'Koreográfus- és Táncpedagógus Kar'
    ],
    'MILTON': [
      'Gazdaságtudományi Kar',
      'Bölcsészettudományi Kar'
    ],
    'ME': [
      'Állam- és Jogtudományi Kar',
      'Bölcsészettudományi Kar',
      'Egészségügyi Kar',
      'Gépészmérnöki és Informatikai Kar',
      'Gazdaságtudományi Kar',
      'Műszaki Anyagtudományi Kar',
      'Műszaki Földtudományi Kar'
    ],
    'MOME': [
      'Építészeti Intézet',
      'Design Intézet',
      'Média Intézet',
      'Elméleti Intézet'
    ],
    'NKE': [
      'Államtudományi és Nemzetközi Tanulmányok Kar',
      'Hadtudományi és Honvédtisztképző Kar',
      'Rendészettudományi Kar',
      'Víztudományi Kar'
    ],
    'NJE': [
      'Gazdaságtudományi Kar',
      'GAMF Műszaki és Informatikai Kar',
      'Kertészeti és Vidékfejlesztési Kar',
      'Pedagógusképző Kar'
    ],
    'NYE': [
      'Műszaki és Agrártudományi Kar',
      'Pedagógusképző Kar',
      'Gazdasági és Társadalomtudományi Kar'
    ],
    'OE': [
      'Alba Regia Műszaki Kar',
      'Bánki Donát Gépész és Biztonságtechnikai Mérnöki Kar',
      'Kandó Kálmán Villamosmérnöki Kar',
      'Keleti Károly Gazdasági Kar',
      'Neumann János Informatikai Kar',
      'Rejtő Sándor Könnyűipari és Környezetmérnöki Kar',
      'Ybl Miklós Építéstudományi Kar'
    ],
    'OR-ZSE': [
      'Rabbiképző Kar',
      'Zsidó Vallástudományi Kar'
    ],
    'PE': [
      'Gazdaságtudományi Kar',
      'Mérnöki Kar',
      'Modern Filológiai és Társadalomtudományi Kar'
    ],
    'PPKE': [
      'Bölcsészet- és Társadalomtudományi Kar',
      'Információs Technológiai és Bionikai Kar',
      'Jog- és Államtudományi Kar',
      'Hittudományi Kar'
    ],
    'PTE': [
      'Állam- és Jogtudományi Kar',
      'Általános Orvostudományi Kar',
      'Bölcsészet- és Társadalomtudományi Kar',
      'Egészségtudományi Kar',
      'Gyógyszerésztudományi Kar',
      'Közgazdaságtudományi Kar',
      'Kultúratudományi, Pedagógusképző és Vidékfejlesztési Kar',
      'Műszaki és Informatikai Kar',
      'Művészeti Kar',
      'Természettudományi Kar'
    ],
    'SE': [
      'Általános Orvostudományi Kar',
      'Egészségtudományi Kar',
      'Egészségügyi Közszolgálati Kar',
      'Fogorvostudományi Kar',
      'Gyógyszerésztudományi Kar',
      'Pető András Kar'
    ],
    'SOE': [
      'Benedek Elek Pedagógiai Kar',
      'Erdőmérnöki Kar',
      'Faipari Mérnöki és Kreatívipari Kar',
      'Lámfalussy Sándor Közgazdaságtudományi Kar'
    ],
    'MATE': [
      'Agrár- és Élelmiszergazdasági Kar',
      'Erdészeti Kar',
      'Gazdaságtudományi Kar',
      'Kertészettudományi Kar',
      'Környezettudományi Kar',
      'Műszaki és Informatikai Kar'
    ],
    'SZE': [
      'Audi Hungaria Járműmérnöki Kar',
      'Apáczai Csere János Kar',
      'Építész-, Építő- és Közlekedésmérnöki Kar',
      'Gépészmérnöki, Informatikai és Villamosmérnöki Kar',
      'Kautz Gyula Gazdaságtudományi Kar',
      'Mezőgazdaság- és Élelmiszertudományi Kar'
    ],
    'SZFE': [
      'Film- és Médiaintézet',
      'Színházművészeti Intézet'
    ],
    'SZTE': [
      'Állam- és Jogtudományi Kar',
      'Általános Orvostudományi Kar',
      'Bölcsészet- és Társadalomtudományi Kar',
      'Egészségtudományi és Szociális Képzési Kar',
      'Fogorvostudományi Kar',
      'Gazdaságtudományi Kar',
      'Gyógyszerésztudományi Kar',
      'Juhász Gyula Pedagógusképző Kar',
      'Mérnöki Kar',
      'Természettudományi és Informatikai Kar',
      'Zeneművészeti Kar'
    ],
    'THE': [
      'Gazdálkodástudományi Kar',
      'Szőlészeti és Borászati Intézet'
    ]
  };

  private facultiesSubject = new BehaviorSubject<string[]>([]);
  faculties$ = this.facultiesSubject.asObservable();

  getUniversities(): Observable<University[]> {
    return of(this.universities);
  }

  loadFaculties(universityId: string): void {
    this.facultiesSubject.next(this.faculties[universityId] || []);
  }
}