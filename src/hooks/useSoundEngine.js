import { useState, useRef, useCallback, useEffect } from "react";

// Sound presets — each has a base frequency and modulation characteristics
const SOUND_PRESETS = {
  "Deep Calm": {
    frequency: 6000,
    type: "sine",
    modulationRate: 0.3,
    modulationDepth: 50,
    binauralBeat: 4, // theta brainwave
    description: "6,000 Hz sine with theta binaural beat",
  },
  "Ocean Drift": {
    type: "audio",
    src: "/audio/Ocean_Waves.mp3",
    description: "Ocean waves ambience",
  },
  "White Noise": {
    frequency: 0,
    type: "noise",
    noiseType: "white",
    description: "Broadband white noise",
  },
  "Pink Noise": {
    frequency: 0,
    type: "noise",
    noiseType: "pink",
    description: "Pink noise — softer high frequencies",
  },
  Rain: {
    type: "audio",
    src: "/audio/Rain.mp3",
    description: "Natural rainfall",
  },
  Forest: {
    type: "audio",
    src: "/audio/Forest.mp3",
    description: "Forest ambience",
  },
  Wind: {
    type: "audio",
    src: "/audio/Wind.mp3",
    description: "Gentle wind",
  },
  Stream: {
    type: "audio",
    src: "/audio/Stream.mp3",
    description: "Flowing water",
  },
  "Custom Hz": {
    frequency: 440,
    type: "sine",
    description: "Custom frequency tone",
    isCustom: true,
  },
};

function createNoiseBuffer(ctx, type, duration = 2) {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);

    if (type === "white") {
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === "brown") {
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
  }

  return buffer;
}

