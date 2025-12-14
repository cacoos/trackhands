mod tray;

use std::sync::Mutex;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent,
};

const POPOVER_WIDTH: f64 = 320.0;
const POPOVER_HEIGHT: f64 = 380.0;
const TRAY_MARGIN_Y: f64 = 5.0;

#[cfg(target_os = "macos")]
use objc2::{msg_send, MainThreadMarker};
#[cfg(target_os = "macos")]
use objc2::rc::Retained;
#[cfg(target_os = "macos")]
use objc2_app_kit::{NSApplication, NSApplicationActivationPolicy, NSRunningApplication, NSWorkspace};

struct TrayIconPosition {
    x: f64,
    y: f64,
    width: f64,
}

static TRAY_POSITION: Mutex<Option<TrayIconPosition>> = Mutex::new(None);
static WARNING_VISIBLE: Mutex<bool> = Mutex::new(false);
static POPOVER_VISIBLE: Mutex<bool> = Mutex::new(false);

#[cfg(target_os = "macos")]
static PREVIOUS_APP: Mutex<Option<Retained<NSRunningApplication>>> = Mutex::new(None);

#[tauri::command]
fn show_warning(app: AppHandle) {
    #[cfg(target_os = "macos")]
    {
        let workspace = NSWorkspace::sharedWorkspace();
        if let Some(frontmost_app) = workspace.frontmostApplication() {
            if let Ok(mut guard) = PREVIOUS_APP.lock() {
                *guard = Some(frontmost_app);
            }
        }
    }

    if let Ok(mut guard) = WARNING_VISIBLE.lock() {
        *guard = true;
    }

    if let Some(warning) = app.get_webview_window("warning") {
        let _ = warning.show();
    }

    let popover_visible = POPOVER_VISIBLE.lock().map(|g| *g).unwrap_or(false);

    if popover_visible {
        if let Some(popover) = app.get_webview_window("popover") {
            let _ = popover.set_focus();
        }
    } else {
        if let Some(warning) = app.get_webview_window("warning") {
            let _ = warning.set_focus();
        }
    }

    let _ = app.emit("warning-state", true);
}

#[tauri::command]
fn hide_warning(app: AppHandle) {
    if let Ok(mut guard) = WARNING_VISIBLE.lock() {
        *guard = false;
    }

    if let Some(warning) = app.get_webview_window("warning") {
        let _ = warning.hide();
    }
    let _ = app.emit("warning-state", false);

    #[cfg(target_os = "macos")]
    {
        if let Ok(mut guard) = PREVIOUS_APP.lock() {
            if let Some(previous_app) = guard.take() {
                unsafe {
                    let _: bool = msg_send![&previous_app, activateWithOptions: 0u64];
                }
            }
        }
    }
}

#[tauri::command]
fn quit_app(app: AppHandle) {
    app.exit(0);
}

fn hide_popover(app: &AppHandle) {
    if let Ok(mut guard) = POPOVER_VISIBLE.lock() {
        *guard = false;
    }

    if let Some(window) = app.get_webview_window("popover") {
        let _ = window.set_size(tauri::LogicalSize::new(1.0, 1.0));
        let _ = window.set_position(tauri::LogicalPosition::new(0.0, 0.0));
    }
}

fn toggle_popover(app: &AppHandle) {
    #[cfg(target_os = "macos")]
    if let Some(mtm) = MainThreadMarker::new() {
        let ns_app = NSApplication::sharedApplication(mtm);
        unsafe {
            let _: () = msg_send![&*ns_app, activateIgnoringOtherApps: true];
        }
    }

    let is_visible = POPOVER_VISIBLE.lock().map(|g| *g).unwrap_or(false);

    if is_visible {
        hide_popover(app);
    } else {
        if let Ok(mut guard) = POPOVER_VISIBLE.lock() {
            *guard = true;
        }

        if let Some(window) = app.get_webview_window("popover") {
            let _ = window.set_size(tauri::LogicalSize::new(POPOVER_WIDTH, POPOVER_HEIGHT));

            let scale = window.scale_factor().unwrap_or(2.0);

            if let Ok(guard) = TRAY_POSITION.lock() {
                if let Some(tray_pos) = guard.as_ref() {
                    let tray_x = tray_pos.x / scale;
                    let tray_y = tray_pos.y / scale;
                    let tray_width = tray_pos.width / scale;

                    let x = tray_x + (tray_width / 2.0) - (POPOVER_WIDTH / 2.0);
                    let y = tray_y + TRAY_MARGIN_Y;

                    let _ = window.set_position(tauri::LogicalPosition::new(x, y));
                } else {
                    let _ = window.center();
                }
            } else {
                let _ = window.center();
            }

            let _ = window.set_focus();
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .setup(|app| {
            #[cfg(target_os = "macos")]
            if let Some(mtm) = MainThreadMarker::new() {
                let ns_app = NSApplication::sharedApplication(mtm);
                ns_app.setActivationPolicy(NSApplicationActivationPolicy::Accessory);
            }

            let base_icon_bytes = include_bytes!("../icons/menu-icon.png");
            let initial_icon = tray::init_status_icons(base_icon_bytes);

            let toggle_preview =
                MenuItem::with_id(app, "toggle_preview", "Toggle Preview", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&toggle_preview, &quit])?;

            let tray = TrayIconBuilder::new()
                .icon(initial_icon)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "toggle_preview" => {
                        toggle_popover(app);
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        rect,
                        ..
                    } = event
                    {
                        let pos = rect.position.to_physical::<f64>(1.0);
                        let size = rect.size.to_physical::<f64>(1.0);

                        if let Ok(mut guard) = TRAY_POSITION.lock() {
                            *guard = Some(TrayIconPosition {
                                x: pos.x,
                                y: pos.y,
                                width: size.width,
                            });
                        }
                        toggle_popover(tray.app_handle());
                    }
                })
                .build(app)?;

            tray::store_tray_icon(tray);

            let popover = WebviewWindowBuilder::new(app, "popover", WebviewUrl::App("/".into()))
                .title("TrackHands")
                .inner_size(1.0, 1.0)
                .resizable(false)
                .decorations(false)
                .transparent(true)
                .shadow(false)
                .position(0.0, 0.0)
                .always_on_top(true)
                .build()?;

            let app_handle = app.handle().clone();
            popover.on_window_event(move |event| match event {
                WindowEvent::CloseRequested { api, .. } => {
                    api.prevent_close();
                    hide_popover(&app_handle);
                }
                WindowEvent::Focused(false) => {
                    if WARNING_VISIBLE.lock().map(|g| *g).unwrap_or(false) {
                        return;
                    }

                    if POPOVER_VISIBLE.lock().map(|g| *g).unwrap_or(false) {
                        hide_popover(&app_handle);
                    }
                }
                _ => {}
            });

            if let Some(monitor) = app.primary_monitor().ok().flatten() {
                let size = monitor.size();
                let scale = monitor.scale_factor();
                let width = size.width as f64 / scale;
                let height = size.height as f64 / scale;

                let warning =
                    WebviewWindowBuilder::new(app, "warning", WebviewUrl::App("/warning".into()))
                        .title("Warning")
                        .inner_size(width, height)
                        .position(0.0, 0.0)
                        .decorations(false)
                        .always_on_top(true)
                        .skip_taskbar(true)
                        .resizable(false)
                        .visible(false)
                        .build()?;

                let warning_clone = warning.clone();
                warning.on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = warning_clone.hide();
                    }
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            show_warning,
            hide_warning,
            quit_app,
            tray::set_tray_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
