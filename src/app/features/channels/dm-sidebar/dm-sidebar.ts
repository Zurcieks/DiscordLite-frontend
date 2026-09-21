import { Component, inject, signal, OnInit } from '@angular/core';

import { ConversationService } from '../../../core/conversation/conversation.model';
import { ConversationDto } from '../../../core/conversation/conversation.service';

@Component({
  selector: 'app-dm-sidebar',
  imports: [],
  templateUrl: './dm-sidebar.html',
  styleUrl: './dm-sidebar.css',
})
export class DmSidebar implements OnInit {
  private readonly conversationService = inject(ConversationService);
  private readonly _conversations = signal<ConversationDto[]>([]);
  protected readonly conversations = this._conversations.asReadonly();

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    this.conversationService.getConversations().subscribe({
      next: (response) => {
        this._conversations.set(response.conversations);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
