export type Seat = {
    id: number,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    isDelete: boolean,
    allocate_ids: string[],
    color: string,
}