import { Participant } from "../main/participant";

// 離す / 近づける のアクション型
export type DistanceAction = "separate" | "close";

export type ConditionObject = {
  type: "participant" | "attribute" | null,
  ref: string
}

// モードごとの条件を判別共用体で定義
export type Condition = {
  id: string,
  objectA: ConditionObject,
  objectB: ConditionObject,
  color: null | string,
  type: number
}