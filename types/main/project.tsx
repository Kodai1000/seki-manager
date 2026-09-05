import { Seat } from "./seat";
import { Participant } from "./participant";
import { Object } from "./object";
import { Attribute } from "./attribute";
import { Condition } from "./condition";

export type Project = {
    seats: Seat[],
    participants: Participant[],
    objects: Object[],
    attributes: Attribute[],
    conditions: Condition[]
}