import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemedyService {
  private key = 'remedies';

  // Injeta o serviço de armazenamento
  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa o serviço de armazenamento
  async init() {
    await this.storage.create();
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

  /**
   * Obtém a lista de remédios do armazenamento
   * @returns Lista de remédios
   */
  async getAll(): Promise<any> {
    return await this.storage.get(this.key);
  }

  /**
   * Remove todos os remédios do armazenamento
   */
  async removeAll(): Promise<void> {
    await this.storage.remove(this.key);
  }
}
