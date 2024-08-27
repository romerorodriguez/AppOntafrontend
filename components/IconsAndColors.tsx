import { Ionicons } from '@expo/vector-icons';

export type IconName = 
  | "home" | "home-outline" | "cart" | "cart-outline" | "heart" | "heart-outline"
  | "person" | "person-outline" | "settings" | "settings-outline" | "star" | "star-outline"
  | "book" | "book-outline" | "camera" | "camera-outline" | "car" | "car-outline"
  | "airplane" | "airplane-outline" | "alarm" | "alarm-outline" | "analytics" | "analytics-outline"
  | "apps" | "apps-outline" | "archive" | "archive-outline" | "arrow-back" | "arrow-forward"
  | "at" | "at-outline" | "attach" | "attach-outline" | "barbell" | "barbell-outline"
  | "basket" | "basket-outline" | "battery-full" | "bluetooth" | "bluetooth-outline"
  | "briefcase" | "briefcase-outline" | "build" | "build-outline" | "bulb" | "bulb-outline"
  | "bus" | "bus-outline" | "business" | "business-outline" | "cafe" | "cafe-outline"
  | "calendar" | "calendar-outline" | "call" | "call-outline" | "cash" | "cash-outline"
  | "chatbox" | "chatbox-outline" | "checkbox" | "checkbox-outline" | "checkmark" | "checkmark-circle"
  | "clipboard" | "clipboard-outline" | "close" | "close-circle" | "cloud" | "cloud-outline"
  | "code" | "code-outline" | "cog" | "cog-outline" | "compass" | "compass-outline"
  | "construct" | "construct-outline" | "copy" | "copy-outline" | "cut" | "cut-outline"
  | "document" | "document-outline" | "download" | "download-outline" | "earth" | "earth-outline"
  | "easel" | "easel-outline" | "egg" | "egg-outline" | "exit" | "exit-outline"
  | "eye" | "eye-outline" | "film" | "film-outline" | "filter" | "filter-outline"
  | "finger-print" | "finger-print-outline" | "fish" | "fish-outline" | "flag" | "flag-outline"
  | "flash" | "flash-outline" | "flask" | "flask-outline" | "flower" | "flower-outline"
  | "folder" | "folder-outline" | "football" | "football-outline" | "game-controller" | "game-controller-outline"
  | "gift" | "gift-outline" | "grid" | "grid-outline" | "hammer" | "hammer-outline"
  | "hand-left" | "hand-left-outline" | "happy" | "happy-outline" | "headset" | "headset-outline"
  | "help" | "help-circle" | "help-outline" | "home" | "home-outline" | "hourglass" | "hourglass-outline"
  | "ice-cream" | "ice-cream-outline" | "image" | "image-outline" | "images" | "images-outline"
  | "infinite" | "infinite-outline" | "information" | "information-circle" | "information-outline"
  | "journal" | "journal-outline" | "key" | "key-outline" | "language" | "language-outline"
  | "laptop" | "laptop-outline" | "layers" | "layers-outline" | "leaf" | "leaf-outline"
  | "library" | "library-outline" | "link" | "link-outline" | "list" | "list-outline"
  | "location" | "location-outline" | "lock-closed" | "lock-closed-outline" | "lock-open" | "lock-open-outline"
  | "log-in" | "log-in-outline" | "log-out" | "log-out-outline" | "mail" | "mail-outline"
  | "male-female" | "male-female-outline" | "man" | "man-outline" | "map" | "map-outline"
  | "medal" | "medal-outline" | "medical" | "medical-outline" | "medkit" | "medkit-outline"
  | "megaphone" | "megaphone-outline" | "menu" | "menu-outline" | "mic" | "mic-outline"
  | "moon" | "moon-outline" | "musical-note" | "musical-note-outline" | "newspaper" | "newspaper-outline"
  | "notifications" | "notifications-outline" | "nuclear" | "nuclear-outline" | "nutrition" | "nutrition-outline"
  | "open" | "open-outline" | "options" | "options-outline" | "paper-plane" | "paper-plane-outline"
  | "partly-sunny" | "partly-sunny-outline" | "pause" | "pause-outline" | "paw" | "paw-outline"
  | "pencil" | "pencil-outline" | "people" | "people-outline" | "phone-portrait" | "phone-portrait-outline"
  | "pie-chart" | "pie-chart-outline" | "pin" | "pin-outline" | "planet" | "planet-outline"
  | "play" | "play-outline" | "podium" | "podium-outline" | "power" | "power-outline"
  | "pricetag" | "pricetag-outline" | "print" | "print-outline" | "pulse" | "pulse-outline"
  | "push" | "push-outline" | "radio" | "radio-outline" | "refresh" | "refresh-outline"
  | "reload" | "reload-outline" | "remove" | "remove-outline" | "reorder-four" | "reorder-four-outline"
  | "resize" | "resize-outline" | "restaurant" | "restaurant-outline" | "return-down-back" | "return-down-back-outline"
  | "rocket" | "rocket-outline" | "save" | "save-outline" | "scan" | "scan-outline"
  | "school" | "school-outline" | "search" | "search-outline" | "send" | "send-outline"
  | "share" | "share-outline" | "shield" | "shield-outline" | "shirt" | "shirt-outline"
  | "shuffle" | "shuffle-outline" | "skull" | "skull-outline" | "snow" | "snow-outline"
  | "speedometer" | "speedometer-outline" | "square" | "square-outline" | "stop" | "stop-outline"
  | "stopwatch" | "stopwatch-outline" | "subway" | "subway-outline" | "sunny" | "sunny-outline"
  | "swap-horizontal" | "swap-horizontal-outline" | "sync" | "sync-outline" | "tablet-landscape" | "tablet-landscape-outline"
  | "tablet-portrait" | "tablet-portrait-outline" | "tennisball" | "tennisball-outline" | "terminal" | "terminal-outline"
  | "text" | "text-outline" | "thermometer" | "thermometer-outline" | "thumbs-down" | "thumbs-down-outline"
  | "thumbs-up" | "thumbs-up-outline" | "thunderstorm" | "thunderstorm-outline" | "time" | "time-outline"
  | "timer" | "timer-outline" | "today" | "today-outline" | "toggle" | "toggle-outline"
  | "trail-sign" | "trail-sign-outline" | "train" | "train-outline" | "transgender" | "transgender-outline"
  | "trash" | "trash-outline" | "trophy" | "trophy-outline" | "tv" | "tv-outline"
  | "umbrella" | "umbrella-outline" | "videocam" | "videocam-outline" | "volume-high" | "volume-high-outline"
  | "walk" | "walk-outline" | "wallet" | "wallet-outline" | "warning" | "warning-outline"
  | "watch" | "watch-outline" | "water" | "water-outline" | "wifi" | "wifi-outline"
  | "wine" | "wine-outline" | "woman" | "woman-outline";

  export const iconList: IconName[] = [
    'home', 'radio', 'cart', 'heart', 'person', 'settings', 'star', 'book', 'camera', 'car', 'airplane',
    'alarm', 'analytics', 'apps', 'archive', 'attach', 'barbell', 'basket', 'bluetooth',
    'briefcase', 'build', 'bulb', 'bus', 'business', 'cafe', 'calendar', 'call', 'cash',
    'chatbox', 'checkbox', 'clipboard', 'cloud', 'code', 'compass', 'construct', 'copy',
    'document', 'download', 'earth', 'easel', 'egg', 'exit', 'eye', 'film', 'filter',
    'finger-print', 'fish', 'flag', 'flash', 'flask', 'flower', 'folder', 'football',
    'game-controller', 'gift', 'grid', 'hammer', 'happy', 'headset', 'help', 'hourglass',
    'ice-cream', 'image', 'infinite', 'information', 'journal', 'key', 'language', 'laptop',
    'layers', 'leaf', 'library', 'link', 'list', 'location', 'lock-closed', 'lock-open',
    'mail', 'map', 'medal', 'medical', 'megaphone', 'menu', 'mic', 'moon', 'musical-note',
    'newspaper', 'notifications', 'nutrition', 'pencil', 'people', 'pie-chart', 'pin',
    'planet', 'play', 'print', 'pulse', 'rocket', 'school', 'search', 'send',
    'share', 'shield', 'shirt', 'shuffle', 'stopwatch', 'sunny',
    'tennisball', 'thumbs-up', 'time', 'trophy', 'umbrella', 'videocam', 'wallet', 'warning',
    'water', 'wifi', 'wine', 'home-outline', 'cart-outline', 'heart-outline', 'person-outline',
    'settings-outline', 'star-outline', 'book-outline', 'camera-outline', 'car-outline',
    'airplane-outline', 'alarm-outline', 'analytics-outline', 'apps-outline', 'archive-outline',
    'barbell-outline', 'basket-outline', 'bluetooth-outline', 'briefcase-outline', 'build-outline',
    'bulb-outline', 'bus-outline', 'business-outline', 'cafe-outline', 'calendar-outline',
    'call-outline', 'cash-outline', 'chatbox-outline', 'checkbox-outline', 'clipboard-outline',
    'cloud-outline', 'code-outline', 'compass-outline', 'construct-outline', 'copy-outline',
    'document-outline', 'download-outline', 'earth-outline', 'easel-outline', 'egg-outline',
    'exit-outline', 'eye-outline', 'film-outline', 'filter-outline', 'finger-print-outline',
    'fish-outline', 'flag-outline', 'flash-outline', 'flask-outline', 'flower-outline',
    'folder-outline', 'football-outline', 'game-controller-outline', 'gift-outline', 'grid-outline',
    'hammer-outline', 'happy-outline', 'headset-outline', 'help-circle', 'hourglass-outline',
    'ice-cream-outline', 'image-outline', 'images-outline', 'infinite-outline', 'information-circle',
    'information-outline', 'journal-outline', 'key-outline', 'language-outline', 'laptop-outline',
    'layers-outline', 'leaf-outline', 'library-outline', 'link-outline', 'list-outline',
    'location-outline', 'lock-closed-outline', 'lock-open-outline', 'mail-outline', 'map-outline',
    'medal-outline', 'medical-outline', 'megaphone-outline', 'menu-outline', 'mic-outline',
    'moon-outline', 'musical-note-outline', 'newspaper-outline', 'notifications-outline',
    'nutrition-outline', 'pencil-outline', 'people-outline', 'phone-portrait-outline',
    'pie-chart-outline', 'pin-outline', 'planet-outline', 'play-outline', 'power-outline',
    'pricetag-outline', 'print-outline', 'pulse-outline', 'push-outline', 'radio-outline',
    'refresh-outline', 'reload-outline', 'remove-outline', 'restaurant-outline', 'return-down-back-outline',
    'rocket-outline', 'save-outline', 'scan-outline', 'school-outline', 'search-outline', 'send-outline',
    'share-outline', 'shield-outline', 'shirt-outline', 'shuffle-outline', 'skull-outline',
    'snow-outline', 'speedometer-outline', 'square-outline', 'stop-outline', 'stopwatch-outline',
    'sunny-outline', 'swap-horizontal-outline', 'sync-outline', 'tablet-landscape-outline',
    'tablet-portrait-outline', 'tennisball-outline', 'terminal-outline', 'text-outline',
    'thermometer-outline', 'thumbs-down-outline', 'thumbs-up-outline', 'thunderstorm-outline',
    'time-outline', 'timer-outline', 'today-outline', 'toggle-outline', 'trail-sign-outline',
    'train-outline', 'transgender-outline', 'trash-outline', 'trophy-outline', 'tv-outline',
    'umbrella-outline', 'videocam-outline', 'volume-high-outline', 'walk-outline', 'wallet-outline',
    'warning-outline', 'watch-outline', 'water-outline', 'wifi-outline', 'wine-outline', 'woman-outline'
  ];  

  export const colorList = [
    '#FF7306', '#FF0A0A', '#0A0AFF', '#0AFF0A', '#FFFF0A', '#0AFFFF',
    '#FF69B4', '#1E90FF', '#48d1cc', '#FFD700', '#FF4500', '#FF6347',
    '#DA70D6', '#DC143C', '#00BFFF', '#40E0D0', '#BA55D3', '#FF1493',
    '#FFA500', '#FFDB58', '#00FF7F', '#32CD32', '#00CED1',
    '#FF0080', '#FF5722', '#FFEB3B', '#E91E63', '#4CAF50', '#FF9800',
    '#9C27B0', '#FFC107', '#00BFAE', '#E64A19', '#C2185B', '#8BC34A',
    '#FF4081', '#03A9F4', '#8E24AA', '#CDDC39', '#7C4DFF', '#FF6F00'
  ];  