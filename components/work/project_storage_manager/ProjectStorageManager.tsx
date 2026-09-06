"use client";

import { Project } from "@/types/main/project";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

interface ProjectStorageManagerProps {
    project: Project;
    setProject: Dispatch<SetStateAction<Project>>;
}

interface SlotStatus {
    [key: number]: boolean;
}

export default function ProjectStorageManager({ project, setProject }: ProjectStorageManagerProps) {
    const [message, setMessage] = useState<string>("");
    // 各スロットにデータが存在するかどうかの状態
    const [slotStatus, setSlotStatus] = useState<SlotStatus>({});

    const getStorageKey = (slot: number) => `seating_app_slot_${slot}`;

    // コンポーネントマウント時および操作時に各スロットのデータ有無をチェック
    const checkSlots = () => {
        const status: SlotStatus = {};
        [1, 2, 3, 4, 5].forEach((slot) => {
            const data = localStorage.getItem(getStorageKey(slot));
            status[slot] = !!data;
        });
        setSlotStatus(status);
    };

    useEffect(() => {
        checkSlots();
    }, []);

    // 保存処理
    const handleSave = (slot: number) => {
        try {
            localStorage.setItem(getStorageKey(slot), JSON.stringify(project));
            setMessage(`スロット ${slot} にプロジェクトを保存しました！`);
            checkSlots();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage(`スロット ${slot} の保存に失敗しました。`);
        }
    };

    // 読み込み処理
    const handleLoad = (slot: number) => {
        try {
            const savedData = localStorage.getItem(getStorageKey(slot));
            if (savedData) {
                const parsedProject: Project = JSON.parse(savedData);
                setProject(parsedProject);
                setMessage(`スロット ${slot} からプロジェクトを読み込みました！`);
            } else {
                setMessage(`スロット ${slot} には保存されたデータがありません。`);
            }
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("読み込みに失敗しました。データが破損している可能性があります。");
        }
    };

    // 削除処理
    const handleClear = (slot: number) => {
        if (window.confirm(`スロット ${slot} の保存データを削除してもよろしいですか？`)) {
            localStorage.removeItem(getStorageKey(slot));
            setMessage(`スロット ${slot} のデータを削除しました。`);
            checkSlots();
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold">プロジェクトの保存・読み込み</h1>
            <p className="text-sm text-gray-600">
                各スロットの状態を確認しながら、保存・読み出しを行えます。
            </p>

            {message && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                    {message}
                </div>
            )}

            {/* スロット一覧のリスト表示 */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((slot) => {
                    const hasData = slotStatus[slot];
                    return (
                        <div
                            key={slot}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50"
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-800 w-24">
                                    スロット {slot}
                                </span>
                                <span
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        hasData
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {hasData ? "データあり" : "データなし"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSave(slot)}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                                >
                                    保存
                                </button>
                                <button
                                    onClick={() => handleLoad(slot)}
                                    disabled={!hasData}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                        hasData
                                            ? "bg-green-600 text-white hover:bg-green-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    読み出し
                                </button>
                                {hasData && (
                                    <button
                                        onClick={() => handleClear(slot)}
                                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition"
                                    >
                                        削除
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}