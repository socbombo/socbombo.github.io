import { currentLanguage } from "./settings.js";

export default class SoundManager {
    constructor() {
        this.audio = new Audio();
        this.wait_src = '';
        this.wait_volume = 1;
        this.wait_loop = false;
        this.isMuted = false;
        this.isReadyToPlay = false; // Track if the user has interacted
        this.soundFile = '';
        this.soundFileEn = '';
        window.audio = this;
    }

    /**
     * Set up event listener for user interaction to allow sound playback.
     */
    enableUserInteraction() {
        window.addEventListener('pointerdown', this.handleUserInteraction.bind(this), { once: true });
        window.addEventListener('keydown', this.handleUserInteraction.bind(this), { once: true });
    }

    /**
     * Handle user interaction to enable sound playback.
     */
    handleUserInteraction() {
        this.isReadyToPlay = true; // User has interacted, allow sounds to play
        if (this.wait_src) {
            setTimeout(() => {
                this.play(this.soundFile, this.soundFileEn, this.wait_volume, this.wait_loop);
            }, 500);
        }
    }

    /**
     * Play a sound.
     * @param {string} soundFile - The path to the sound file.
     */
    play(soundFile, soundFileEn, volume = 1.0, loop = false) {
        this.soundFile = soundFile;
        this.soundFileEn = soundFileEn;
        if (!this.isReadyToPlay) {
            this.wait_src = soundFile;
            this.wait_volume = volume;
            this.wait_loop = loop;
            console.warn("User interaction required to play sound.");
            return; // Exit if user hasn't interacted yet
        }

        let english = currentLanguage == 'en';
        if (english) {
            this.audio.src = location.origin + '/assets/sounds/' + soundFileEn;
        }
        else {
            this.audio.src = location.origin + '/assets/sounds/' + soundFile;
        }
        this.audio.volume = volume;
        this.audio.play() // Play the sound
            .catch(error => console.error("Error playing sound:", error));
    }



    /**
     * Stop the currently playing sound.
     */
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0; // Reset the playback position to the start
    }

    /**
     * Change the sound file.
     * @param {string} newSoundFile - The new sound file to play.
     */
    changeSound() {
        this.play(this.soundFile, this.soundFileEn);
    }

    /**
     * Mute or unmute the audio.
     */
    mute(isMuted) {
        this.isMuted = isMuted;
        this.audio.muted = this.isMuted;
    }

    isPlaying() {
        return this.audio.duration > 0 && !this.audio.paused;
    }
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}