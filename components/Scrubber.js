import React from 'react' // eslint-disable-line
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Slider
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  slider: {
    marginHorizontal: -10
  }
})

const Scrubber = (props) => {
  const trackColor = 'rgba(255,255,255,0.5)'
  const { progress, theme } = props
  const thumbStyle = { width: 15, height: 15 }
  const trackStyle = { borderRadius: 1 }
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        onValueChange={val => props.onSeek(val)}
        onSlidingComplete={val => props.onSeekRelease(val)}
        value={progress}
        thumbTintColor={theme}
        minimumTrackTintColor={theme}
        maximumTrackTintColor={trackColor}
      />
    </View>
  )
}

Scrubber.propTypes = {
  onSeek: PropTypes.func,
  onSeekRelease: PropTypes.func,
  progress: PropTypes.number,
  theme: PropTypes.string,
  rotation: PropTypes.string,
}

Scrubber.defaultProps = {
  onSeek: undefined,
  onSeekRelease: undefined,
  progress: 0,
  theme: null,
  rotation: "0deg"
}

export { Scrubber }
