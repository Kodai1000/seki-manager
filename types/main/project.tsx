import { Seat } from "./seat"
import { Participant } from "./participant"
import { Text } from "./text"

export type Project = {
    seats: Seat[],
    participants: Participant[],
    texts: Text[]
}