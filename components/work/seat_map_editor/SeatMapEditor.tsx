"use client"
import Image from "next/image";
import { Stage, Layer, Rect, Group, Transformer, Text } from "react-konva";
import Konva from "konva";
import { Project } from "@/types/main/project";
import { useState, useRef, useEffect } from "react";
import { Seat } from "@/types/main/seat";

type Props = {
    project: Project
    setProject: (objects: Project) => void;
}

export default function SeatMapEditor (props: Props) {
    const project = useState<Project>(props.project);
    const setProject = props.setProject;
    const [tool, setTool] = useState<string>("seat");
    const [dragStartPosition, setDragStartPosition] = useState<{x: number, y:number} | null>(null);
    const [dragRect, setDragRect] = useState<{x:number, y:number, width:number, height:number} | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const shapeRef = useRef<Konva.Transformer | null>(null);
    const trRef = useRef<Konva.Transformer | null>(null);
    const tool_list = [
        {
            "surface_name": "席",
            "object_name": "seat"
        },
        {
            "surface_name": "テクスト",
            "object_name": "text"
        }
    ]

    useEffect(()=>{
        if (selectedId==null || !shapeRef.current){
            return;
        }
        trRef.current?.nodes([shapeRef.current]);
    }, [selectedId, selectedType])

    function handleStageMouseDown (e: Konva.KonvaEventObject<MouseEvent>){
        if (e.target !== e.target.getStage()) return;
        const stage = e.target.getStage();
        const position = stage.getPointerPosition();
        if (!position) return;
        if (tool == "seat"){
            setDragStartPosition({x: position.x, y:position.y})
        }
    }

    function handleStageMouseMove (e: Konva.KonvaEventObject<MouseEvent>){
        if (dragStartPosition == null) return;
        const stage = e.target.getStage();
        if (!stage) return;
        const position = stage.getPointerPosition();
        if (!position) return
        let newDragRect: {x:number,y:number,width:number,height:number} = {x:0,y:0,width:0,height:0};
        if (tool == "seat"){
            if (position.x > dragStartPosition.x){
                newDragRect.x = dragStartPosition.x;
            }else{
                newDragRect.x = position.x
            }
            if (position.y > dragStartPosition.y){
                newDragRect.y = dragStartPosition.y;
            }else{
                newDragRect.y = position.y;
            }
            newDragRect.width = Math.abs(position.x-dragStartPosition.x);
            newDragRect.height = Math.abs(position.y-dragStartPosition.y);
            
        }
        setDragRect(newDragRect);
    }

    function handleStageMouseUp (e: Konva.KonvaEventObject<MouseEvent>){
        if (!dragRect) return;
        if (tool == "seat"){
            let prev_project = props.project;
            const newId = prev_project.seats.length === 0 ? 1 : Math.max(...prev_project.seats.map(seat => seat.id)) + 1;
            setProject({
                ...props.project,
                seats: [
                    ...props.project.seats,
                    {
                        id: newId,
                        name: newId.toString(),
                        x: dragRect.x,
                        y: dragRect.y,
                        width: dragRect.width,
                        height: dragRect.height,
                        allocate_ids: []
                    }
                ]
            });
            setDragRect(null);
            setDragStartPosition(null);
        }
    }
    
    function drawSeat (SeatObject: Seat){
        return (
            <Group key={SeatObject.id}
                    x={SeatObject.x}
                    y={SeatObject.y}
                    width={SeatObject.width}
                    height={SeatObject.height}
                    draggable
                    ref={shapeRef}
                    onDragEnd={(e) => {
                        const node = e.target;

                        const newX = node.x();
                        const newY = node.y();
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        setProject({
                            ...props.project,
                            seats: props.project.seats.map((seat) => {
                                if (seat.id !== SeatObject.id) {
                                    return seat;
                                }

                                return {
                                    ...seat,
                                    x: newX,
                                    y: newY,
                                    width: seat.width * scaleX,
                                    height: seat.height * scaleY
                                };
                            }),
                        });
                    }}

                    onTransformEnd={(e) => {
                        const node = e.target;

                        const newX = node.x();
                        const newY = node.y();
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        setProject({
                            ...props.project,
                            seats: props.project.seats.map((seat) => {
                                if (seat.id !== SeatObject.id) {
                                    return seat;
                                }

                                return {
                                    ...seat,
                                    x: newX,
                                    y: newY,
                                    width: seat.width * scaleX,
                                    height: seat.height * scaleY
                                };
                            }),
                        });
                    }}
                    onClick={(e)=>{
                        setSelectedId(SeatObject.id);
                        trRef.current?.nodes([e.currentTarget]);
                    }}
            >
                <Rect
                    width={SeatObject.width}
                    height={SeatObject.height}
                    fill="blue"
                />
                <Text key={`text-${SeatObject.id}`} text={"席"+String(SeatObject.id)} fontSize={18}/>
            </Group>
        );
    }


    return (
        <div className="space-4 overflow-auto rounded border border-gray-300 bg-gray-50">
            <div>
                {
                    tool_list.map((t)=>{
                        return (
                            <button key={`tool-${t.object_name}`}
                                    onClick={()=>setTool(t.object_name)}
                                    className={tool === t.object_name ? "border bg-blue-900" : "border bg-blue-100"}
                            >{
                                        t.surface_name
                            }</button>
                        )
                    })
                }
            </div>
            <Stage
                width={640}
                height={480}
                onMouseDown={handleStageMouseDown}
                onMouseMove={handleStageMouseMove}
                onMouseUp={handleStageMouseUp}
            >
                <Layer>
                    {props.project.seats.map((seat)=>{return drawSeat(seat)})}
                    {
                        (dragRect != null) ? (
                            <Rect x={dragRect.x} y={dragRect.y} width={dragRect.width} height={dragRect.height} stroke="blue"/>
                        ) : null
                    }
                    <Transformer ref={trRef}/>
                    
                </Layer>
            </Stage>
        </div>
    )
}