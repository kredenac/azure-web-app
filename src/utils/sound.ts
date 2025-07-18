/**
 * Simple sound utility for playing completion sounds
 * Uses HTML5 Audio to play a pre-recorded completion sound
 */

/**
 * Plays a completion sound when a task is marked as complete
 */
export const playCompletionSound = (): void => {
  try {
    const audio = new Audio('/completion-sound.mp3');
    audio.volume = 0.3; // Set a reasonable volume
    audio.play().catch((error) => {
      // Silently handle any playback errors (e.g., user hasn't interacted with page yet)
      console.debug('Sound playback failed:', error);
    });
  } catch (error) {
    // Silently handle any audio creation errors
    console.debug('Could not create audio element:', error);
  }
};