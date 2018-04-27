import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from '../../../app/components/Icon'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  playContainer: {
    flex: 1,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

const PlayButton = props => (
  <View style={styles.playContainer}>
    <TouchableOpacity
      style={styles.playButton}
      onPress={() => props.onPress()}
    >
      <Icon
        style={styles.playIcon}
        iconStyle={{ fontSize: 40, color: "white" }}
        name={props.paused ? 'play' : 'pause'}
      />
    </TouchableOpacity>
  </View>
)

PlayButton.propTypes = {
  onPress: PropTypes.func,
  paused: PropTypes.bool,
  theme: PropTypes.string
}

PlayButton.defaultProps = {
  onPress: undefined,
  paused: false,
  theme: null
}

export { PlayButton }
