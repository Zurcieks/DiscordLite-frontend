import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  AddFriendRequest,
  AddFriendResponse,
  GetAllFriendsResponse,
  GetFriendRequestsResponse,
} from './friendship.models';
import { environment } from '../../../environments/environment';

@Service()
export class FriendshipService {
  private readonly http = inject(HttpClient);

  addFriend(request: AddFriendRequest) {
    return this.http.post<AddFriendResponse>(`${environment.apiUrl}/Friendship`, request);
  }

  getFriends() {
    return this.http.get<GetAllFriendsResponse>(`${environment.apiUrl}/Friendship`);
  }

  getFriendRequests() {
    return this.http.get<GetFriendRequestsResponse>(`${environment.apiUrl}/Friendship/requests`);
  }
  acceptFriendRequest(friendshipId: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/Friendship/requests/${friendshipId}/accept`,
      null,
    );
  }
  rejectFriendRequest(friendshipId: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/Friendship/requests/${friendshipId}/reject`,
      null,
    );
  }
  cancelFriendRequest(friendshipId: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/Friendship/requests/${friendshipId}/cancel`,
      null,
    );
  }

  deleteFriend(friendshipId: string) {
    return this.http.delete<void>(`${environment.apiUrl}/Friendship/${friendshipId}/`);
  }
}
