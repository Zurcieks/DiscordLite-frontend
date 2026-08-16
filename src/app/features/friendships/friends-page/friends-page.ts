import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FriendshipService } from '../../../core/friendship/friendship.service';
import { FriendRequestDto, FriendshipDto } from '../../../core/friendship/friendship.models';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../../core/http/api-error';

type FriendsTab = 'online' | 'all' | 'pending' | 'add';
type AddFriendData = {
  username: string;
};

@Component({
  selector: 'app-friends-page',
  imports: [FormField],
  templateUrl: './friends-page.html',
  styleUrl: './friends-page.css',
})
export class FriendsPage implements OnInit {
  private readonly friendshipService = inject(FriendshipService);
  private readonly _friends = signal<FriendshipDto[]>([]);
  protected readonly friends = this._friends.asReadonly();
  protected readonly searchQuery = signal<string>('');
  protected readonly activeTab = signal<FriendsTab>('all');
  protected readonly filteredFriends = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.friends();
    }
    return this.friends().filter((friend) => friend.username.toLowerCase().includes(query));
  });
  protected readonly incomingRequests = signal<FriendRequestDto[]>([]);
  protected readonly outgoingRequests = signal<FriendRequestDto[]>([]);
  protected readonly addFriendData = signal<AddFriendData>({
    username: '',
  });
  private readonly _addFriendSuccess = signal<string | null>(null);
  protected readonly addFriendSuccess = this._addFriendSuccess.asReadonly();

  protected readonly addFriendForm = form(this.addFriendData, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required.' });
  });

  ngOnInit() {
    this.loadFriends();
  }

  loadFriends() {
    this.friendshipService.getFriends().subscribe({
      next: (response) => {
        this._friends.set(response.friends);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openPending() {
    this.activeTab.set('pending');
    this.loadFriendRequests();
  }

  loadFriendRequests() {
    this.friendshipService.getFriendRequests().subscribe({
      next: (response) => {
        this.incomingRequests.set(response.incoming);
        this.outgoingRequests.set(response.outgoing);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  acceptRequest(friendshipId: string) {
    this.friendshipService.acceptFriendRequest(friendshipId).subscribe({
      next: () => {
        this.incomingRequests.update((current) =>
          current.filter((request) => request.friendshipId !== friendshipId),
        );
        this.loadFriends();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  rejectRequest(friendshipId: string) {
    this.friendshipService.rejectFriendRequest(friendshipId).subscribe({
      next: () => {
        this.incomingRequests.update((current) =>
          current.filter((request) => request.friendshipId !== friendshipId),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  cancelRequest(friendshipId: string) {
    this.friendshipService.cancelFriendRequest(friendshipId).subscribe({
      next: () => {
        this.outgoingRequests.update((current) =>
          current.filter((request) => request.friendshipId !== friendshipId),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;

    this.searchQuery.set(input.value);
  }
  deleteFriend(friendshipId: string) {
    this.friendshipService.deleteFriend(friendshipId).subscribe({
      next: () => {
        this._friends.update((current) =>
          current.filter((friend) => friend.friendshipId !== friendshipId),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onAddFriendSubmit(event: SubmitEvent) {
    event.preventDefault();
    submit(this.addFriendForm, async () => {
      this._addFriendSuccess.set(null);
      const data = this.addFriendData();

      const request: AddFriendData = {
        username: data.username,
      };
      try {
        const response = await firstValueFrom(this.friendshipService.addFriend(request));
        this._addFriendSuccess.set(response.message);
        return null;
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          const apiError = error.error as ApiError;
          switch (apiError.code) {
            case 'FRIENDSHIP_USER_NOT_FOUND':
            case 'FRIENDSHIP_REQUEST_ALREADY_SENT':
            case 'FRIENDSHIP_PENDING_REQUEST_EXISTS':
            case 'FRIENDSHIP_ALREADY_EXISTS':
            case 'FRIENDSHIP_SELF_REQUEST':
              return {
                fieldTree: this.addFriendForm.username,
                kind: 'server',
                message: apiError.detail,
              };
          }
        }

        return {
          kind: 'server',
          message: 'Something went wrong',
        };
      }
    });
  }
}
