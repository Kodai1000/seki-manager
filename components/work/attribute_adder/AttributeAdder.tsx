"use client";

import { Project } from "@/types/main/project";
import { useState } from "react";

type Props = {
    project: Project;
    setProject: (project: Project) => void;
    participantId: string;
};

export default function AttributeAdder(props: Props) {
    const { project, setProject, participantId } = props;

    const [inputName, setInputName] = useState<string>("");
    const [message, setMessage] = useState("");

    function addAttribute(name: string) {
        let isDuplicate = false;
        const newParticipants = project.participants.map((participant) => {
            if (participant.id === participantId) {

                // 同じ属性名がすでに存在するか確認
                isDuplicate = participant.attributes.some(
                    (attribute) => attribute === name
                );

                // 重複していたら何も変更しない
                if (isDuplicate) {
                    return participant;
                }

                const newAttribute: string = name;

                return {
                    ...participant,
                    attributes: [
                        ...participant.attributes,
                        newAttribute,
                    ],
                };
            }

            return participant;
        });

        setProject({
            ...project,
            participants: newParticipants,
        });
        
        if(isDuplicate){
            setMessage("エラー：属性に重複があります！");
        }else{
            setMessage("");
        }
        
        return;
    }

    return (
        <div className="p-2">
            <input
                type="text"
                value={inputName}
                className="rounded border px-2 py-1"
                placeholder="属性"
                onChange={(e) => {
                    setInputName(e.target.value);
                }}
            />

            <button
                type="button"
                className="ml-2 rounded border px-3 py-1"
                onClick={() => {
                    addAttribute(inputName);
                    setInputName("");
                }}
            >
                追加
            </button>
            <p>{message}</p>
        </div>
    );
}