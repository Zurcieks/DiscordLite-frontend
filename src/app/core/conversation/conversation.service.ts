import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GetConversationResponse } from './conversation.model';

@Service()
export class ConversationService {
  private readonly http = inject(HttpClient);

  getConversations() {
    return this.http.get<GetConversationResponse>(`${environment.apiUrl}/Conversation`);
  }
}
