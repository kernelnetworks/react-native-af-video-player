import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Easing,
  StyleSheet,
  Animated
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  lineContainer: {
    flexDirection: 'row',
    height: 35,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  line: {
    height: 3,
    width: 75,
    marginBottom: 5
  }
})

class Loading extends Component {
  constructor() {
    super()
    this.anim = {
      width: new Animated.Value(10),
      translateX: new Animated.Value(-50)
    }
  }

  componentDidMount() {
    Animated.loop(Animated.parallel([
      Animated.sequence([
        Animated.timing(this.anim.width, {
          toValue: 75,
          easing: Easing.back(1),
          duration: 750
        }),
        Animated.timing(this.anim.width, {
          toValue: 10,
          // easing: Easing.back(2),
          duration: 250
        }),
        Animated.timing(this.anim.width, {
          toValue: 75,
          easing: Easing.back(1),
          duration: 750
        }),
        Animated.timing(this.anim.width, {
          toValue: 10,
          // easing: Easing.back(2),
          duration: 250
        })
      ]),
      Animated.sequence([
        Animated.timing(this.anim.translateX, { toValue: 50, easing: Easing.back(1), duration: 1000 }),
        Animated.timing(this.anim.translateX, { toValue: -50, easing: Easing.back(1), duration: 1000 })
      ])
    ])).start()
  }

  render() {
    const { translateX, width } = this.anim
    if (this.props.loading) {
      return (
        <View style={styles.container}>
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} style={styles.lineContainer}>
            <Animated.View style={[
              styles.line,
              {
                backgroundColor: this.props.theme,
                width,
                opacity: 0.7,
                transform: [{ translateX }]
              }
            ]}
            />
          </LinearGradient>
        </View>
      )
    }
    return null
  }
}

Loading.propTypes = {
  loading: PropTypes.bool,
  theme: PropTypes.string
}

Loading.defaultProps = {
  loading: true,
  theme: null
}

export { Loading }
