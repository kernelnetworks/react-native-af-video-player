import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  BackHandler,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import VideoPlayer from "react-native-video";
import KeepAwake from "react-native-keep-awake";
import Orientation from "react-native-orientation";
import Icon from "../../../app/components/Icon";
import { Controls } from "./";
const Win = Dimensions.get("window");
const backgroundColor = "#000";

const styles = StyleSheet.create({
  background: {
    backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 98
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  playIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: !props.autoPlay,
      muted: false,
      fullScreen: false,
      inlineHeight: Win.width * 0.5625,
      loading: false,
      duration: 0,
      progress: 0,
      currentTime: 0,
      seeking: false,
      renderError: false,
      rotation: "0deg",
      orientation: Orientation.getInitialOrientation()
    };
    this.BackHandler = this.BackHandler.bind(this);
    this.onRotated = this.onRotated.bind(this);
    this.orientationDidChange = this.orientationDidChange.bind(this);
  }

  componentDidMount() {
    Orientation.addOrientationListener(this.orientationDidChange);
    Orientation.addSpecificOrientationListener(this.onRotated);
    BackHandler.addEventListener("hardwareBackPress", this.BackHandler);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange);
    Orientation.removeSpecificOrientationListener(this.onRotated);
    BackHandler.removeEventListener("hardwareBackPress", this.BackHandler);
  }

  onLoadStart() {
    this.setState({ paused: true, loading: true });
  }

  onLoad(data) {
    if (!this.state.loading) return;
    this.props.onLoad(data);
    const { height, width } = data.naturalSize;
    const ratio =
      height === "undefined" && width === "undefined" ? 9 / 16 : height / width;
    const inlineHeight = this.props.lockRatio
      ? Win.width / this.props.lockRatio
      : Win.width * ratio;
    this.setState(
      {
        paused: !this.props.autoPlay,
        loading: false,
        inlineHeight,
        duration: data.duration
      },
      () => {
        if (!this.state.paused) {
          KeepAwake.activate();
          if (this.props.fullScreenOnly) {
            this.setState({ fullScreen: true });
          }
        }
      }
    );
  }

  onEnd() {
    this.props.onEnd();
    const { loop } = this.props;
    if (!loop) this.pause();
    this.onSeekRelease(0);
    this.setState({ currentTime: 0 }, () => {
      if (!loop) this.controls.showControls();
    });
  }

  orientationDidChange = orientation => {
    if (orientation !== this.state.orientation) {
      this.setState({ orientation });
      this.props.fullscreenLandscape &&
        this.setState({ fullScreen: orientation === "LANDSCAPE" });
    }
  };

  onRotated = orientation => {
    // Add this condition incase if inline and fullscreen options are turned on
    if (this.props.inlineOnly) return;

    let { rotation } = this.state;
    switch (orientation) {
      case "PORTRAIT":
        this.setState({ rotation: "0deg" });
        break;
      case "LANDSCAPE-LEFT":
        this.setState({ rotation: "90deg" });
        break;
      case "PORTRAITUPSIDEDOWN":
        this.setState({ rotation: "180deg" });
        break;
      case "LANDSCAPE-RIGHT":
        this.setState({ rotation: "270deg" });
        break;
      default:
        this.setState({ rotation: "0deg" });
    }
  };

  onSeekRelease(pos) {
    const newPosition = pos * this.state.duration;
    this.setState({ progress: pos, seeking: false }, () => {
      this.player.seek(newPosition);
    });
  }

  onError(msg) {
    this.props.onError(msg);
    const { error } = this.props;
    this.setState({ renderError: true }, () => {
      let type;
      switch (true) {
        case error === false:
          type = error;
          break;
        case typeof error === "object":
          type = Alert.alert(
            error.title,
            error.message,
            error.button,
            error.options
          );
          break;
        default:
          type = Alert.alert(
            "Oops!",
            "There was an error playing this video, please try again later.",
            [{ text: "Close" }]
          );
          break;
      }
      return type;
    });
  }

  BackHandler() {
    if (this.state.fullScreen) {
      this.setState({ fullScreen: false }, () => {
        this.props.onFullScreen(this.state.fullScreen);
        if (this.props.fullScreenOnly && !this.state.paused) this.togglePlay();
        if (this.props.rotateToFullScreen) Orientation.lockToPortrait();
        setTimeout(() => {
          if (!this.props.lockPortraitOnFsExit)
            Orientation.unlockAllOrientations();
        }, 1500);
      });
      return true;
    }
    return false;
  }

  pause() {
    if (!this.state.paused) this.togglePlay();
  }

  play() {
    if (this.state.paused) this.togglePlay();
  }

  togglePlay() {
    if (this.props.skipPlaying) {
      this.props.onPlayPressed();
    } else {
      this.setState({ paused: !this.state.paused }, () => {
        Orientation.getOrientation((e, orientation) => {
          if (this.props.inlineOnly) return;
          if (!this.state.paused) {
            if (this.props.fullScreenOnly && !this.state.fullScreen) {
              this.setState({ fullScreen: true }, () => {
                this.props.onFullScreen(this.state.fullScreen);
                const initialOrient = Orientation.getInitialOrientation();
                if (this.props.rotateToFullScreen)
                  Orientation.lockToLandscape();
              });
            }
            KeepAwake.activate();
          } else {
            KeepAwake.deactivate();
          }
        });
      });
    }
  }

  toggleFS() {
    let {
      onFullScreen,
      rotateToFullScreen,
      fullScreenOnly,
      lockPortraitOnFsExit,
      fullscreenLandscape,
      exitFullscreen
    } = this.props;

    if (fullscreenLandscape) {
      this.setState({ fullScreen: false });
      exitFullscreen();
      return;
    }

    this.setState({ fullScreen: !this.state.fullScreen }, () => {
      Orientation.getOrientation((e, orientation) => {
        if (this.state.fullScreen) {
          const initialOrient = Orientation.getInitialOrientation();
          onFullScreen(this.state.fullScreen);
          if (rotateToFullScreen) Orientation.lockToLandscape();
        } else {
          if (fullScreenOnly) this.setState({ paused: true });
          onFullScreen(this.state.fullScreen);
          if (rotateToFullScreen) Orientation.lockToPortrait();
          setTimeout(() => {
            if (!lockPortraitOnFsExit) Orientation.unlockAllOrientations();
          }, 1500);
        }
      });
    });
  }

  toggleMute() {
    this.setState({ muted: !this.state.muted });
  }

  seek(val) {
    const currentTime = val * this.state.duration;
    this.setState({ seeking: true, currentTime });
  }

  progress(time) {
    const { currentTime } = time;
    const progress = currentTime / this.state.duration;
    if (!this.state.seeking) {
      this.setState({ progress, currentTime }, () => {
        this.props.onProgress(time);
      });
    }
  }

  checkSource(uri) {
    return typeof uri === "string" ? { source: { uri } } : { source: uri };
  }

  renderError() {
    const { fullScreen, inlineHeight } = this.state;
    const inline = {
      height: inlineHeight,
      alignSelf: "stretch"
    };
    const textStyle = { color: "white", padding: 10 };
    return (
      <View
        style={[styles.background, fullScreen ? styles.fullScreen : inline]}
      >
        <Text style={textStyle}>Retry</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => this.setState({ renderError: false })}
        >
          <Icon
            style={styles.playIcon}
            iconStyle={{ fontSize: 40, color: "white" }}
            name="play"
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderPlayer() {
    const {
      fullScreen,
      paused,
      muted,
      loading,
      progress,
      duration,
      inlineHeight,
      currentTime,
      rotation,
      orientation
    } = this.state;

    const {
      url,
      loop,
      title,
      logo,
      rate,
      style,
      volume,
      placeholder,
      theme,
      onTimedMetadata,
      resizeMode,
      onMorePress,
      inlineOnly,
      playInBackground,
      playWhenInactive,
      fullScreenControlsOnly,
      initialSeek,
      exitFullscreen,
      allowRotation
    } = this.props;

    const inline = {
      height: this.props.height ? this.props.height : inlineHeight,
      alignSelf: "stretch"
    };

    let landscapePos = (Win.height - Win.width) / 2;
    let resize =
      orientation === "LANDSCAPE"
        ? { height: Win.width, width: Win.height }
        : { height: Win.height, width: Win.width };

    let rotationStyle = {
      transform: [{ rotate: rotation }],
      left:
        Platform.OS === "ios" && orientation === "LANDSCAPE"
          ? -landscapePos
          : null,
      top:
        Platform.OS === "ios" && orientation === "LANDSCAPE"
          ? landscapePos
          : null
    };

    return (
      <View
        style={[
          fullScreen && allowRotation && rotationStyle,
          styles.background,
          fullScreen ? resize : inline
        ]}
      >
        <StatusBar hidden={fullScreen} />
        {((loading && placeholder) || currentTime < 0.1) && (
          <Image
            resizeMode="cover"
            style={styles.image}
            source={{ uri: placeholder }}
          />
        )}
        <VideoPlayer
          {...this.checkSource(url)}
          paused={paused}
          resizeMode={resizeMode}
          repeat={loop}
          style={fullScreen ? resize : inline}
          ref={ref => {
            this.player = ref;
          }}
          rate={rate}
          volume={volume}
          muted={muted}
          ignoreSilentSwitch={"ignore"}
          playInBackground={playInBackground} // Audio continues to play when app entering background.
          playWhenInactive={playWhenInactive} // [iOS] Video continues to play when control or notification center are shown.
          // progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
          onLoadStart={() => this.onLoadStart()} // Callback when video starts to load
          onLoad={e => {
            this.onLoad(e); // Callback when video loads
            initialSeek && this.player.seek(initialSeek);
          }}
          onProgress={e => this.progress(e)} // Callback every ~250ms with currentTime
          onEnd={() => this.onEnd()}
          onError={e => this.onError(e)}
          // onBuffer={() => this.onBuffer()} // Callback when remote video is buffering
          onTimedMetadata={e => onTimedMetadata(e)} // Callback when the stream receive some metadata
        />
        <Controls
          ref={ref => {
            this.controls = ref;
          }}
          toggleMute={() => this.toggleMute()}
          toggleFS={() => this.toggleFS()}
          togglePlay={() => this.togglePlay()}
          paused={paused}
          muted={muted}
          fullscreen={fullScreen}
          loading={loading}
          onSeek={val => this.seek(val)}
          onSeekRelease={pos => this.onSeekRelease(pos)}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          logo={logo}
          title={title}
          more={!!onMorePress}
          onMorePress={() => onMorePress()}
          theme={theme}
          inlineOnly={inlineOnly}
          fullScreenControlsOnly={fullScreenControlsOnly}
          {...{ rotation }}
        />
      </View>
    );
  }

  render() {
    if (this.state.renderError) return this.renderError();
    return this.renderPlayer();
  }
}