export function useSoundEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("Deep Calm");
  const [volume, setVolume] = useState(0.65);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(25 * 60); // 25 min default
  const [customFrequency, setCustomFrequency] = useState(440);

  // Bedtime mode state
  const [bedtimeEnabled, setBedtimeEnabled] = useState(false);
  const [bedtimeDuration, setBedtimeDuration] = useState(30); // minutes
  const [bedtimeTimeLeft, setBedtimeTimeLeft] = useState(null);

  // Web Audio API refs (for synthesized sounds)
  const audioCtxRef = useRef(null);
  const nodesRef = useRef({});
  const gainRef = useRef(null);

  // HTML Audio element ref (for mp3 file sounds — enables iOS background playback)
  const htmlAudioRef = useRef(null);

  // Shared refs
  const timerRef = useRef(null);
  const bedtimeTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const bedtimeStartRef = useRef(null);
  const playingTypeRef = useRef(null); // "webAudio" or "htmlAudio"

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Stop all Web Audio nodes
  const stopWebAudioNodes = useCallback(() => {
    if (nodesRef.current) nodesRef.current._cancelled = true;
    Object.entries(nodesRef.current).forEach(([key, node]) => {
      if (key === "_cancelled") return;
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    nodesRef.current = {};
  }, []);

  // Stop HTML audio element
  const stopHtmlAudio = useCallback(() => {
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current.currentTime = 0;
      htmlAudioRef.current.src = "";
      htmlAudioRef.current = null;
    }
  }, []);

  // Stop everything
  const stopAllSound = useCallback(() => {
    stopWebAudioNodes();
    stopHtmlAudio();
    playingTypeRef.current = null;
  }, [stopWebAudioNodes, stopHtmlAudio]);

  // Update Media Session API for lock screen controls
  const updateMediaSession = useCallback((soundName, playing) => {
    if (!("mediaSession" in navigator)) return;

    if (playing) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: soundName,
        artist: "EarBliss",
        album: "Tinnitus Relief",
      });
      navigator.mediaSession.playbackState = "playing";
    } else {
      navigator.mediaSession.playbackState = "none";
    }
  }, []);

  // Play an audio file preset via HTML <audio> (background-safe on iOS)
  const playHtmlAudio = useCallback((src, vol) => {
    stopHtmlAudio();
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = vol;
    audio.play().catch(() => {});
    htmlAudioRef.current = audio;
    playingTypeRef.current = "htmlAudio";
  }, [stopHtmlAudio]);

  // Build Web Audio graph for synthesized sounds
  const buildSynthGraph = useCallback(
    (preset, ctx, masterGain) => {
      stopWebAudioNodes();
      const p = SOUND_PRESETS[preset];
      if (!p) return;

      const freq = p.isCustom ? customFrequency : p.frequency;

      if (p.type === "noise") {
        const buffer = createNoiseBuffer(ctx, p.noiseType || "white");
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        let lastNode = source;

        if (p.highPassFreq) {
          const hp = ctx.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = p.highPassFreq;
          lastNode.connect(hp);
          lastNode = hp;
          nodesRef.current.highpass = hp;
        }

        if (p.modulationRate) {
          const modGain = ctx.createGain();
          modGain.gain.value = 1 - (p.modulationDepth || 0.3);
          lastNode.connect(modGain);

          const lfo = ctx.createOscillator();
          lfo.frequency.value = p.modulationRate;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = p.modulationDepth || 0.3;
          lfo.connect(lfoGain);
          lfoGain.connect(modGain.gain);
          lfo.start();

          modGain.connect(masterGain);
          nodesRef.current.lfo = lfo;
          nodesRef.current.modGain = modGain;
          nodesRef.current.lfoGain = lfoGain;
        } else {
          lastNode.connect(masterGain);
        }

        source.start();
        nodesRef.current.source = source;
      } else {
        // Tone-based sounds (sine, etc.)
        const osc = ctx.createOscillator();
        osc.type = p.type || "sine";
        osc.frequency.value = freq;

        if (p.modulationRate && p.modulationDepth) {
          const modOsc = ctx.createOscillator();
          modOsc.frequency.value = p.modulationRate;
          const modGain = ctx.createGain();
          modGain.gain.value = p.modulationDepth;
          modOsc.connect(modGain);
          modGain.connect(osc.frequency);
          modOsc.start();
          nodesRef.current.modOsc = modOsc;
          nodesRef.current.modGain = modGain;
        }

        if (p.binauralBeat) {
          const panL = ctx.createStereoPanner();
          panL.pan.value = -1;
          const panR = ctx.createStereoPanner();
          panR.pan.value = 1;

          const oscR = ctx.createOscillator();
          oscR.type = p.type || "sine";
          oscR.frequency.value = freq + p.binauralBeat;

          osc.connect(panL);
          panL.connect(masterGain);

          oscR.connect(panR);
          panR.connect(masterGain);

          oscR.start();
          nodesRef.current.oscR = oscR;
          nodesRef.current.panL = panL;
          nodesRef.current.panR = panR;
        } else {
          osc.connect(masterGain);
        }

        osc.start();
        nodesRef.current.osc = osc;
      }
      playingTypeRef.current = "webAudio";
    },
    [stopWebAudioNodes, customFrequency]
  );

  const play = useCallback(
    (preset) => {
      const soundName = preset || currentSound;
      const p = SOUND_PRESETS[soundName];
      if (!p) return;

      setCurrentSound(soundName);
      stopAllSound();

      if (p.type === "audio") {
        // Use HTML <audio> for file-based sounds (iOS background playback)
        playHtmlAudio(p.src, volume);
      } else {
        // Use Web Audio API for synthesized sounds
        const ctx = getAudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(ctx.destination);
        gainRef.current = masterGain;
        buildSynthGraph(soundName, ctx, masterGain);
      }

      setIsPlaying(true);
      updateMediaSession(soundName, true);

      // Start session timer
      startTimeRef.current = Date.now();
      setElapsedSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);

      // Start bedtime fade if enabled
      if (bedtimeEnabled) {
        const totalBedtimeMs = bedtimeDuration * 60 * 1000;
        bedtimeStartRef.current = Date.now();
        setBedtimeTimeLeft(bedtimeDuration * 60);

        if (bedtimeTimerRef.current) clearInterval(bedtimeTimerRef.current);
        bedtimeTimerRef.current = setInterval(() => {
          const el = Date.now() - bedtimeStartRef.current;
          const rem = Math.max(0, Math.ceil((totalBedtimeMs - el) / 1000));
          setBedtimeTimeLeft(rem);

          // Fade volume
          const progress = Math.min(el / totalBedtimeMs, 1);
          const fadedVolume = volume * (1 - progress);

          if (playingTypeRef.current === "htmlAudio" && htmlAudioRef.current) {
            htmlAudioRef.current.volume = fadedVolume;
          } else if (playingTypeRef.current === "webAudio" && gainRef.current && audioCtxRef.current) {
            gainRef.current.gain.setValueAtTime(fadedVolume, audioCtxRef.current.currentTime);
          }

          if (rem <= 0) {
            clearInterval(bedtimeTimerRef.current);
            stop();
          }
        }, 1000);
      }
    },
    [getAudioContext, currentSound, volume, buildSynthGraph, playHtmlAudio, stopAllSound, bedtimeEnabled, bedtimeDuration, updateMediaSession]
  );

  const stop = useCallback(() => {
    stopAllSound();

    if (gainRef.current) {
      try { gainRef.current.disconnect(); } catch (e) {}
      gainRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (bedtimeTimerRef.current) {
      clearInterval(bedtimeTimerRef.current);
      bedtimeTimerRef.current = null;
    }
    setIsPlaying(false);
    setBedtimeTimeLeft(null);
    updateMediaSession(currentSound, false);

    // Save session to localStorage if it was meaningful (>30s)
    if (elapsedSeconds > 30) {
      const sessions = JSON.parse(localStorage.getItem("earbliss_sessions") || "[]");
      sessions.unshift({
        id: Date.now(),
        type: "Sound Therapy",
        name: currentSound,
        duration: elapsedSeconds,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("earbliss_sessions", JSON.stringify(sessions.slice(0, 100)));
    }
  }, [stopAllSound, elapsedSeconds, currentSound, updateMediaSession]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  const changeSound = useCallback(
    (preset) => {
      if (isPlaying) {
        const p = SOUND_PRESETS[preset];
        if (!p) return;

        stopAllSound();

        if (p.type === "audio") {
          playHtmlAudio(p.src, volume);
        } else {
          const ctx = getAudioContext();
          const masterGain = ctx.createGain();
          masterGain.gain.value = volume;
          masterGain.connect(ctx.destination);
          gainRef.current = masterGain;
          buildSynthGraph(preset, ctx, masterGain);
        }

        updateMediaSession(preset, true);
      }
      setCurrentSound(preset);
    },
    [isPlaying, getAudioContext, buildSynthGraph, playHtmlAudio, stopAllSound, volume, updateMediaSession]
  );

  const changeVolume = useCallback(
    (newVol) => {
      setVolume(newVol);
      if (playingTypeRef.current === "htmlAudio" && htmlAudioRef.current) {
        htmlAudioRef.current.volume = newVol;
      } else if (playingTypeRef.current === "webAudio" && gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
      }
    },
    []
  );

  const changeCustomFrequency = useCallback(
    (freq) => {
      setCustomFrequency(freq);
      if (isPlaying && currentSound === "Custom Hz") {
        const ctx = getAudioContext();
        stopWebAudioNodes();
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gainRef.current);
        osc.start();
        nodesRef.current.osc = osc;
      }
    },
    [isPlaying, currentSound, getAudioContext, stopWebAudioNodes]
  );

  // Set up Media Session action handlers
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => {
      if (!isPlaying) play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      if (isPlaying) stop();
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      if (isPlaying) stop();
    });
  }, [isPlaying, play, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (bedtimeTimerRef.current) clearInterval(bedtimeTimerRef.current);
      stopWebAudioNodes();
      stopHtmlAudio();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, [stopWebAudioNodes, stopHtmlAudio]);

  const remaining = Math.max(0, sessionDuration - elapsedSeconds);

  return {
    isPlaying,
    currentSound,
    volume,
    elapsedSeconds,
    remaining,
    sessionDuration,
    setSessionDuration,
    play,
    stop,
    togglePlayPause,
    changeSound,
    changeVolume,
    presets: SOUND_PRESETS,
    presetNames: Object.keys(SOUND_PRESETS),
    // Custom frequency
    customFrequency,
    changeCustomFrequency,
    // Bedtime
    bedtimeEnabled,
    setBedtimeEnabled,
    bedtimeDuration,
    setBedtimeDuration,
    bedtimeTimeLeft,
  };
}
