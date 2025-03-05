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

  loadFaculties(universityId: string): void {
    const facultyList = (faculties[universityId] || []).map(faculty => ({
      label: faculty,
      value: faculty
    }));
    this.facultiesSubject.next(facultyList);
  }
}
