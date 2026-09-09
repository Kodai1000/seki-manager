import { Seat } from "./seat";
import { Participant } from "./participant";
import { Object } from "./object";
import { Condition } from "./condition";

export type Project = {
    seats: Seat[],
    participants: Participant[],
    objects: Object[],
    conditions: Condition[]
}