<img src="public/icons/macos-icon.png" alt="TrackHands Icon" width="96" height="96">

<h1>TrackHands</h1>

TrackHands is a cross-platform desktop app that detects when your fingers are near your mouth and reminds you to stop.

[![Latest Release](https://img.shields.io/github/v/release/cacoos/trackhands?label=Download&style=for-the-badge)](https://github.com/cacoos/trackhands/releases/latest)

## Installation

### From Release

Download the latest release for your platform from the [Releases](https://github.com/cacoos/trackhands/releases/latest) page.

#### macOS Note

Since the app is not signed with an Apple Developer certificate, macOS may show a warning that the app "is damaged and can't be opened." To fix this, run the following command in Terminal after installing:

```bash
xattr -cr /Applications/TrackHands.app
```

### Building from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/cacoos/trackhands.git
   cd trackhands
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run in development mode:

   ```bash
   pnpm tauri dev
   ```

4. Build for production:

   ```bash
   pnpm tauri build
   ```

The built application will be in `src-tauri/target/release/bundle/`.

## Features

- Real-time hand and face detection using MediaPipe
- Unobtrusive system tray app
- Warning overlay when hands are detected near mouth
- Camera preview with detection visualization
- Adjustable detection frequency
- Configurable camera resolution
- Screenshot capture of detected incidents
- Privacy-focused — all processing done locally

## Requirements

- macOS 11+, Windows 10+, or Linux
- Built-in camera or compatible webcam
- Camera permissions enabled

### Development Requirements

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (recommended) or npm
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

## How It Works

TrackHands runs in your system tray and uses your camera to:

1. Detect your face and mouth position using MediaPipe Face Mesh
2. Track your hand and finger positions using MediaPipe Hands
3. Show a warning overlay when fingers are detected near your mouth
4. Capture a screenshot of the incident to help build awareness

## Privacy

- All processing is done locally on your device
- No data is collected or transmitted
- Camera access is required but footage never leaves your computer

## Settings

- **Detection Speed**: Adjust how frequently detection runs (Slow/Medium/Fast)
- **Resolution**: Configure camera resolution (Low/Medium/High)

## Project Structure

```
trackhands/
├── src/                     # React frontend
│   ├── components/          # UI components
│   ├── hooks/               # Custom hooks (detection)
│   └── stores/              # State management
├── src-tauri/               # Rust backend
│   ├── src/                 # Tauri commands
│   └── icons/               # App icons
└── public/                  # Static assets
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Rust, Tauri 2.0
- **Detection**: MediaPipe (Face Mesh + Hand Landmarks)
- **State**: Zustand

## Troubleshooting

If you're having issues with detection:

1. Ensure good lighting on your face
2. Try quitting and reopening the app
3. Check camera permissions in System Settings
4. Try a different camera resolution setting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Author

Joaquin Ossandon ([@cacoos](https://x.com/cacoos))
