import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Remedy } from '../models/remedy';

@Injectable({
  providedIn: 'root'
})
export class RemedyService {
  storage!: Storage;
  private key = 'remedies';

  // Injeta o serviço de armazenamento
  constructor(private storageService: StorageService) {
    this.init();
  }

  // Inicializa o armazenamento
  async init() {
    this.storage = await this.storageService.get();
  }

  /**
   * Define a lista de remédios no armazenamento
   * @param remedyList Lista de remédios
   */
  private async set(remedyList: any): Promise<void> {
    await this.storage.set(this.key, remedyList);
  }

  /**
   * Adiciona um remédio ao armazenamento (concatenando com os itens já existentes)
   * @param remedy Remédio a ser adicionado
   */
  async push(remedy: any): Promise<void> {
    let items = await this.getAll() || [];
    items.push(remedy);
    await this.set(items);
  }

  async update(remedy: Remedy): Promise<void> {
    let items = await this.getAll() || [];
    let index = items.findIndex(r => r.id == remedy.id);
    items[index] = remedy;
    await this.set(items);
  }

  /**
   * Obtém a lista de remédios do armazenamento
   * @returns Lista de remédios
   */
  async getAll(): Promise<Remedy[]> {
    return await this.storage.get(this.key);
  }

  /**
   * Remove todos os remédios do armazenamento
   */
  async removeAll(): Promise<void> {
    await this.storage.remove(this.key);
  }

  /**
   * Pega um remédio pelo id
   */
  async getById(id: number): Promise<Remedy | undefined> {
    const all = await this.getAll();
    return all.find(remedy => remedy.id == id);
  }
}
