import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Remedy } from '../models/remedy';
import { LocalNotificationsService } from './local-notifications.service';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemedyService {
  storage!: Storage;
  private key = 'remedies';

  remediesSubject = new BehaviorSubject<Remedy[]>([]);
  remedies$: Observable<Remedy[]> = this.remediesSubject.asObservable();

  // Injeta o serviço de armazenamento
  constructor(
    private storageService: StorageService,
    private localNotificationsService: LocalNotificationsService
  ) {
    this.init();
  }

  // Inicializa o armazenamento
  async init() {
    this.storage = await this.storageService.get();
    this.remediesSubject.next(await this.getAll() || []);
  }

  /**
   * Define a lista de remédios no armazenamento
   * @param remedyList Lista de remédios
   */
  private async set(remedyList: any): Promise<void> {
    await this.storage.set(this.key, remedyList);
    this.remediesSubject.next(remedyList);
  }

  /**
   * Adiciona um remédio ao armazenamento (concatenando com os itens já existentes)
   * @param remedy Remédio a ser adicionado
   */
  async push(remedy: any): Promise<void> {
    let items = await this.getAll() || [];
    items.push(remedy);
    await this.set(items);
    this.localNotificationsService.setByRemedy(remedy);

    this.remediesSubject.next(items);
  }

  async update(remedy: Remedy): Promise<void> {
    let items = await this.getAll() || [];
    let index = items.findIndex(r => r.id == remedy.id);
    items[index] = remedy;
    await this.set(items);

    this.remediesSubject.next(items);
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
    await this.localNotificationsService.removeAll();
    this.remediesSubject.next([]);
  }

  /**
   * Remove um remédio do armazenamento
   * @param remedy Remédio a ser removido
   */
  async removeByRemedy(remedy: Remedy): Promise<void> {
    let items = await this.getAll() || [];
    let index = items.findIndex(r => r.id == remedy.id);
    items.splice(index, 1);
    await this.set(items);

    // Remove as notificações
    this.localNotificationsService.removeByRemedy(remedy);

    this.remediesSubject.next(items);
  }

  /**
   * Pega um remédio pelo id
   */
  async getById(id: number): Promise<Remedy | undefined> {
    const all = await this.getAll();
    return all.find(remedy => remedy.id == id);
  }
}