Video.propTypes = {
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  title: PropTypes.string,
  logo: PropTypes.string,
  resizeMode: PropTypes.string,
  onMorePress: PropTypes.func,
  onFullScreen: PropTypes.func,
  onTimedMetadata: PropTypes.func,
  theme: PropTypes.string,
  placeholder: PropTypes.string,
  rotateToFullScreen: PropTypes.bool,
  fullScreenOnly: PropTypes.bool,
  inlineOnly: PropTypes.bool,
  rate: PropTypes.number,
  volume: PropTypes.number,
  playInBackground: PropTypes.bool,
  playWhenInactive: PropTypes.bool,
  lockPortraitOnFsExit: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onError: PropTypes.func,
  onEnd: PropTypes.func,
  onProgress: PropTypes.func,
  onLoad: PropTypes.func,
  lockRatio: PropTypes.number,
  fullscreenLandscape: PropTypes.bool,
  initialSeek: PropTypes.number,
  fullScreenControlsOnly: PropTypes.bool,
  allowRotation: PropTypes.bool,
  exitFullscreen: PropTypes.func
};

Video.defaultProps = {
  autoPlay: false,
  loop: false,
  title: "",
  logo: undefined,
  resizeMode: "contain",
  onMorePress: undefined,
  onFullScreen: () => {},
  onTimedMetadata: undefined,
  theme: "white",
  placeholder: undefined,
  rotateToFullScreen: false,
  fullScreenOnly: false,
  inlineOnly: false,
  playInBackground: false,
  playWhenInactive: false,
  rate: 1,
  volume: 1,
  lockPortraitOnFsExit: false,
  style: {},
  error: true,
  onError: () => {},
  onEnd: () => {},
  onProgress: () => {},
  onLoad: () => {},
  lockRatio: undefined,
  fullscreenLandscape: false,
  fullScreenControlsOnly: false,
  allowRotation: true,
  initialSeek: undefined,
  exitFullscreen: () => {}
};

export default Video;
