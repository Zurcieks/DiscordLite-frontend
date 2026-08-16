import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { UserProfile } from './user.models';
import { environment } from '../../../environments/environment';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);

  getMyProfile() {
    return this.http.get<UserProfile>(`${environment.apiUrl}/user/me`);
  }
}
