import { create } from 'zustand';

export type ToolType = 'vernier' | 'micrometer';
export type SimulationMode = 'free' | 'task';
export type Object3DType = 'kampas_rem' | 'baut';
export type HitboxZone = 'outer_jaw' | 'inner_jaw' | 'depth_rod' | 'micrometer_gap';

export interface MeasurementTask {
  id: string;
  title: string;
  instruction: string;
  tool: ToolType;
  objectType: Object3DType;
  targetHitbox: HitboxZone;
  targetMeasurementMinMm: number;
  targetMeasurementMaxMm: number;
  expectedValueMm: number;
  toleranceMm: number;
}

export const PRESET_TASKS: MeasurementTask[] = [
  {
    id: 'task-1',
    title: 'Pengukuran Ketebalan Kampas Rem',
    instruction: 'Drag objek Kampas Rem (3D) ke Rahang Luar (Outer Jaw) Jangka Sorong. Geser rahang hingga menjepit sempurna, lalu baca dan masukkan hasil ketebalannya.',
    tool: 'vernier',
    objectType: 'kampas_rem',
    targetHitbox: 'outer_jaw',
    targetMeasurementMinMm: 14.8,
    targetMeasurementMaxMm: 15.2,
    expectedValueMm: 15.0,
    toleranceMm: 0.1,
  },
  {
    id: 'task-2',
    title: 'Pengukuran Kedalaman Lubang Baut',
    instruction: 'Drag objek Baut (3D) ke Tangkai Kedalaman (Depth Rod) Jangka Sorong. Geser batang pengukur hingga menyentuh dasar baut, lalu masukkan hasilnya.',
    tool: 'vernier',
    objectType: 'baut',
    targetHitbox: 'depth_rod',
    targetMeasurementMinMm: 44.8,
    targetMeasurementMaxMm: 45.2,
    expectedValueMm: 45.0,
    toleranceMm: 0.1,
  },
  {
    id: 'task-3',
    title: 'Pengukuran Presisi Diameter Baut',
    instruction: 'Drag objek Baut (3D) ke Celah Spindel & Anvil Mikrometer. Putar Thimble hingga menjepit batang baut, lalu baca dan masukkan nilainya.',
    tool: 'micrometer',
    objectType: 'baut',
    targetHitbox: 'micrometer_gap',
    targetMeasurementMinMm: 9.95,
    targetMeasurementMaxMm: 10.05,
    expectedValueMm: 10.0,
    toleranceMm: 0.02,
  },
];

interface SimulationState {
  activeTool: ToolType;
  mode: SimulationMode;
  currentTaskIndex: number;
  activeTask: MeasurementTask | null;
  selected3DObject: Object3DType;
  
  // 2D Tool Positions
  vernierSliderX: number; // in pixels
  micrometerThimbleX: number; // in pixels

  // 3D Object Snap / Bounce State
  snapState: 'idle' | 'snapped' | 'bounced' | 'success' | 'error';
  snappedHitbox: HitboxZone | null;
  feedbackMessage: string | null;

  // Actions
  setActiveTool: (tool: ToolType) => void;
  setMode: (mode: SimulationMode) => void;
  setSelected3DObject: (obj: Object3DType) => void;
  setVernierSliderX: (x: number) => void;
  setMicrometerThimbleX: (x: number) => void;
  setTaskIndex: (index: number) => void;
  handleDrop3DObject: (hitbox: HitboxZone) => boolean;
  resetSimulation: () => void;
  clearFeedback: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  activeTool: 'vernier',
  mode: 'free',
  currentTaskIndex: 0,
  activeTask: null,
  selected3DObject: 'kampas_rem',

  vernierSliderX: 10,
  micrometerThimbleX: 7.5,

  snapState: 'idle',
  snappedHitbox: null,
  feedbackMessage: null,

  setActiveTool: (tool) => {
    set({
      activeTool: tool,
      snapState: 'idle',
      snappedHitbox: null,
      feedbackMessage: null,
    });
  },

  setMode: (mode) => {
    if (mode === 'task') {
      const task = PRESET_TASKS[0];
      set({
        mode,
        currentTaskIndex: 0,
        activeTask: task,
        activeTool: task.tool,
        selected3DObject: task.objectType,
        snapState: 'idle',
        snappedHitbox: null,
        feedbackMessage: null,
      });
    } else {
      set({ mode: 'free', activeTask: null, snapState: 'idle', feedbackMessage: null });
    }
  },

  setSelected3DObject: (obj) => set({ selected3DObject: obj, snapState: 'idle', snappedHitbox: null }),

  setVernierSliderX: (x) => set({ vernierSliderX: x }),
  setMicrometerThimbleX: (x) => set({ micrometerThimbleX: x }),

  setTaskIndex: (index) => {
    const task = PRESET_TASKS[index] || PRESET_TASKS[0];
    set({
      currentTaskIndex: index,
      activeTask: task,
      activeTool: task.tool,
      selected3DObject: task.objectType,
      snapState: 'idle',
      snappedHitbox: null,
      feedbackMessage: null,
    });
  },

  handleDrop3DObject: (droppedHitbox) => {
    const { mode, activeTask } = get();

    if (mode === 'task' && activeTask) {
      if (droppedHitbox === activeTask.targetHitbox) {
        set({
          snapState: 'snapped',
          snappedHitbox: droppedHitbox,
          feedbackMessage: 'Object Snapped! Geser rahang/thimble untuk menjepit objek.',
        });
        return true;
      } else {
        set({
          snapState: 'bounced',
          snappedHitbox: null,
          feedbackMessage: 'Posisi Salah! Objek memantul kembali ke tempat asal.',
        });
        return false;
      }
    } else {
      // Free mode snapping allowed anywhere valid
      set({
        snapState: 'snapped',
        snappedHitbox: droppedHitbox,
        feedbackMessage: `Objek menempel pada ${droppedHitbox.replace('_', ' ')}.`,
      });
      return true;
    }
  },

  resetSimulation: () => set({
    snapState: 'idle',
    snappedHitbox: null,
    feedbackMessage: null,
    vernierSliderX: 10,
    micrometerThimbleX: 7.5,
  }),

  clearFeedback: () => set({ feedbackMessage: null }),
}));
