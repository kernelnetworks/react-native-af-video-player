import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { ToggleIcon, Time, Scrubber } from './'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    alignSelf: 'stretch',
    justifyContent: 'flex-end'
  }
})

const ControlBar = (props) => {
  const {
    onSeek,
    onSeekRelease,
    progress,
    currentTime,
    duration,
    muted,
    fullscreen,
    theme,
    inlineOnly,
    rotation
  } = props

  return (
    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} style={styles.container}>
      <Time time={currentTime} theme={theme} />
      <Scrubber
        onSeek={pos => onSeek(pos)}
        onSeekRelease={pos => onSeekRelease(pos)}
        progress={progress}
        theme={theme}
        {...{ rotation }}
      />
      <ToggleIcon
        paddingLeft
        theme={theme}
        onPress={() => props.toggleMute()}
        isOn={muted}
        iconOff="volume-up"
        iconOn="volume-mute"
        size={20}
      />
      <Time time={duration} theme={theme} />
    </LinearGradient>
  )
}

ControlBar.propTypes = {
  toggleMute: PropTypes.func,
  onSeek: PropTypes.func,
  onSeekRelease: PropTypes.func,
  fullscreen: PropTypes.bool,
  muted: PropTypes.bool,
  inlineOnly: PropTypes.bool,
  progress: PropTypes.number,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  theme: PropTypes.string,
  rotation: PropTypes.string
}

ControlBar.defaultProps = {
  toggleMute: undefined,
  onSeek: undefined,
  onSeekRelease: undefined,
  inlineOnly: false,
  fullscreen: false,
  muted: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  theme: null,
  rotation: "0deg"
}

export { ControlBar }
