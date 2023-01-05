/* BAKING SETTINGS */

export const BAKING_SETTINGS_VR = {
  textureBakeSettings: {
    renderer: 1,
    samples: 32,
    useDenoising: true,
  },
  illuminationSettings: {
    directIlluminationMode: 2,
    indirectIllumination: true,
    indirections: 2,
  },
};

export const BAKING_SETTINGS_HIGH = {
  textureBakeSettings: {
    renderer: 1,
    samples: 64,
    useDenoising: true,
  },
  illuminationSettings: {
    directIlluminationMode: 2,
    indirectIllumination: true,
    indirections: 4,
  },
};

export const BAKING_SETTINGS_PREVIEW = {
  textureBakeSettings: {
    renderer: 1,
    samples: 16,
    useDenoising: false,
  },
  illuminationSettings: {
    directIlluminationMode: 2,
    indirectIllumination: false,
    useDenoising: false,
  },
};

/* IMPORT SETTINGS */

export const ATF_SETTINGS_VR = {
  chordDeviation: 0.075,
  normalTolerance: 10.0,
  maxChordLength: 200,
  useStitching: true,
};

export const ATF_SETTINGS_HIGH = {
  chordDeviation: 0.0375,
  normalTolerance: 7.5,
  maxChordLength: 100.0,
  useStitching: true,
};

export const ATF_SETTINGS_PREVIEW = {
  chordDeviation: 1.0,
  normalTolerance: 30.0,
  maxChordLength: 400,
  useStitching: false,
};

export const SCENE_SETTINGS = {
  centerInOrigin: true,
  mergeMaterials: true,
};
