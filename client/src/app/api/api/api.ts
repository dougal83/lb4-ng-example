export * from './pingController.service';
import { PingControllerService } from './pingController.service';
export * from './todoController.service';
import { TodoControllerService } from './todoController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [PingControllerService, TodoControllerService, UserControllerService];
