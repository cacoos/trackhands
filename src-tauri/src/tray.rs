use image::{Rgba, RgbaImage};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::image::Image;
use tauri::tray::TrayIcon;

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub enum Status {
    Off,
    Clear,
    Warning,
    Alert,
}

impl Status {
    fn color(&self) -> Rgba<u8> {
        match self {
            Status::Off => Rgba([128, 128, 128, 255]),
            Status::Clear => Rgba([76, 217, 100, 255]),
            Status::Warning => Rgba([255, 204, 0, 255]),
            Status::Alert => Rgba([255, 59, 48, 255]),
        }
    }

    fn from_str(s: &str) -> Self {
        match s {
            "clear" => Status::Clear,
            "warning" => Status::Warning,
            "alert" => Status::Alert,
            _ => Status::Off,
        }
    }

    const ALL: [Status; 4] = [Status::Off, Status::Clear, Status::Warning, Status::Alert];
}

pub static TRAY_ICON: Mutex<Option<TrayIcon>> = Mutex::new(None);
static STATUS_ICONS: Mutex<Option<HashMap<Status, Image<'static>>>> = Mutex::new(None);

fn create_status_icons(base_icon_bytes: &[u8]) -> HashMap<Status, Image<'static>> {
    let base_img = image::load_from_memory(base_icon_bytes)
        .expect("Failed to load base icon")
        .to_rgba8();

    let (width, height) = base_img.dimensions();
    let dot_radius = (width.min(height) as f32 * 0.18) as i32;
    let dot_center_x = width as i32 - dot_radius - 2;
    let dot_center_y = height as i32 - dot_radius - 2;

    Status::ALL
        .iter()
        .map(|&status| {
            let mut img = base_img.clone();
            draw_filled_circle(&mut img, dot_center_x, dot_center_y, dot_radius, status.color());
            let icon = Image::new_owned(img.into_raw(), width, height);
            (status, icon)
        })
        .collect()
}

fn draw_filled_circle(img: &mut RgbaImage, cx: i32, cy: i32, radius: i32, color: Rgba<u8>) {
    let (width, height) = img.dimensions();
    for y in (cy - radius)..=(cy + radius) {
        for x in (cx - radius)..=(cx + radius) {
            if x >= 0 && y >= 0 && (x as u32) < width && (y as u32) < height {
                let dx = x - cx;
                let dy = y - cy;
                if dx * dx + dy * dy <= radius * radius {
                    img.put_pixel(x as u32, y as u32, color);
                }
            }
        }
    }
}

pub fn init_status_icons(base_icon_bytes: &[u8]) -> Image<'static> {
    let icons = create_status_icons(base_icon_bytes);
    let initial_icon = icons.get(&Status::Off).unwrap().clone();

    if let Ok(mut guard) = STATUS_ICONS.lock() {
        *guard = Some(icons);
    }

    initial_icon
}

pub fn store_tray_icon(tray: TrayIcon) {
    if let Ok(mut guard) = TRAY_ICON.lock() {
        *guard = Some(tray);
    }
}

#[tauri::command]
pub fn set_tray_status(status: String) {
    let status = Status::from_str(&status);

    if let Ok(icons_guard) = STATUS_ICONS.lock() {
        if let Some(icons) = icons_guard.as_ref() {
            if let Some(icon) = icons.get(&status) {
                if let Ok(tray_guard) = TRAY_ICON.lock() {
                    if let Some(tray) = tray_guard.as_ref() {
                        let _ = tray.set_icon(Some(icon.clone()));
                    }
                }
            }
        }
    }
}
