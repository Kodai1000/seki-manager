import { Project } from "@/types/main/project";
import { Seat } from "@/types/main/seat";
import { Participant } from "@/types/main/participant";
import getParticipantData from "./getParticipantData";
import getSeatData from "./getSeatData";

type Allocate = {
    seatId: number;
    participantId: string;
};

// 山登り法のパラメータ
const MAX_ITERATIONS = 20000;
const MAX_NO_IMPROVEMENT = 2000;
const RESTART_COUNT = 10;

export default function autoAllocate(project: Project, setProject: (project: Project) => void, setTabIndex: (tabIndex: number)=>void): void {
    console.log("autoAllocate!");
    
    // ★ 削除されていない座席のみを対象とする
    const seatIds = Array.from(
        new Set(project.seats.filter((seat) => !seat.isDelete).map((seat) => seat.id))
    );

    const participantIds = Array.from(
        new Set(project.participants.map((participant) => participant.id))
    );

    if (participantIds.length > seatIds.length) {
        console.log("error!");
        return;
    }

    // 座席間の距離を計算するヘルパー
    const getDistance = (seatA: Seat, seatB: Seat): number => {
        const dx = (seatA).x - (seatB).x;
        const dy = (seatA).y - (seatB).y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // オブジェクト（参加者 or 属性）に該当する参加者リストを取得
    const getParticipantsByObject = (obj: {
        type: "participant" | "attribute" | null;
        ref: string;
    }): Participant[] => {
        if (!obj.type || !obj.ref) return [];
        if (obj.type === "participant") {
            const p = project.participants.find((item) => item.id === obj.ref);
            return p ? [p] : [];
        } else if (obj.type === "attribute") {
            return project.participants.filter(
                (p) => p.attributes.includes(obj.ref)
            );
        }
        return [];
    };

    // ある参加者が、ある座席の色条件（条件1）を満たすかどうか
    function isColorAllowed(participant: Participant, seat: Seat): boolean {
        // 削除済み座席はそもそも許可しない
        if (seat.isDelete) return false;

        for (const condition of project.conditions) {
            if (condition.type === 1) {
                if (condition.objectA.type === "participant") {
                    if (condition.objectA.ref === participant.id) {
                        if (seat.color !== condition.color) {
                            return false;
                        }
                    }
                } else if (condition.objectA.type === "attribute") {
                    if (participant.attributes.includes(condition.objectA.ref)) {
                        if (seat.color !== condition.color) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    // 現在の割り当て全体が条件1（ハード制約）を満たしているか
    function isPassed(currentAllocates: Allocate[]): boolean {
        for (const allocate of currentAllocates) {
            const participant = getParticipantData(project, allocate.participantId);
            const seat = getSeatData(project, allocate.seatId);
            if (typeof participant === "undefined" || typeof seat === "undefined" || seat.isDelete) {
                return false;
            }
            if (!isColorAllowed(participant, seat)) {
                return false;
            }
        }
        return true;
    }

    // スコアリング関数の計算（条件2〜5：近づけ・遠ざけ）
    function calculateScore(currentAllocates: Allocate[]): number {
        let score = 0;

        const seatMap = new Map<string, Seat>();
        for (const allocate of currentAllocates) {
            const seat = getSeatData(project, allocate.seatId);
            if (typeof seat === "undefined" || seat.isDelete) {
                return -Infinity;
            }
            seatMap.set(allocate.participantId, seat);
        }

        for (const condition of project.conditions) {
            const participantsA = getParticipantsByObject(condition.objectA);
            const participantsB = getParticipantsByObject(condition.objectB);

            if (condition.type === 2) {
                for (const pA of participantsA) {
                    for (const pB of participantsB) {
                        if (pA.id === pB.id) continue;
                        const seatA = seatMap.get(pA.id);
                        const seatB = seatMap.get(pB.id);
                        if (seatA && seatB) {
                            score -= getDistance(seatA, seatB);
                        }
                    }
                }
            } else if (condition.type === 3) {
                for (const pA of participantsA) {
                    for (const pB of participantsB) {
                        if (pA.id === pB.id) continue;
                        const seatA = seatMap.get(pA.id);
                        const seatB = seatMap.get(pB.id);
                        if (seatA && seatB) {
                            score += getDistance(seatA, seatB);
                        }
                    }
                }
            } else if (condition.type === 4) {
                for (let i = 0; i < participantsA.length; i++) {
                    for (let j = i + 1; j < participantsA.length; j++) {
                        const seatA = seatMap.get(participantsA[i].id);
                        const seatB = seatMap.get(participantsA[j].id);
                        if (seatA && seatB) {
                            score -= getDistance(seatA, seatB);
                        }
                    }
                }
            } else if (condition.type === 5) {
                for (let i = 0; i < participantsA.length; i++) {
                    for (let j = i + 1; j < participantsA.length; j++) {
                        const seatA = seatMap.get(participantsA[i].id);
                        const seatB = seatMap.get(participantsA[j].id);
                        if (seatA && seatB) {
                            score += getDistance(seatA, seatB);
                        }
                    }
                }
            }
        }

        return score;
    }

    // 配列をシャッフルするユーティリティ
    function shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    // 初期解の生成：属性・席の色条件（条件1）を積極的に考慮して割り当てる
    function generateInitialAllocation(): Allocate[] {
        const availableSeatIds = shuffle([...seatIds]);
        const allocatedParticipantIds = new Set<string>();
        const allocates: Allocate[] = [];

        // 1. まず「明確に色制約（条件1）を持つ参加者」を優先的に処理する
        const constrainedParticipants: { participant: Participant; allowedColors: Set<string> }[] = [];
        const normalParticipants: Participant[] = [];

        for (const pId of participantIds) {
            const participant = getParticipantData(project, pId);
            if (typeof participant === "undefined") continue;
            const allowedColors = new Set<string>();
            let hasConstraint = false;

            for (const condition of project.conditions) {
                if (condition.type === 1) {
                    if (
                        (condition.objectA.type === "participant" && condition.objectA.ref === participant.id) ||
                        (condition.objectA.type === "attribute" && participant.attributes.includes(condition.objectA.ref))
                    ) {
                        if (condition.color !== null) {
                            allowedColors.add(condition.color);
                            hasConstraint = true;
                        }
                    }
                }
            }

            if (hasConstraint) {
                constrainedParticipants.push({ participant, allowedColors });
            } else {
                normalParticipants.push(participant);
            }
        }

        // 制約を持つ参加者をシャッフルして順に割り当て
        const shuffledConstrained = shuffle(constrainedParticipants);
        for (const item of shuffledConstrained) {
            const seatIndex = availableSeatIds.findIndex((seatId) => {
                const seat = getSeatData(project, seatId);
                if (seat === undefined || seat.isDelete) return false;
                return item.allowedColors.has(seat.color);
            });

            if (seatIndex !== -1) {
                const seatId = availableSeatIds[seatIndex];
                availableSeatIds.splice(seatIndex, 1);
                allocates.push({ participantId: item.participant.id, seatId });
                allocatedParticipantIds.add(item.participant.id);
            }
        }

        // 2. 残りの参加者を、残りの空き席に割り当てる
        const remainingParticipants = [
            ...shuffledConstrained.filter((item) => !allocatedParticipantIds.has(item.participant.id)).map((i) => i.participant),
            ...shuffle(normalParticipants),
        ];

        for (const participant of remainingParticipants) {
            if (availableSeatIds.length > 0) {
                let seatIndex = availableSeatIds.findIndex((seatId) => {
                    const seat = getSeatData(project, seatId);
                    if (seat === undefined || seat.isDelete) return false;
                    return isColorAllowed(participant, seat);
                });

                if (seatIndex === -1) {
                    seatIndex = 0;
                }

                const seatId = availableSeatIds[seatIndex];
                availableSeatIds.splice(seatIndex, 1);
                allocates.push({ participantId: participant.id, seatId });
            }
        }

        return allocates;
    }

    // 山登り法（1回分）
    function hillClimb(initial: Allocate[]): { allocates: Allocate[]; score: number; passed: boolean } {
        const current = initial.map((a) => ({ ...a }));
        let currentPassed = isPassed(current);
        let currentScore = currentPassed ? calculateScore(current) : -Infinity;

        let noImprovementCount = 0;

        for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
            if (noImprovementCount >= MAX_NO_IMPROVEMENT) {
                break;
            }

            if (current.length < 2) {
                break;
            }

            const i = Math.floor(Math.random() * current.length);
            const participantI = getParticipantData(project, current[i].participantId);
            if (typeof participantI === "undefined") {
                continue;
            }
            const seatIObj = getSeatData(project, current[i].seatId);
            if (typeof seatIObj === "undefined" || seatIObj.isDelete) {
                continue;
            }
            
            if (!isColorAllowed(participantI, seatIObj) && Math.random() < 0.7) {
                // 違反者を優先的に動かす
            }

            let j = Math.floor(Math.random() * current.length);
            while (j === i) {
                j = Math.floor(Math.random() * current.length);
            }

            const seatI = current[i].seatId;
            const seatJ = current[j].seatId;

            current[i] = { ...current[i], seatId: seatJ };
            current[j] = { ...current[j], seatId: seatI };

            const newPassed = isPassed(current);

            if (newPassed) {
                const newScore = calculateScore(current);
                if (!currentPassed || newScore > currentScore) {
                    currentPassed = true;
                    currentScore = newScore;
                    noImprovementCount = 0;
                    continue;
                }
            }

            current[i] = { ...current[i], seatId: seatI };
            current[j] = { ...current[j], seatId: seatJ };
            noImprovementCount++;
        }

        return { allocates: current, score: currentScore, passed: currentPassed };
    }

    // 判定：制約条件に距離（タイプ2〜5）が含まれているか確認
    const hasDistanceConditions = project.conditions.some(
        (c) => c.type >= 2 && c.type <= 5
    );

    let bestAllocates: Allocate[] = [];
    let bestScore = -Infinity;
    let bestPassed = false;

    if (!hasDistanceConditions) {
        // --- 距離の条件が含まれていない場合 ---
        console.log("No distance conditions found. Using random allocation based on attributes and colors.");
        
        for (let restart = 0; restart < RESTART_COUNT; restart++) {
            const initial = generateInitialAllocation();
            const passed = isPassed(initial);

            if (passed) {
                bestAllocates = initial;
                bestPassed = true;
                break;
            } else if (!bestPassed && restart === 0) {
                bestAllocates = initial;
            }
        }
    } else {
        // --- 距離の条件が含まれている場合 ---
        for (let restart = 0; restart < RESTART_COUNT; restart++) {
            const initial = generateInitialAllocation();
            const result = hillClimb(initial);

            if (result.passed) {
                if (!bestPassed || result.score > bestScore) {
                    bestPassed = true;
                    bestScore = result.score;
                    bestAllocates = result.allocates;
                }
            } else if (!bestPassed) {
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestAllocates = result.allocates;
                }
            }
        }
        console.log("bestScore:", bestScore);
    }

    // ハード制約を満たすことができなかった場合の警告表示
    if (!bestPassed) {
        console.warn("ハード制約を満たす割り当てを実行できませんでした");
    }

    // 結果を各座席の allocate_ids に反映
    const updatedSeats = project.seats.map((seat) => {
        // ★ 削除されている座席はアサインをクリア（または空にする）
        if (seat.isDelete) {
            return {
                ...seat,
                allocate_ids: [],
            };
        }

        const assignedParticipants = bestAllocates
            .filter((allocate) => allocate.seatId === seat.id)
            .map((allocate) => allocate.participantId);

        return {
            ...seat,
            allocate_ids: assignedParticipants,
        };
    });

    console.log(updatedSeats);

    setProject({
        ...project,
        seats: updatedSeats,
    });
    setTabIndex(0);
    console.log("complete!");
}