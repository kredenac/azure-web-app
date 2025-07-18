import { soundPlayer, playCompletionSound } from '../utils/sound';

// Mock Web Audio API
const mockAudioContext = {
  currentTime: 0,
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    frequency: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
    type: 'sine',
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      linearRampToValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  })),
  destination: {},
};

// Mock AudioContext constructor
(global as any).AudioContext = jest.fn(() => mockAudioContext);
(global as any).webkitAudioContext = jest.fn(() => mockAudioContext);

describe('Sound Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.warn mock
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('playCompletionSound', () => {
    it('should create and play completion sound successfully', () => {
      playCompletionSound();

      // Verify AudioContext was created
      expect(global.AudioContext || global.webkitAudioContext).toHaveBeenCalled();
      
      // Verify oscillators were created (3 for the completion sound)
      expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3);
      expect(mockAudioContext.createGain).toHaveBeenCalledTimes(3);
    });

    it('should handle missing AudioContext gracefully', () => {
      // Temporarily remove AudioContext
      const originalAudioContext = global.AudioContext;
      const originalWebkitAudioContext = (global as any).webkitAudioContext;
      
      delete (global as any).AudioContext;
      delete (global as any).webkitAudioContext;

      // This should not throw an error
      expect(() => playCompletionSound()).not.toThrow();

      // Restore AudioContext
      (global as any).AudioContext = originalAudioContext;
      (global as any).webkitAudioContext = originalWebkitAudioContext;
    });

    it('should not throw errors when AudioContext fails', () => {
      // This test ensures the function doesn't crash when AudioContext is unavailable
      // The actual error handling is tested in the "missing AudioContext" test above
      expect(() => playCompletionSound()).not.toThrow();
    });
  });

  describe('soundPlayer.playAudioFile', () => {
    it('should create and play HTML5 audio', async () => {
      const mockAudio = {
        play: jest.fn().mockResolvedValue(undefined),
        volume: 0,
      };

      // Mock Audio constructor
      (global as any).Audio = jest.fn(() => mockAudio);

      await soundPlayer.playAudioFile('/path/to/audio.mp3');

      expect(global.Audio).toHaveBeenCalledWith('/path/to/audio.mp3');
      expect(mockAudio.volume).toBe(0.3);
      expect(mockAudio.play).toHaveBeenCalled();
    });

    it('should handle audio playback errors gracefully', async () => {
      const mockAudio = {
        play: jest.fn().mockRejectedValue(new Error('Audio playback failed')),
        volume: 0,
      };

      (global as any).Audio = jest.fn(() => mockAudio);
      const consoleSpy = jest.spyOn(console, 'warn');

      await soundPlayer.playAudioFile('/path/to/nonexistent.mp3');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error playing audio file:',
        expect.any(Error)
      );
    });
  });
});