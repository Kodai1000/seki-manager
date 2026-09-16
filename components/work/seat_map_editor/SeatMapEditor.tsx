"use client"
import { Stage, Layer, Rect, Group, Transformer, Text } from "react-konva";
import Konva from "konva";
import { Project } from "@/types/main/project";
import { Object } from "@/types/main/object";
import { useState, useRef, useEffect } from "react";
import { Seat } from "@/types/main/seat";
import getParticipantData from "@/lib/getParticipantData";
import { seat_colors } from "@/data/seat_colors";

type Props = {
    project: Project
    setProject: (objects: Project) => void;
}

const MIN_SEAT_WIDTH = 24;
const MIN_SEAT_HEIGHT = 24;

export default function SeatMapEditor (props: Props) {
    const setProject = props.setProject;
    const [tool, setTool] = useState<string>("seat");
    const [dragStartPosition, setDragStartPosition] = useState<{x: number, y:number} | null>(null);
    const [dragRect, setDragRect] = useState<{x:number, y:number, width:number, height:number} | null>(null);
    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    
    // Stage用のref
    const stageRef = useRef<Konva.Stage | null>(null);
    const shapeRef = useRef<Konva.Group | null>(null);
    const trRef = useRef<Konva.Transformer | null>(null);

    // seat_colorsを元にツールリストを動的に生成する
    const tool_list = [
        ...seat_colors.map((sc) => ({
            surface_name: `席 (${sc.name})`,
            object_name: `seat_${sc.color}`,
            color: sc.color
        })),
        {
            surface_name: "テクスト",
            object_name: "text",
            color: null
        }
    ];

    useEffect(()=>{
        if (selectedId == null || !shapeRef.current){
            return;
        }
        trRef.current?.nodes([shapeRef.current]);
    }, [selectedId, selectedType])

    // 指定IDの席を削除する関数
    const handleDeleteSeat = (seatId: number) => {
        setProject({
            ...props.project,
            seats: props.project.seats.filter((seat)=>seat.id !== seatId)
        });

        if (selectedId === seatId && selectedType === "seat") {
            setSelectedId(null);
            setSelectedType(null);
            trRef.current?.nodes([]);
        }
    };

    // 指定IDのテキストオブジェクトを削除する関数
    const handleDeleteText = (textId: string | number) => {
        setProject({
            ...props.project,
            objects: props.project.objects.filter((object)=>object.id !== textId)
        });

        if (selectedId === textId && selectedType === "text") {
            setSelectedId(null);
            setSelectedType(null);
            trRef.current?.nodes([]);
        }
    };

    // 現在選択中の座席または要素を削除する関数
    const handleDeleteSelectedElement = () => {
        if (selectedId === null || selectedType === null) return;

        if (selectedType === "seat" && typeof selectedId === "number") {
            handleDeleteSeat(selectedId);
        } else if (selectedType === "text") {
            handleDeleteText(selectedId);
        }
    };

    // 画像として保存する関数
    const handleSaveImage = () => {
        if (!stageRef.current) return;

        // 一時的にTransformerの選択を解除して綺麗な画像にする
        const currentNodes = trRef.current?.nodes();
        trRef.current?.nodes([]);

        // StageをDataURLに変換（PNG形式）
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });

        // Transformerの選択を復元
        if (currentNodes && trRef.current) {
            trRef.current.nodes(currentNodes);
        }

        // ダウンロード用のリンクを生成してクリック
        const link = document.createElement("a");
        link.download = `seat-map.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function handleStageMouseDown (e: Konva.KonvaEventObject<MouseEvent>){
        if (e.target !== e.target.getStage()) return;
        setSelectedId(null);
        setSelectedType(null);
        trRef.current?.nodes([]);

        const stage = e.target.getStage();
        const position = stage.getPointerPosition();
        if (!position) return;
        
        if (tool.startsWith("seat")){
            setDragStartPosition({x: position.x, y:position.y})
        }
        if (tool=="text"){
            const text = window.prompt();
            if (!text) return;
            const prev_project = props.project;
            setProject({
                ...prev_project,
                objects: [
                    ...props.project.objects,
                    {
                        id: crypto.randomUUID(),
                        text,
                        type: "text",
                        x: position.x,
                        y: position.y,
                        font_size: 16,
                        width: null,
                        height: null,
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
        setDragRect({
            x: Math.min(dragStartPosition.x, position.x),
            y: Math.min(dragStartPosition.y, position.y),
            width: Math.abs(position.x - dragStartPosition.x),
            height: Math.abs(position.y - dragStartPosition.y),
        });
    }

    function handleStageMouseUp (e: Konva.KonvaEventObject<MouseEvent>){
        const stage = e.target.getStage();
        const position = stage?.getPointerPosition();
        const startPosition = dragStartPosition;

        // 短いドラッグやクリックの後にも作成開始状態を残さない
        setDragRect(null);
        setDragStartPosition(null);

        if (tool.startsWith("seat") && startPosition && position){
            const completedDragRect = {
                x: Math.min(startPosition.x, position.x),
                y: Math.min(startPosition.y, position.y),
                width: Math.abs(position.x - startPosition.x),
                height: Math.abs(position.y - startPosition.y),
            };

            if (
                completedDragRect.width < MIN_SEAT_WIDTH ||
                completedDragRect.height < MIN_SEAT_HEIGHT
            ) {
                return;
            }

            const prev_project = props.project;
            const newId = prev_project.seats.length === 0 ? 1 : Math.max(...prev_project.seats.map(seat => seat.id)) + 1;
            
            let defaultColor = seat_colors[0].color;
            if (tool.includes("_")) {
                defaultColor = tool.split("_")[1];
            }

            setProject({
                ...props.project,
                seats: [
                    ...props.project.seats,
                    {
                        id: newId,
                        name: newId.toString(),
                        x: completedDragRect.x,
                        y: completedDragRect.y,
                        width: completedDragRect.width,
                        height: completedDragRect.height,
                        color: defaultColor,
                        allocate_ids: [],
                    }
                ]
            });
        }
    }
    
    function drawSeat (SeatObject: Seat){
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
                    fill={SeatObject.color}
                />
                
                <Text
                    key={`text-${SeatObject.id}`}
                    text={SeatObject.name || "席"+String(SeatObject.id)}
                    fontSize={16}
                    width={SeatObject.width}
                    align="center"
                    y={10}
                />

                <Text 
                    key={`text-${SeatObject.id}-b`} 
                    text={getParticipantData(props.project, SeatObject.allocate_ids[0])?.name || ""} 
                    fontSize={14}
                    width={SeatObject.width}
                    align="center"
                    y={32}
                />                
            </Group>
        );
    }
    
    function drawObject(object: Object) {
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
                onTransformEnd={(e) => {
                    const node = e.currentTarget;
                    const scaleX = Math.abs(node.scaleX());
                    const scaleY = Math.abs(node.scaleY());
                    const baseWidth = object.width ?? node.width();
                    const baseHeight = object.height ?? node.height();

                    node.scaleX(1);
                    node.scaleY(1);

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
                                font_size: Math.max(1, object.font_size * scaleY),
                                width: baseWidth * scaleX,
                                height: baseHeight * scaleY,
                            };
                        }),
                    });
                }}
            >
                <Text
                    text={object.text}
                    fontSize={object.font_size}
                    width={object.width ?? undefined}
                    height={object.height ?? undefined}
                />
            </Group>
        );
    }

    const selectedSeat = selectedType === "seat" ? props.project.seats.find(s => s.id === selectedId) : null;
    const selectedObj = selectedType === "text" ? props.project.objects.find(o => o.id === selectedId) : null;

    return (
        <div className="space-y-4 p-4 overflow-auto bg-gray-100">
            <div>
                <h1 className="text-lg font-bold">座席配置図</h1>
                <p>「席」または「テクスト」を選択し、ドラッグすることで座席配置図を作成できます。</p>
            </div>

            {/* ツールセレクター & 画像保存ボタン */}
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex gap-2 flex-wrap">
                    {
                        tool_list.map((t)=>{
                            return (
                                <button key={`tool-${t.object_name}`}
                                        onClick={()=>setTool(t.object_name)}
                                        className={`px-3 py-1 rounded flex items-center gap-1.5 ${tool === t.object_name ? "border bg-blue-900 text-white" : "border bg-blue-100 text-black"}`}
                                >
                                    {t.color && (
                                        <span 
                                            className="inline-block w-3 h-3 rounded-full border border-gray-400" 
                                            style={{ backgroundColor: t.color }}
                                        />
                                    )}
                                    {t.surface_name}
                                </button>
                            )
                        })
                    }
                </div>
                
                <button
                    onClick={handleSaveImage}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1.5 shadow"
                >
                    画像として保存
                </button>
            </div>

            {/* 選択アイテムの編集フォーム */}
            <div>
                {selectedId !== null && (
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
                                        value={selectedSeat.color}
                                        onChange={(e) => {
                                            const newColor = e.target.value;
                                            setProject({
                                                ...props.project,
                                                seats: props.project.seats.map(s => s.id === selectedSeat.id ? {...s, color: newColor} : s)
                                            });
                                        }}
                                        className="border px-2 py-1 rounded text-sm"
                                    >
                                        {seat_colors.map((seat_color)=>(
                                            <option key={seat_color.color} value={seat_color.color}>{seat_color.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block">割り当て</label>
                                    <select 
                                        value={selectedSeat.allocate_ids[0] ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const newAllocateIds = value === "" ? [] : [value];
                                            
                                            setProject({
                                                ...props.project,
                                                seats: props.project.seats.map(s => 
                                                    s.id === selectedSeat.id 
                                                        ? { ...s, allocate_ids: newAllocateIds } 
                                                        : s
                                                )
                                            });
                                        }}
                                        className="border px-2 py-1 rounded text-sm"
                                    >
                                        <option value="">未選択</option>
                                        {props.project.participants.map((participant) => {
                                            return (
                                                <option key={participant.id} value={participant.id}>
                                                    {participant.name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="ml-auto self-end">
                                    <button 
                                        onClick={handleDeleteSelectedElement}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedType === "text" && selectedObj && (
                            <div className="flex gap-4 items-center flex-wrap">
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
                                        className="border px-2 py-1 rounded text-sm"
                                    />
                                </div>
                                <div className="ml-auto self-end">
                                    <button 
                                        onClick={handleDeleteSelectedElement}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Konva Stage エリア */}
            <div className="border border-gray-300 bg-white rounded shadow inline-block">
                <Stage
                    width={1280}
                    height={720}
                    ref={stageRef}
                    onMouseDown={handleStageMouseDown}
                    onMouseMove={handleStageMouseMove}
                    onMouseUp={handleStageMouseUp}
                >
                    <Layer>
                        <Rect x={0} y={0} width={1280} height={720} fill="white" stroke="#000000" strokeWidth={4} listening={false} />
                        {props.project.seats.map((seat) => drawSeat(seat))}
                        {props.project.objects.map((obj) => drawObject(obj))}
                        
                        {/* ドロワー範囲プレビュー */}
                        {dragRect && (
                            <Rect
                                x={dragRect.x}
                                y={dragRect.y}
                                width={dragRect.width}
                                height={dragRect.height}
                                stroke="blue"
                            />
                        )}

                        <Transformer ref={trRef} />
                    </Layer>
                </Stage>
            </div>

            {/* 席一覧セクション */}
            <div className="p-4 border border-gray-300 bg-white rounded shadow space-y-3">
                <h2 className="font-bold text-md text-gray-800">席一覧 ({props.project.seats.length}件)</h2>
                {props.project.seats.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">配置された席はありません。</p>
                ) : (
                    <div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-auto">
                        {props.project.seats.map((seat) => {
                            const participant = getParticipantData(props.project, seat.allocate_ids[0]);
                            const isSelected = selectedId === seat.id && selectedType === "seat";
                            return (
                                <div 
                                    key={`seat-list-item-${seat.id}`}
                                    className={`flex items-center justify-between py-2 px-2 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span 
                                            className="inline-block w-3.5 h-3.5 rounded-full border border-gray-400"
                                            style={{ backgroundColor: seat.color }}
                                        />
                                        <span className="font-medium text-sm text-gray-800">
                                            {seat.name || `席 ${seat.id}`}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {participant ? `(割当: ${participant.name})` : "(未割り当て)"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedId(seat.id);
                                                setSelectedType("seat");
                                            }}
                                            className="px-2.5 py-1 text-xs border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                                        >
                                            選択
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSeat(seat.id)}
                                            className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
