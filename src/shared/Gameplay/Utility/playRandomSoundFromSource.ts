import playSoundFromSource from "./playSoundFromSource";

const rng = new Random();

const playRandomSoundFomSource = (soundTemplates: Folder, source: Instance) => {
    const sounds  = soundTemplates.GetChildren().filter((child) => child.IsA("Sound")) as Sound[];
    const sound = sounds[rng.NextInteger(1, sounds.size())];
    playSoundFromSource(sound, source);
}

export default playRandomSoundFomSource;
