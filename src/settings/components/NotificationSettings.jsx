import React, { useState } from 'react';
import '../style/NotificationSettings.css';

const NotificationSettings = () => {
  // State cho các nút gạt
  const [settings, setSettings] = useState({
    turnOnNotifications: true,
    showOnLockScreen: false,
    playSounds: true,
    shortenOnLockScreen: false
  });

  // Hàm xử lý khi gạt nút
  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // [API] Gọi API để lưu cài đặt mới lên server ở đây
    // const newStatus = !settings[key];
    // updateNotificationSettingAPI(key, newStatus);
    console.log(`Updated ${key} to ${!settings[key]}`);
  };

  return (
    <div className="notification-settings-container">
      <h3 className="notification-title">Notifications</h3>

      <div className="notification-list">
        {/* Item 1: Turn on Notifications */}
        <div className="notification-item">
          <span className="notification-label">Turn on Notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.turnOnNotifications}
              onChange={() => handleToggle('turnOnNotifications')}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Item 2: Show notifications on lock screen */}
        <div className="notification-item secondary-bg">
          <span className="notification-label">Show notifications on lock screen</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.showOnLockScreen}
              onChange={() => handleToggle('showOnLockScreen')}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Item 3: Allows notification to play sounds */}
        <div className="notification-item secondary-bg">
          <span className="notification-label">Allows notification to play sounds</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.playSounds}
              onChange={() => handleToggle('playSounds')}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Item 4: Only show shorten notifications on lock screen */}
        <div className="notification-item secondary-bg">
          <span className="notification-label">Only show shorten notifications on lock screen</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.shortenOnLockScreen}
              onChange={() => handleToggle('shortenOnLockScreen')}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;