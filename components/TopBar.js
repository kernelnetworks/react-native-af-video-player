import React from 'react'
import PropTypes from 'prop-types'

import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import Icon from '../../../app/components/Icon'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    backgroundColor,
    paddingLeft: 40,
    paddingRight: 30,
    fontSize: 14,
    textAlign: "center"
  },
  logo: {
    marginLeft: 5,
    height: 25,
    width: 25
  }
})

const TopBar = (props) => {
  const {
    logo,
    more,
    title,
    theme,
    onMorePress,
    toggleFS,
    fullscreen
  } = props
  return (
    <View>
      {fullscreen ?
        <LinearGradient colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0)']} style={styles.container}>
          <View style={styles.row}>
            {logo && <Image style={styles.logo} resizeMode="contain" source={{ uri: logo }} />}
            {title ?
              <Text
                style={[styles.title, { color: theme }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              :
              <View style={{ flex: 1 }} />
            }
            <TouchableOpacity
              style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}
              onPress={() => toggleFS()}
            >
              <Icon
                iconStyle={{ fontSize: 24, color: "white" }}
                name="clear"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        :
        <View style={styles.container} />
      }
    </View>
  )
}

TopBar.propTypes = {
  toggleFS: PropTypes.func,
  title: PropTypes.string,
  logo: PropTypes.string,
  more: PropTypes.bool,
  onMorePress: PropTypes.func,
  theme: PropTypes.string
}

TopBar.defaultProps = {
  toggleFS: undefined,
  title: '',
  logo: undefined,
  more: false,
  onMorePress: undefined,
  theme: null
}

export { TopBar }
