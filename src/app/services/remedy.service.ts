import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Remedy } from '../models/remedy';
import { LocalNotificationsService } from './local-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class RemedyService {
  private key = 'remedies';

  remediesSubject = new BehaviorSubject<Remedy[]>([]);
  remedies$: Observable<Remedy[]> = this.remediesSubject.asObservable();

  // Injeta o serviço de armazenamento
  constructor(
    private storage: Storage,
    private localNotificationsService: LocalNotificationsService
  ) {
    this.init();
  }

  // Inicializa o armazenamento
  async init() {
    await this.storage.create();
    this.remediesSubject.next(await this.getAll() || []);
  }

  /**
   * Define a lista de remédios no armazenamento
   * @param remedyList Lista de remédios
   */
  private async set(remedyList: Remedy[]): Promise<void> {
    for (const remedy of remedyList) {
      await this.localNotificationsService.set(remedy.notifications);
    }

    await this.storage.set(this.key, remedyList); // Salva a lista de remédios no armazenamento
    this.remediesSubject.next(remedyList); // Atualiza o BehaviorSubject
  }

  /**
   * Adiciona um remédio ao armazenamento (concatenando com os itens já existentes)
   * @param remedy Remédio a ser adicionado
   */
  async push(remedy: Remedy): Promise<void> {
    let remedies = await this.getAll() || [];

    remedy.notifications = await this.localNotificationsService.calculateNotifications(remedy);
    remedies.push(remedy);

    await this.set(remedies);
  }

  /**
    * Atualiza um remédio no armazenamento
   * @param remedy Remédio a ser atualizado
   */
  async update(remedy: Remedy): Promise<void> {
    let remedies = await this.getAll() || [];
    remedies = remedies.filter(rmd => rmd.id != remedy.id);
    remedies.push(remedy);

    await this.localNotificationsService.removeByRemedy(remedy);
    await this.localNotificationsService.set(remedy.notifications);

    await this.storage.set(this.key, remedies); // Salva a lista de remédios no armazenamento
    this.remediesSubject.next(remedies); // Atualiza o BehaviorSubject
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
    let remedies = await this.getAll() || [];
    remedies = remedies.filter(rmd => rmd.id != remedy.id);
    this.localNotificationsService.removeByRemedy(remedy);
    await this.set(remedies);
  }

  /**
   * Pega um remédio pelo id
   */
  async getById(id: number): Promise<Remedy | undefined> {
    const all = await this.getAll();
    return all.find(remedy => remedy.id == id);
  }
}
