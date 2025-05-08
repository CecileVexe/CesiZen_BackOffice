import { ProgressionType } from "./progression";
import { ResourceType } from "./article";

export interface StepType {
    id: string;
    title: string;
    description: string;
    order: number;
    ressource: ResourceType;
    ressourceId: string;
    progression: ProgressionType[]
}