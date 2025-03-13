import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppComponent, User } from '../app.component';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { waitForAsync } from '@angular/core/testing';
import { Console } from 'console';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})

export class MessagesComponent {
  selectedChatId: number = 0;

  chats: any = [];
  messages: any = [];
  selectedMessages: any = [];
  chatNames: any = [];
  messageSendForm: FormGroup<any>;
  contactid: number | null = null;
  displayName: string = "";


  constructor(private fb: FormBuilder, private appComponent: AppComponent, private authService: AuthService, private router: Router,private route: ActivatedRoute) {
      this.messageSendForm = this.fb.group({
        messageInput: ['']
      });
  }

  ngOnInit() {
    this.contactid = Number(this.route.snapshot.paramMap.get('contactid'));
    this.getMessages();
  }

  async getChats() {
    let id = this.appComponent.currentUser.getId();

    // Alle Sender und Empfänger sammeln & doppelte entfernen
    this.chats = Array.from(
      new Set(
        this.messages.flatMap((message: any) =>
          message.senderid == id || message.recieverid == id
            ? [message.senderid, message.recieverid]
            : []
        )
      )
    )
    
    console.log("Chats:", this.chats);
    if (!Number.isNaN(this.contactid)  && !this.chats.includes(this.contactid)) {
      console.log("Contactid: " + this.contactid);	
      this.chats.push(this.contactid);
    }
    
    this.chats.filter((chat: any) => chat !== id);

    // Chat-Namen abrufen mit Promise.all
    this.chatNames = await Promise.all(
      this.chats.map(async (chat: any) => await this.getChatName(chat))
    );
    console.log("Chat names:", this.chatNames);

    if (this.contactid != null) {
      this.chatOnSelected(this.contactid);
      this.contactid = null;
    }
  }


  async getChatName(id: number) {
    try {
      const response = await fetch(`http://localhost:5001/auth/user/${id}`);
      if (!response.ok) throw new Error("Error loading Chats");
      const res = await response.json();
      return { username: res.username, id: id };
    
    } catch (error) {
      console.error("Fetch error:", error);
      return { username: "Error", id: 0 };
    }
  }


  async getMessages() {
    let id = await this.waitForUserId();

    if (id === 0) {
      console.log("idError id: " + id);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/messages/${id}`, {
        method: "GET",
      });

      if (response.ok) {
        this.messages = await response.json();
        console.log("Messages:", this.messages);
        this.messages.forEach((message: any) => {
          if (message.senderid == id) {
            message.class = "sender";
          } else {
            message.class = "reciever";
          }
        });
        this.getChats();
        if (this.selectedChatId != 0) {
          this.chatOnSelected(this.selectedChatId);
        }
      } else {
        console.error("Error loading messages");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  waitForUserId() {
    return new Promise((resolve) => {
      const checkUser = () => {
        const id = this.appComponent.currentUser.getId();
        if (id !== 0) {
          resolve(id);
        } else {
          console.log("Waiting for user id...");
          setTimeout(checkUser, 100); // Warte kurz und versuche es erneut
        }
      };

      checkUser();
    });
  }

  chatOnSelected(chatId: number) {
    this.selectedChatId = chatId;
    this.chatNames.forEach((chat: any) => {
      if (chat.id == chatId) {
        this.displayName = chat.username;
      }
    });

    this.selectedMessages = this.messages.filter(
      (message: any) =>
        message.senderid == chatId || message.recieverid == chatId
    );
    this.selectedMessages.sort((a: any, b: any) => a.messageid - b.messageid);
  }

  async  sendMessage() {
    try {
      console.log("Sending message...");
      console.log("Message:", this.messageSendForm.value["messageInput"]);
      const response = await fetch("http://localhost:5001/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderid: this.appComponent.currentUser.getId(),
          recieverid: this.selectedChatId,
          message: this.messageSendForm.value["messageInput"],
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error sending message: ${data.message || "Unknown error"}`);
      }
  
      console.log("Message sent:", data);
      await this.getMessages();
    } catch (error) {
      console.error(error);
    }
  }

}
