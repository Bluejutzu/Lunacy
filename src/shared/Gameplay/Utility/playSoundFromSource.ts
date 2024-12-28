const playSoundFromSource = (soundTemplate: Sound, source: Instance) => {
    const sound = soundTemplate.Clone();
    sound.Parent = source;

    sound.Play();
    sound.Ended.Once(() => {
        if (sound.IsDescendantOf(game)) {
            sound.Destroy()
        }
    });
}

export default playSoundFromSource;