use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent,
};
use std::sync::Mutex;

/// Minimum window width to consider the popover visible (vs minimized to 1x1)
const MIN_VISIBLE_WIDTH: u32 = 50;

#[cfg(target_os = "macos")]
use objc2::{msg_send, MainThreadMarker};
#[cfg(target_os = "macos")]
use objc2_app_kit::{NSApplication, NSApplicationActivationPolicy};

struct WindowState {
    position: (f64, f64),
}

static POPOVER_STATE: Mutex<Option<WindowState>> = Mutex::new(None);

#[tauri::command]
fn show_warning(app: AppHandle) {
    if let Some(warning) = app.get_webview_window("warning") {
        let _ = warning.show();
        let _ = warning.set_focus();
    }
    let _ = app.emit("warning-state", true);
}

#[tauri::command]
fn hide_warning(app: AppHandle) {
    if let Some(warning) = app.get_webview_window("warning") {
        let _ = warning.hide();
    }
    let _ = app.emit("warning-state", false);
}

#[tauri::command]
fn quit_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn is_popover_visible(app: AppHandle) -> bool {
    if let Some(window) = app.get_webview_window("popover") {
        let size = window.inner_size().unwrap_or(tauri::PhysicalSize::new(1, 1));
        size.width > MIN_VISIBLE_WIDTH
    } else {
        false
    }
}

#[tauri::command]
fn minimize_popover(app: AppHandle) {
    if let Some(window) = app.get_webview_window("popover") {
        let position = window.outer_position().unwrap_or(tauri::PhysicalPosition::new(0, 0));
        let scale = window.scale_factor().unwrap_or(1.0);
        
        if let Ok(mut state) = POPOVER_STATE.lock() {
            *state = Some(WindowState {
                position: (position.x as f64 / scale, position.y as f64 / scale),
            });
        }
        
        let _ = window.set_size(tauri::LogicalSize::new(1.0, 1.0));
        let _ = window.set_position(tauri::LogicalPosition::new(0.0, 0.0));
    }
}

fn show_popover(app: &AppHandle) {
    #[cfg(target_os = "macos")]
    if let Some(mtm) = MainThreadMarker::new() {
        let ns_app = NSApplication::sharedApplication(mtm);
        unsafe {
            let _: () = msg_send![&*ns_app, activateIgnoringOtherApps: true];
        }
    }
    
    if let Some(window) = app.get_webview_window("popover") {
        let size = window.inner_size().unwrap_or(tauri::PhysicalSize::new(1, 1));
        let is_visible = size.width > MIN_VISIBLE_WIDTH;
        
        if is_visible {
            let position = window.outer_position().unwrap_or(tauri::PhysicalPosition::new(0, 0));
            let scale = window.scale_factor().unwrap_or(1.0);
            
            if let Ok(mut state) = POPOVER_STATE.lock() {
                *state = Some(WindowState {
                    position: (position.x as f64 / scale, position.y as f64 / scale),
                });
            }
            
            let _ = window.set_size(tauri::LogicalSize::new(1.0, 1.0));
            let _ = window.set_position(tauri::LogicalPosition::new(0.0, 0.0));
        } else {
            let saved = POPOVER_STATE.lock().ok().and_then(|s| s.as_ref().map(|state| state.position));
            
            let _ = window.set_size(tauri::LogicalSize::new(320.0, 380.0));
            
            if let Some(pos) = saved {
                let _ = window.set_position(tauri::LogicalPosition::new(pos.0, pos.1));
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

            let icon = Image::from_bytes(include_bytes!("../icons/menu-icon.png"))?;

            let toggle_preview = MenuItem::with_id(app, "toggle_preview", "Toggle Preview", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&toggle_preview, &quit])?;

            let _tray = TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "toggle_preview" => {
                            show_popover(app);
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_popover(tray.app_handle());
                    }
                })
                .build(app)?;

            let popover = WebviewWindowBuilder::new(app, "popover", WebviewUrl::App("/".into()))
                .title("TrackHands")
                .inner_size(1.0, 1.0)
                .resizable(false)
                .decorations(true)
                .position(0.0, 0.0)
                .build()?;

            let popover_clone = popover.clone();
            popover.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    
                    let position = popover_clone.outer_position().unwrap_or(tauri::PhysicalPosition::new(0, 0));
                    let scale = popover_clone.scale_factor().unwrap_or(1.0);
                    
                    if let Ok(mut state) = POPOVER_STATE.lock() {
                        *state = Some(WindowState {
                            position: (position.x as f64 / scale, position.y as f64 / scale),
                        });
                    }
                    
                    let _ = popover_clone.set_size(tauri::LogicalSize::new(1.0, 1.0));
                    let _ = popover_clone.set_position(tauri::LogicalPosition::new(0.0, 0.0));
                }
            });

            if let Some(monitor) = app.primary_monitor().ok().flatten() {
                let size = monitor.size();
                let scale = monitor.scale_factor();
                let width = size.width as f64 / scale;
                let height = size.height as f64 / scale;

                let warning = WebviewWindowBuilder::new(app, "warning", WebviewUrl::App("/warning".into()))
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
        .invoke_handler(tauri::generate_handler![show_warning, hide_warning, quit_app, minimize_popover, is_popover_visible])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
