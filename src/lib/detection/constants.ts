// All 40 unique landmark indices from MediaPipe's FACEMESH_LIPS specification
// https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/python/solutions/face_mesh_connections.py
export const MOUTH_LANDMARKS = [
  0, 13, 14, 17, 37, 39, 40, 61, 78, 80, 81, 82, 84, 87, 88, 91, 95, 146, 178, 181, 185, 191, 267,
  269, 270, 291, 308, 310, 311, 312, 314, 317, 318, 321, 324, 375, 402, 405, 409, 415,
];

export const FINGER_TIP_INDICES = [4, 8, 12, 16, 20];

export const FACE_LANDMARKER_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export const HAND_LANDMARKER_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export const VISION_WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

export const MOUTH_PADDING_RATIO = 0.02;
export const LABEL_OFFSET_RATIO = 0.02;
export const FONT_SIZE_RATIO = 0.033;
export const SHADOW_OFFSET_RATIO = 0.0625;
