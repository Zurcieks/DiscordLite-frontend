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

  uploadAvatar(file: File) {
    const body = new FormData();
    body.append('file', file);

    return this.http.post<{ avatarUrl: string | null }>(
      `${environment.apiUrl}/user/me/avatar`,
      body,
    );
  }
}
