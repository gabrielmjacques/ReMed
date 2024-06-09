import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage';

type PrefKey = "isIntroductionDone";

@Injectable({
  providedIn: 'root'
})
export class PrefsService {
  storage!: Storage;

  // Injeta o serviço de armazenamento
  constructor(private storageService: StorageService) {
    this.init();
  }

  async init() {
    this.storage = await this.storageService.get();
  }

  /**
   * Salva a preferência
   * @param key Chave da preferência
  */
  async savePref(key: PrefKey, value: any) {
    await this.storage.set(key.toString(), value);
  }

  /**
   * Recupera o valor da preferência
   * @param key Chave da preferência
   * @returns Valor da preferência
  */
  async getPref(key: PrefKey) {
    if (!this.storage)
      await this.init();

    return await this.storage.get(key.toString());
  }
}
