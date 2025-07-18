/**
 * Sound utility for playing completion sounds
 * 
 * This utility provides methods to play pleasant completion sounds when users
 * mark tasks or sections as complete. It uses the Web Audio API to generate
 * synthesized sounds, ensuring compatibility across browsers without requiring
 * external audio files.
 */
class SoundPlayer {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not supported:', error);
        return null;
      }
    }
    return this.audioContext;
  }

  /**
   * Creates and plays a pleasant completion sound using Web Audio API
   * The sound consists of three harmonic tones that create a satisfying completion chime
   */
  public playCompletionSound(): void {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    try {
      // Create a pleasant completion sound with multiple tones
      const now = audioContext.currentTime;
      const duration = 0.6;

      // First tone (higher pitch)
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      
      oscillator1.frequency.setValueAtTime(800, now);
      oscillator1.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      oscillator1.type = 'sine';
      
      gainNode1.gain.setValueAtTime(0, now);
      gainNode1.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      // Second tone (lower pitch, delayed)
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.setValueAtTime(600, now + 0.1);
      oscillator2.frequency.exponentialRampToValueAtTime(480, now + 0.2);
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0, now + 0.1);
      gainNode2.gain.linearRampToValueAtTime(0.12, now + 0.15);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      // Third tone (completion note)
      const oscillator3 = audioContext.createOscillator();
      const gainNode3 = audioContext.createGain();
      
      oscillator3.connect(gainNode3);
      gainNode3.connect(audioContext.destination);
      
      oscillator3.frequency.setValueAtTime(960, now + 0.2);
      oscillator3.type = 'sine';
      
      gainNode3.gain.setValueAtTime(0, now + 0.2);
      gainNode3.gain.linearRampToValueAtTime(0.1, now + 0.25);
      gainNode3.gain.exponentialRampToValueAtTime(0.01, now + duration);

      // Start and stop oscillators
      oscillator1.start(now);
      oscillator1.stop(now + 0.3);
      
      oscillator2.start(now + 0.1);
      oscillator2.stop(now + 0.5);
      
      oscillator3.start(now + 0.2);
      oscillator3.stop(now + duration);

    } catch (error) {
      console.warn('Error playing completion sound:', error);
    }
  }

  /**
   * Alternative method using HTML5 Audio for external audio files
   * @param audioPath - Path to the audio file to play
   */
  public async playAudioFile(audioPath: string): Promise<void> {
    try {
      const audio = new Audio(audioPath);
      audio.volume = 0.3; // Set a reasonable volume
      await audio.play();
    } catch (error) {
      console.warn('Error playing audio file:', error);
    }
  }
}

// Create a singleton instance
export const soundPlayer = new SoundPlayer();

/**
 * Convenience function for playing the completion sound
 * Call this function when a user completes a task or section
 */
export const playCompletionSound = (): void => {
  soundPlayer.playCompletionSound();
};