"use client"
import Image from "next/image";
import { Stage, Layer, Rect, Group, Transformer, Text } from "react-konva";
import Konva from "konva";
import { Project } from "@/types/main/project";
import { Object } from "@/types/main/object";
import { useState, useRef, useEffect } from "react";
import { Seat } from "@/types/main/seat";

type Props = {
    project: Project
    setProject: (objects: Project) => void;
}

export default function SeatMapEditor (props: Props) {
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
        setSelectedId(null);
        setSelectedType(null);
        trRef.current?.nodes([]);

        const stage = e.target.getStage();
        const position = stage.getPointerPosition();
        if (!position) return;
        if (tool == "seat"){
            setDragStartPosition({x: position.x, y:position.y})
        }
        if (tool=="text"){
            const text = window.prompt();
            if (!text) return;
            const prev_project = props.project;
            const newId = prev_project.objects.length === 0 ? 1 : Math.max(...prev_project.objects.map(seat => seat.id)) + 1;
            setProject({
                ...prev_project,
                objects: [
                    ...props.project.objects,
                    {
                        id: newId,
                        text,
                        type: "text",
                        x: position.x,
                        y: position.y,
                        font_size: 16,
                        width: null,
                        height: null,
                        isDelete: false,
                    }
                ]
            })
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
                        allocate_ids: [],
                        isDelete: false,
                    }
                ]
            });
            setDragRect(null);
            setDragStartPosition(null);
        }
    }
    
    function drawSeat (SeatObject: Seat){
        if (SeatObject.isDelete) return null;
            return (
                <Group key={`seat-${SeatObject.id}`}
                        x={SeatObject.x}
                        y={SeatObject.y}
                        width={SeatObject.width}
                        height={SeatObject.height}
                        draggable
                        ref={selectedId === SeatObject.id && selectedType === "seat" ? shapeRef : null}
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
                            setSelectedType("seat");
                            trRef.current?.nodes([e.currentTarget]);
                        }}
                >
                    <Rect
                        width={SeatObject.width}
                        height={SeatObject.height}
                        fill={SeatObject.color || "blue"}
                    />
                    <Text key={`text-${SeatObject.id}`} text={SeatObject.name || "席"+String(SeatObject.id)} fontSize={18}/>
                </Group>
            );
    }

    function drawObject(object: Object) {
        if (object.isDelete) return null;
        return (
            <Group
                key={`object-${object.id}`}
                x={object.x}
                y={object.y}
                draggable
                ref={selectedId === object.id && selectedType === "text" ? shapeRef : null}
                onClick={(e) => {
                    setSelectedId(object.id);
                    setSelectedType("text");
                    trRef.current?.nodes([e.currentTarget]);
                }}
                onDragEnd={(e) => {
                    const node = e.currentTarget;
                    setProject({
                        ...props.project,
                        objects: props.project.objects.map((obj) => {
                            if (obj.id !== object.id) {
                                return obj;
                            }
                            return {
                                ...obj,
                                x: node.x(),
                                y: node.y(),
                            };
                        }),
                    });
                }}
            >
                <Text
                    text={object.text}
                    fontSize={object.font_size}
                />
            </Group>
        );
    }

    // 選択中のオブジェクトを取得
    const selectedSeat = selectedType === "seat" ? props.project.seats.find(s => s.id === selectedId) : null;
    const selectedObj = selectedType === "text" ? props.project.objects.find(o => o.id === selectedId) : null;

    // 削除処理用ハンドラー
    const handleDelete = () => {
        if (selectedId === null || selectedType === null) return;

        if (selectedType === "seat") {
            setProject({
                ...props.project,
                seats: props.project.seats.map(s => s.id === selectedId ? { ...s, isDelete: true } : s)
            });
        } else if (selectedType === "text") {
            setProject({
                ...props.project,
                objects: props.project.objects.map(o => o.id === selectedId ? { ...o, isDelete: true } : o)
            });
        }

        // 削除後に選択状態をクリア
        setSelectedId(null);
        setSelectedType(null);
        trRef.current?.nodes([]);
    };

    return (
        <div className="space-y-4 p-4 overflow-auto rounded border border-gray-300 bg-gray-50">
            <div>
                {selectedId !== null ? (
                    <div className="p-4 space-y-2 border border-gray-300 bg-white rounded shadow">
                        <p className="font-bold text-sm text-gray-700">色・名称編集フォーム</p>
                        
                        {selectedType === "seat" && selectedSeat && (
                            <div className="flex gap-4 items-center flex-wrap">
                                <div>
                                    <label className="text-xs text-gray-500 block">席名称</label>
                                    <input 
                                        type="text" 
                                        value={selectedSeat.name} 
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            setProject({
                                                ...props.project,
                                                seats: props.project.seats.map(s => s.id === selectedSeat.id ? {...s, name: newName} : s)
                                            });
                                        }}
                                        className="border px-2 py-1 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block">色</label>
                                    <select 
                                        value={selectedSeat.color || "blue"}
                                        onChange={(e) => {
                                            const newColor = e.target.value;
                                            setProject({
                                                ...props.project,
                                                seats: props.project.seats.map(s => s.id === selectedSeat.id ? {...s, color: newColor} : s)
                                            });
                                        }}
                                        className="border px-2 py-1 rounded text-sm"
                                    >
                                        <option value="blue">青</option>
                                        <option value="red">赤</option>
                                        <option value="green">緑</option>
                                        <option value="orange">オレンジ</option>
                                    </select>
                                </div>
                                <div className="ml-auto self-end">
                                    <button 
                                        onClick={handleDelete}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedType === "text" && selectedObj && (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-xs text-gray-500 block">テキスト内容</label>
                                    <input 
                                        type="text" 
                                        value={selectedObj.text} 
                                        onChange={(e) => {
                                            const newText = e.target.value;
                                            setProject({
                                                ...props.project,
                                                objects: props.project.objects.map(o => o.id === selectedObj.id ? {...o, text: newText} : o)
                                            });
                                        }}
                                        className="border px-2 py-1 rounded text-sm w-full"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={handleDelete}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
            
            <div className="flex gap-2">
                {
                    tool_list.map((t)=>{
                        return (
                            <button key={`tool-${t.object_name}`}
                                    onClick={()=>setTool(t.object_name)}
                                    className={`px-3 py-1 rounded ${tool === t.object_name ? "border bg-blue-900 text-white" : "border bg-blue-100 text-black"}`}
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
                className="border bg-white rounded shadow"
            >
                <Layer>
                    {props.project.seats.map((seat)=>{return drawSeat(seat)})}
                    {props.project.objects.map((object)=>{return drawObject(object)})}
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