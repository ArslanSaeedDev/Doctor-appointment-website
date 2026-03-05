// WhatsApp-style notification sound using Web Audio API

let audioContext = null;

export const playNotificationSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const frequencies = [830, 1050];
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

export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

export const showBrowserNotification = (title, body, icon) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body?.substring(0, 100),
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'chat-message',
      silent: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => notification.close(), 5000);
  }
};
