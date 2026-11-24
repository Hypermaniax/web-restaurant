export function scheduleChime(context: AudioContext) {
  const start = context.currentTime
  const notes = [880, 1174.66]

  notes.forEach((frequency, index) => {
    const noteStart = start + index * 0.16
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.2, noteStart + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.5)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.55)
  })
}
