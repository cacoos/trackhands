# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-12-09

### Added

- Auto-dismiss warning feature with animated progress ring
- Auto-dismiss delay setting controls in settings panel

### Changed

- Improved popover window positioning for macOS menu bar
- Refined popover window border radius for better visual consistency

### Fixed

- Detection now uses consistent mouth rectangle across all resolutions
- Detection state properly resets when warning is dismissed

## [1.0.0] - 2024-12-08

### Added

- Initial release
- Real-time hand and face detection using MediaPipe
- Warning overlay when fingers are detected near mouth
- System tray integration with popover window
- Camera selection and sensitivity settings
- Persistent settings storage
