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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  <TouchableOpacity
    style={styles.playContainer}
    onPress={() => props.onPress()}
  >
    <View style={styles.playButton}>
      <Icon
        style={styles.playIcon}
        iconStyle={{ fontSize: 40, color: "white" }}
        name={props.paused ? 'play' : 'pause'}
      />
    </View>
  </TouchableOpacity>
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
