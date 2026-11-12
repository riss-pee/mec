/**
 * Game Types and Math Interfaces
 */

export type FacingDirection = 1 | -1; // +1 = Forward / +ve (Facing Right), -1 = Rear / -ve (Facing Left)
export type MotionType = 'forward' | 'backward'; // forward = Addition (+), backward = Subtraction (-)

export type VehicleModel = 'red_rocket' | 'school_bus' | 'cyber_buggy' | 'green_jeep';

export interface VehicleOption {
  id: VehicleModel;
  name: string;
  emoji: string;
  color: string;
  wheelColor: string;
  driverEmoji: string;
}

export interface MoveStep {
  id: string;
  timestamp: number;
  startPos: number;
  direction: FacingDirection; // 1 or -1
  motion: MotionType; // 'forward' | 'backward'
  stepCount: number;
  netDelta: number; // facing * motionSign * stepCount
  endPos: number;
  equation: string;
  ruleExplanation: string;
}

export type GameMode = 'free' | 'mission' | 'classroom';

export interface Mission {
  id: number;
  title: string;
  targetPos: number;
  startPos: number;
  initialDirection: FacingDirection;
  story: string;
  objective: string;
  hint: string;
  rewardTitle: string;
  suggestedSteps?: number;
  allowedFacing?: FacingDirection;
  allowedMotion?: MotionType;
}
