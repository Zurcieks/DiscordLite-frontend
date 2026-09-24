import { Component, inject, signal, OnInit } from '@angular/core';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { ConversationDto } from '../../../core/conversation/conversation.model';
import { PresenceService } from '../../../core/presence/presence.service';
import { UserPanel } from '../user-panel/user-panel';

@Component({
  selector: 'app-dm-sidebar',
  imports: [UserPanel],
  templateUrl: './dm-sidebar.html',
  styleUrl: './dm-sidebar.css',
})
export class DmSidebar implements OnInit {
  private readonly conversationService = inject(ConversationService);
  protected readonly presenceService = inject(PresenceService);
  private readonly _conversations = signal<ConversationDto[]>([]);
  protected readonly conversations = this._conversations.asReadonly();
  protected readonly isModalOpen = signal(false);

  ngOnInit() {
    this.loadConversations();
  }

  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
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
