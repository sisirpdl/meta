import { Audio, AudioListener, AudioLoader } from "@iwsdk/core";

/**
 * Simple sound manager for loading and playing audio effects
 * Eliminates boilerplate audio code
 */
export class SoundManager {
    private listener: AudioListener;
    private sounds: Map<string, Audio> = new Map();
    private loader: AudioLoader;

    constructor(listenerParent: any) {
        this.listener = new AudioListener();
        listenerParent.add(this.listener);
        this.loader = new AudioLoader();
        console.log("✅ SoundManager initialized");
    }

    /**
     * Load a sound file and register it with a name
     * @param name - Identifier for the sound (e.g., 'grab', 'delete')
     * @param path - Path to audio file
     * @param volume - Volume level (0.0 to 1.0)
     */
    load(name: string, path: string, volume: number = 0.5): void {
        const sound = new Audio(this.listener);
        
        this.loader.load(
            path,
            (buffer: any) => {
                sound.setBuffer(buffer);
                sound.setVolume(volume);
                console.log(`✅ Sound loaded: ${name} (${path})`);
            },
            undefined,
            (error: any) => {
                console.warn(`⚠️ Failed to load sound '${name}':`, error);
            }
        );

        this.sounds.set(name, sound);
    }

    /**
     * Play a sound by name
     * @param name - Identifier of the sound to play
     * @param forceRestart - If true, stops and restarts the sound if already playing
     */
    play(name: string, forceRestart: boolean = false): void {
        const sound = this.sounds.get(name);
        
        if (!sound) {
            console.warn(`⚠️ Sound '${name}' not found`);
            return;
        }

        if (sound.isPlaying) {
            if (forceRestart) {
                sound.stop();
                sound.play();
            }
            // Otherwise, don't interrupt the currently playing sound
        } else {
            sound.play();
        }
    }

    /**
     * Stop a sound by name
     */
    stop(name: string): void {
        const sound = this.sounds.get(name);
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }

    /**
     * Check if a sound is currently playing
     */
    isPlaying(name: string): boolean {
        const sound = this.sounds.get(name);
        return sound ? sound.isPlaying : false;
    }

    /**
     * Set volume for a specific sound
     */
    setVolume(name: string, volume: number): void {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.setVolume(volume);
        }
    }

    /**
     * Dispose of all sounds and clean up resources
     */
    dispose(): void {
        this.sounds.forEach((sound) => {
            if (sound.isPlaying) {
                sound.stop();
            }
            sound.disconnect();
        });
        this.sounds.clear();
        console.log("🧹 SoundManager disposed");
    }
}

