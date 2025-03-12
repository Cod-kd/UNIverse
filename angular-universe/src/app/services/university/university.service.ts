import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { University, FacultyOption, universities, faculties } from '../../models/uni-faculty/uni-faculty.model';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private facultiesSubject = new BehaviorSubject<FacultyOption[]>([]);
  faculties$ = this.facultiesSubject.asObservable();

  getUniversityName(code: string): string {
    const university = universities.find(u => u.value === code);
    return university?.label || code;
  }

  getFacultyList(universityCode: string): string[] {
    return faculties[universityCode] || [];
  }

  isFacultyValid(universityCode: string, facultyName: string): boolean {
    const facultiesList = faculties[universityCode] || [];
    return facultiesList.includes(facultyName);
  }

  getUniversities(): Observable<University[]> {
    return of(universities);
  }

  getFacultyNameByAbbreviation(universityCode: string, abbreviation: string): string {
    const facultiesList = faculties[universityCode] || [];
    return facultiesList.find(faculty =>
      this.generateAbbreviation(faculty) === abbreviation
    ) || abbreviation;
  }

  private generateAbbreviation(facultyName: string): string {
    return facultyName
      .split(' ')
      .map(word => word.match(/^[A-ZÁÉÍÓÖŐÚÜŰ]/)?.[0] || '')
      .join('');
  }

  loadFaculties(universityId: string): void {
    const facultyList = (faculties[universityId] || []).map(faculty => ({
      label: faculty,
      value: this.generateAbbreviation(faculty)
    }));

    this.facultiesSubject.next(facultyList);
  }
}