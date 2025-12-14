# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-12-13

### Fixed

- Prevent detection breakage when changing camera resolution ([#19](https://github.com/cacoos/trackhands/pull/19))
- Use all 40 MediaPipe FACEMESH_LIPS landmark indices for more accurate mouth detection ([#18](https://github.com/cacoos/trackhands/pull/18))
- Restore focus to previous window on warning dismiss ([#16](https://github.com/cacoos/trackhands/pull/16))
- Remove confusing 'Run in background' button ([#15](https://github.com/cacoos/trackhands/pull/15))

## [1.0.3] - 2025-12-10

### Fixed

- Warning overlay now autofocuses when popover is closed ([#9](https://github.com/cacoos/trackhands/pull/9))

## [1.0.2] - 2025-12-09

### Added

- Color dot indicator on menubar to show detection status ([#6](https://github.com/cacoos/trackhands/pull/6))

### Changed

- Refactored camera component with overlay and status badge for better separation of concerns ([#6](https://github.com/cacoos/trackhands/pull/6))
- Improved performance by reducing unnecessary re-renders with useShallow and component isolation ([#7](https://github.com/cacoos/trackhands/pull/7))

### Fixed

- Popover visibility tracking with proper state management ([#5](https://github.com/cacoos/trackhands/pull/5))

## [1.0.1] - 2025-12-08

### Added

- Auto-dismiss warning feature with animated progress ring ([#1](https://github.com/cacoos/trackhands/pull/1))
- Auto-dismiss delay setting controls in settings panel ([#1](https://github.com/cacoos/trackhands/pull/1))

### Changed

- Improved popover window positioning for macOS menu bar ([#2](https://github.com/cacoos/trackhands/pull/2))
- Refined popover window border radius for better visual consistency ([#2](https://github.com/cacoos/trackhands/pull/2))

### Fixed

- Detection now uses consistent mouth rectangle across all resolutions ([#3](https://github.com/cacoos/trackhands/pull/3))
- Detection state properly resets when warning is dismissed ([#1](https://github.com/cacoos/trackhands/pull/1))
- Popover focus handling and screenshot timing ([#4](https://github.com/cacoos/trackhands/pull/4))

## [1.0.0] - 2025-12-07

### Added

- Initial release
- Real-time hand and face detection using MediaPipe
- Warning overlay when fingers are detected near mouth
- System tray integration with popover window
- Camera selection and sensitivity settings
- Persistent settings storage
