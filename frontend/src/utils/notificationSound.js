// WhatsApp-style notification sound using Web Audio API
// No external audio files needed - generates a clean notification tone

let audioContext = null;

export const playNotificationSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Create a pleasant two-tone notification (like WhatsApp)
    const frequencies = [830, 1050]; // Two ascending tones
    const duration = 0.12;

    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + i * 0.15);

      gainNode.gain.setValueAtTime(0, now + i * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + duration);

      oscillator.start(now + i * 0.15);
      oscillator.stop(now + i * 0.15 + duration + 0.05);
    });
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

// Request browser notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

// Show browser notification (works even when tab is not focused)
export const showBrowserNotification = (title, body, icon) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body?.substring(0, 100),
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'chat-message', // Replaces previous notification
      silent: true, // We play our own sound
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
};
