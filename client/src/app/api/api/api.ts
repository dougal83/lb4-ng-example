export * from './pingController.service';
import { PingControllerService } from './pingController.service';
export * from './todoController.service';
import { TodoControllerService } from './todoController.service';
export const APIS = [PingControllerService, TodoControllerService];
