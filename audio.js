(() => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let context = null;
  let masterGain = null;
  let bgmGain = null;
  let sfxGain = null;
  let ambienceStarted = false;
  let bgmTimer = null;
  let bgmIndex = 0;
  let chapterAnnouncement = null;
  const ambienceNodes = [];
  let volumes = { master: 0.8, bgm: 0.55, sfx: 0.7, muted: false };

  function ensureContext() {
    if (!AudioCtx) {
      return null;
    }
    if (!context) {
      context = new AudioCtx();
      masterGain = context.createGain();
      bgmGain = context.createGain();
      sfxGain = context.createGain();
      bgmGain.connect(masterGain);
      sfxGain.connect(masterGain);
      masterGain.connect(context.destination);
      applyVolumes();
    }
    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }
    return context;
  }

  function applyVolumes() {
    if (chapterAnnouncement) {
      chapterAnnouncement.volume = volumes.muted ? 0 : volumes.master * volumes.sfx;
    }
    if (!context) {
      return;
    }
    const now = context.currentTime;
    const master = volumes.muted ? 0 : volumes.master;
    masterGain.gain.setTargetAtTime(master, now, 0.04);
    bgmGain.gain.setTargetAtTime(volumes.muted ? 0 : volumes.bgm, now, 0.04);
    sfxGain.gain.setTargetAtTime(volumes.muted ? 0 : volumes.sfx, now, 0.03);
  }

  function tone(frequency, type, duration, gain, endFrequency, when) {
    const c = ensureContext();
    if (!c) {
      return;
    }
    const start = c.currentTime + (when || 0);
    const osc = c.createOscillator();
    const envelope = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency && endFrequency !== frequency) {
      osc.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    }
    const attack = Math.min(0.012, duration * 0.3);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(gain, start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(envelope).connect(sfxGain);
    osc.start(start);
    osc.stop(start + duration + 0.06);
  }

  function noiseBurst(duration, gain, cutoff) {
    const c = ensureContext();
    if (!c) {
      return;
    }
    const length = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff || 1600;
    const envelope = c.createGain();
    envelope.gain.setValueAtTime(gain, c.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    source.connect(filter).connect(envelope).connect(sfxGain);
    source.start();
  }

  function playSfx(name) {
    switch (name) {
      case "till-close":
        noiseBurst(0.12, 0.12, 900);
        tone(120, "triangle", 0.15, 0.12, 55);
        break;
      case "printer":
        noiseBurst(0.52, 0.07, 2500);
        [0, 0.12, 0.24, 0.36].forEach(delay => tone(168, "sawtooth", 0.1, 0.026, 215, delay));
        break;
      case "cicada":
        [0, 0.25, 0.5, 0.9, 1.15].forEach(delay => tone(2200, "triangle", 0.2, 0.04, 2530, delay));
        break;
      case "ui":
        tone(520, "triangle", 0.06, 0.045, 760);
        break;
      case "advance":
        tone(300, "sine", 0.05, 0.025, 240);
        break;
      case "type":
        tone(1500, "square", 0.012, 0.008, 1200);
        break;
      case "scan":
        tone(1350, "sine", 0.075, 0.045, 1850);
        break;
      case "coin":
        tone(880, "sine", 0.18, 0.05, 1320);
        tone(1174, "sine", 0.22, 0.04, 1760, 0.06);
        break;
      case "gift":
        tone(523, "sine", 0.42, 0.05, 659);
        tone(783, "sine", 0.5, 0.04, 1047, 0.08);
        break;
      case "door":
        tone(523, "sine", 0.6, 0.05, 523);
        tone(659, "sine", 0.72, 0.04, 880, 0.12);
        break;
      case "success":
        [523, 659, 784, 1047].forEach((frequency, index) => {
          tone(frequency, "sine", 0.5, 0.045, frequency, index * 0.08);
        });
        break;
      case "blocked":
        tone(170, "square", 0.16, 0.035, 100);
        break;
      case "page":
        noiseBurst(0.12, 0.025, 1800);
        break;
      default:
        tone(520, "triangle", 0.06, 0.035, 760);
    }
  }

  function createNoiseBuffer(seconds) {
    const c = ensureContext();
    if (!c) {
      return null;
    }
    const buffer = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function ambientTone(frequency, duration, gain) {
    const c = ensureContext();
    if (!c) {
      return;
    }
    const start = c.currentTime;
    const osc = c.createOscillator();
    const envelope = c.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(gain, start + 0.6);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(envelope).connect(bgmGain);
    osc.start(start);
    osc.stop(start + duration + 0.1);
  }

  function scheduleBgm() {
    if (bgmTimer) {
      return;
    }
    const notes = [220, 261.63, 329.63, 392, 440];
    const play = () => {
      const note = notes[bgmIndex % notes.length];
      bgmIndex += 1;
      ambientTone(note, 2.8, 0.03);
      if (bgmIndex % 4 === 0) {
        ambientTone(note * 1.5, 3.4, 0.018);
      }
    };
    play();
    bgmTimer = window.setInterval(play, 3600);
  }

  function startAmbience() {
    if (ambienceStarted) {
      return;
    }
    const c = ensureContext();
    if (!c) {
      return;
    }
    ambienceStarted = true;

    const rain = c.createBufferSource();
    rain.buffer = createNoiseBuffer(4);
    rain.loop = true;
    const rainFilter = c.createBiquadFilter();
    rainFilter.type = "lowpass";
    rainFilter.frequency.value = 1400;
    const rainGain = c.createGain();
    rainGain.gain.value = 0.035;
    rain.connect(rainFilter).connect(rainGain).connect(bgmGain);
    rain.start();

    const drone = c.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 55;
    const droneGain = c.createGain();
    droneGain.gain.value = 0.012;
    drone.connect(droneGain).connect(bgmGain);
    drone.start();

    const lfo = c.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 0.01;
    lfo.connect(lfoGain).connect(rainGain.gain);
    lfo.start();

    ambienceNodes.push(rain, drone, lfo);
    scheduleBgm();
  }

  function unlock() {
    ensureContext();
    startAmbience();
  }

  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });

  window.GameAudio = {
    unlock,
    playChapterAnnouncement() {
      if (!chapterAnnouncement) {
        chapterAnnouncement = new Audio("assets/audio/station-announcement.wav");
      }
      chapterAnnouncement.volume = volumes.muted ? 0 : volumes.master * volumes.sfx;
      chapterAnnouncement.currentTime = 0;
      // Start on the route-selection gesture. The clip itself times the platform
      // chime and voice to the window dissolve, including on touch browsers.
      chapterAnnouncement.play().catch(() => {});
    },
    stopChapterAnnouncement() {
      if (chapterAnnouncement) {
        chapterAnnouncement.pause();
        chapterAnnouncement.currentTime = 0;
      }
    },
    setVolumes(next) {
      volumes = { ...volumes, ...next };
      applyVolumes();
    },
    playSfx,
    startAmbience,
    fadeAmbience(duration = 1.2) {
      if (!context || !bgmGain) {
        return;
      }
      bgmGain.gain.setTargetAtTime(0.0001, context.currentTime, Math.max(0.2, duration / 3));
    },
    restoreAmbience() {
      if (!context || !bgmGain) {
        return;
      }
      bgmGain.gain.setTargetAtTime(volumes.muted ? 0 : volumes.bgm, context.currentTime, 0.5);
    },
    stop() {
      if (bgmTimer) {
        window.clearInterval(bgmTimer);
        bgmTimer = null;
      }
      ambienceNodes.forEach((node) => {
        try {
          node.stop();
        } catch {
          // Node may already be stopped.
        }
      });
      ambienceNodes.length = 0;
      ambienceStarted = false;
    }
  };
})();
