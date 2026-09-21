import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { GetConversationResponse } from './conversation.service';
import { environment } from '../../../environments/environment';

@Service()
export class ConversationService {
  private readonly http = inject(HttpClient);

  getConversations() {
    return this.http.get<GetConversationResponse>(`${environment.apiUrl}/Conversation`);
  }
}
