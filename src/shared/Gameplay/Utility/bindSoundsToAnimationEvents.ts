import playRandomSoundFomSource from "./playRandomSoundFromSource";
import playSoundFromSource from "./playSoundFromSource";

const SOUND_EVNT = "Sound"
const RANDOM_SOUND_EVENT = "RandomSound"

const bindSoundsToAnimationEvents = (animation: AnimationTrack, sounds: Folder, source: Instance) => {
    animation.GetMarkerReachedSignal(SOUND_EVNT).Connect((param) => {
        const sound = sounds.FindFirstChild(param!) as Sound
        if (!sound) return
        playSoundFromSource(sound, source)
    })

    animation.GetMarkerReachedSignal(RANDOM_SOUND_EVENT).Connect((param) => {
        const folder = sounds.FindFirstChild(param!) as Folder
        if (!folder) return
        playRandomSoundFomSource(folder, source)
    })
}

export default bindSoundsToAnimationEvents;
