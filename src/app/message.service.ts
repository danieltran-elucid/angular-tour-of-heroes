import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// The service exposes its cache of messages and two methods: One to add() a message to the cache and another to clear() the cache.
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
