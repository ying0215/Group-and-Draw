export interface Participant {
  id: string;
  name: string;
}

export interface GroupResult {
  groupId: number;
  members: Participant[];
}

export type TabView = 'input' | 'draw' | 'group';

export interface DrawSettings {
  allowRepeats: boolean;
  numberOfWinners: number;
}
