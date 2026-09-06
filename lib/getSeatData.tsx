import { Project } from "../types/main/project";
import { Seat } from "../types/main/seat";

export default function getParticipantData(project: Project, seatId: number): Seat | undefined {
    return project.seats.find((seat) => seat.id === seatId);
}