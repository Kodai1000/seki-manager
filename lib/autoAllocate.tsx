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
const MAX_ITERATIONS = 20000; // 最大試行回数（改善が見込めなくなったら早期終了もする）
const MAX_NO_IMPROVEMENT = 2000; // これだけ連続で改善しなかったら打ち切る
const RESTART_COUNT = 10; // 初期解を変えて何回やり直すか（局所最適解対策）

export default function autoAllocate(project: Project, setProject: (project: Project) => void, setTabIndex: (tabIndex: number)=>void): void {
    console.log("autoAllocate!");
    const seatIds = Array.from(
        new Set(project.seats.map((seat) => seat.id))
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
        const dx = (seatA as any).x - (seatB as any).x;
        const dy = (seatA as any).y - (seatB as any).y;
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
            seatMap.set(allocate.participantId, seat);
        }

        for (const condition of project.conditions) {
            const participantsA = getParticipantsByObject(condition.objectA);
            const participantsB = getParticipantsByObject(condition.objectB);

            if (condition.type === 2) {
                // 近づける (ObjectA と ObjectB)
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
                // 遠ざける (ObjectA と ObjectB)
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
                // 同じ属性の人同士を近づける
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
                // 同じ属性の人同士を遠ざける
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

    // 配列をシャッフルするユーティリティ（Fisher-Yates）
    function shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    // 初期解の生成：条件1（色制約）をできる限り満たす貪欲法
    // 各参加者について、割当可能な座席の中からランダムに選ぶ。
    // 見つからない場合は制約を無視してでもとりあえず座席を割り当てる（完全解を保証するため）。
    function generateInitialAllocation(): Allocate[] {
        const shuffledParticipants = shuffle(participantIds);
        const availableSeatIds = shuffle([...seatIds]);
        const allocates: Allocate[] = [];

        for (const participantId of shuffledParticipants) {
            const participant = getParticipantData(project, participantId);

            // 条件1を満たす座席を優先的に探す
            let chosenIndex = availableSeatIds.findIndex((seatId) => {
                const seat = getSeatData(project, seatId);
                return isColorAllowed(participant, seat);
            });

            // 見つからなければ（制約を満たす席がすべて埋まっているなど）、
            // やむを得ず先頭の座席を使う（後段の局所探索でも改善されない可能性はある）
            if (chosenIndex === -1) {
                chosenIndex = 0;
            }

            const seatId = availableSeatIds[chosenIndex];
            availableSeatIds.splice(chosenIndex, 1);

            allocates.push({ participantId, seatId });

            // 座席数 > 参加者数の場合、余った座席は誰にも割り当てられない
            if (availableSeatIds.length === 0) break;
        }

        return allocates;
    }

    // 山登り法（1回分）：初期解からスタートし、2人の座席をランダムに入れ替えて改善を繰り返す
    function hillClimb(initial: Allocate[]): { allocates: Allocate[]; score: number } {
        let current = initial.map((a) => ({ ...a }));
        let currentScore = isPassed(current) ? calculateScore(current) : -Infinity;

        let noImprovementCount = 0;

        for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
            if (noImprovementCount >= MAX_NO_IMPROVEMENT) {
                break;
            }

            if (current.length < 2) {
                // 交換できるペアがない（参加者が1人以下など）
                break;
            }

            // ランダムに2人選んで座席を入れ替える
            const i = Math.floor(Math.random() * current.length);
            let j = Math.floor(Math.random() * current.length);
            while (j === i) {
                j = Math.floor(Math.random() * current.length);
            }

            // 入れ替えを試す
            const seatI = current[i].seatId;
            const seatJ = current[j].seatId;
            current[i] = { ...current[i], seatId: seatJ };
            current[j] = { ...current[j], seatId: seatI };

            // ハード制約（条件1）を満たすかチェック
            const participantI = getParticipantData(project, current[i].participantId);
            const participantJ = getParticipantData(project, current[j].participantId);
            const seatIData = getSeatData(project, seatI);
            const seatJData = getSeatData(project, seatJ);

            const passesConstraint =
                isColorAllowed(participantI, seatJData) &&
                isColorAllowed(participantJ, seatIData);

            if (passesConstraint) {
                const newScore = calculateScore(current);

                // スコアが改善した場合のみ採用（悪化 or 同点なら元に戻す）
                if (newScore > currentScore) {
                    currentScore = newScore;
                    noImprovementCount = 0;
                    continue; // 採用したのでこのまま次のループへ
                }
            }

            // 改善しなかった、または制約を満たさなかった場合は元に戻す
            current[i] = { ...current[i], seatId: seatI };
            current[j] = { ...current[j], seatId: seatJ };
            noImprovementCount++;
        }

        return { allocates: current, score: currentScore };
    }

    // 複数回リスタートして、その中でベストな結果を採用する（局所最適解対策）
    let bestAllocates: Allocate[] = [];
    let bestScore = -Infinity;

    for (let restart = 0; restart < RESTART_COUNT; restart++) {
        const initial = generateInitialAllocation();
        const result = hillClimb(initial);

        if (result.score > bestScore) {
            bestScore = result.score;
            bestAllocates = result.allocates;
        }
    }

    console.log("bestScore:", bestScore);

    // 求めた最適な割り当て結果（bestAllocates）を各座席の allocate_ids に反映
    const updatedSeats = project.seats.map((seat) => {
        const assignedParticipants = bestAllocates
            .filter((allocate) => allocate.seatId === seat.id)
            .map((allocate) => allocate.participantId);

        return {
            ...seat,
            allocate_ids: assignedParticipants,
        };
    });

    console.log(updatedSeats);
    // setProject を用いてステートを更新
    setProject({
        ...project,
        seats: updatedSeats,
    });
    setTabIndex(0);
    console.log("complete!");
}