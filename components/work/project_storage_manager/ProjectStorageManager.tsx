"use client";

import { Project } from "@/types/main/project";
import { useState, type Dispatch, type SetStateAction } from "react";

interface ProjectStorageManagerProps {
    project: Project;
    setProject: Dispatch<SetStateAction<Project>>;
}

interface SlotStatus {
    [key: number]: boolean;
}

export default function ProjectStorageManager({
    project,
    setProject,
}: ProjectStorageManagerProps) {
    const getStorageKey = (slot: number) => `seating_app_slot_${slot}`;

    // 各スロットにデータが存在するかどうかを初期化時に確認
    const [slotStatus, setSlotStatus] = useState<SlotStatus>(() => {
        const status: SlotStatus = {};

        [1, 2, 3, 4, 5].forEach((slot) => {
            const data = localStorage.getItem(getStorageKey(slot));
            status[slot] = !!data;
        });

        return status;
    });

    const [message, setMessage] = useState<string>("");

    // 各スロットのデータ有無を更新
    const checkSlots = () => {
        const status: SlotStatus = {};

        [1, 2, 3, 4, 5].forEach((slot) => {
            const data = localStorage.getItem(getStorageKey(slot));
            status[slot] = !!data;
        });

        setSlotStatus(status);
    };

    // メッセージを3秒後に消す
    const showMessage = (text: string) => {
        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    // 保存処理
    const handleSave = (slot: number) => {
        try {
            localStorage.setItem(
                getStorageKey(slot),
                JSON.stringify(project)
            );

            showMessage(`スロット ${slot} にプロジェクトを保存しました！`);

            // 保存後にスロット状態を更新
            checkSlots();
        } catch (error) {
            console.error(error);
            showMessage(`スロット ${slot} の保存に失敗しました。`);
        }
    };

    // 読み込み処理
    const handleLoad = (slot: number) => {
        try {
            const savedData = localStorage.getItem(getStorageKey(slot));

            if (savedData) {
                const parsedProject: Project = JSON.parse(savedData);

                setProject(parsedProject);
                showMessage(
                    `スロット ${slot} からプロジェクトを読み込みました！`
                );
            } else {
                showMessage(
                    `スロット ${slot} には保存されたデータがありません。`
                );
            }
        } catch (error) {
            console.error(error);
            showMessage(
                "読み込みに失敗しました。データが破損している可能性があります。"
            );
        }
    };

    // 削除処理
    const handleClear = (slot: number) => {
        if (
            window.confirm(
                `スロット ${slot} の保存データを削除してもよろしいですか？`
            )
        ) {
            try {
                localStorage.removeItem(getStorageKey(slot));

                showMessage(`スロット ${slot} のデータを削除しました。`);

                // 削除後にスロット状態を更新
                checkSlots();
            } catch (error) {
                console.error(error);
                showMessage(`スロット ${slot} の削除に失敗しました。`);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">
                    プロジェクトの保存・読み込み
                </h1>
                <p>
                    各スロットの状態を確認しながら、保存・読み出しを行えます。
                </p>
            </div>

            {message && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                    {message}
                </div>
            )}

            {/* スロット一覧 */}
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

