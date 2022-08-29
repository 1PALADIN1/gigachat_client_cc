import { ISessionEntity } from "../../entity/ISessionEntity";
import { IUiController } from "./IUiController";

export interface ISessionController extends IUiController, ISessionEntity {
}