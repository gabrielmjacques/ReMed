import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  isInitialized = false;

  constructor(private storage: Storage) { }

  async init() {
    await this.storage.create();
    this.isInitialized = true;
  }

  async get() {
    if (!this.isInitialized) await this.init();
    return this.storage;
  }

  async clear() {
    if (!this.isInitialized) await this.init();
    await this.storage.clear();
  }
}
