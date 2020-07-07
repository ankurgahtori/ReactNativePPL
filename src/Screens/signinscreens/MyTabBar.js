import React, {Component} from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as shape from 'd3-shape';
import Svg, {Path} from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
let containerStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  // borderWidth: 1,
  // borderColor: 'black',
  // backgroundColor: 'black',
  margin: 0,
  padding: 0,
};
let svgStyle = {position: 'absolute', bottom: 0};
let svgPathStyle = {borderWidth: 5};
let fillColor = 'white';
let rowContainerStyle = {
  flex: 1,
  alignItems: 'center',
  flexDirection: 'row',
  // width: '100%',
  height: 62,
  justifyContent: 'space-around',
  backgroundColor: 'transparent',
  // borderWidth: 1,
  // borderColor: 'red',
};
export default class CurvedTabBar extends Component {
  getPath = ({barHeight, buttonHeight, buttonWidth}) => {
    let containerWidth = Dimensions.get('window').width;
    let tabWidth = containerWidth / 5;
    let width = tabWidth * 2 + (tabWidth / 2 - buttonWidth / 2 - 10);
    let width2 = tabWidth * 2 + (tabWidth / 2 + buttonHeight / 2 + 10);

    const left = shape
      .line()
      .x(d => d.x)
      .y(d => d.y)([{x: 0, y: 0}, {x: tabWidth * 2, y: 0}]);
    const tab = shape
      .line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(shape.curveBasis)([
      {x: width - 60, y: 0},
      {x: width - 20, y: 8},
      {x: width + 20, y: barHeight - 30},
      {x: width2 - 13, y: barHeight - 30},
      {x: width2 + 20, y: 8},
      {x: width2 + 50, y: 0},
    ]);
    const right = shape
      .line()
      .x(d => d.x)
      .y(d => d.y)([
      {x: width + tabWidth, y: 0},
      {x: containerWidth, y: 0},
      {x: containerWidth, y: barHeight},
      {x: 0, y: barHeight},
      {x: 0, y: 0},
    ]);
    return `${left} ${tab} ${right}`;
  };

  mode = new Animated.Value(0);

  getTab = ({tab, tabKey, selectedTab, navigation, theme}) => {
    const {iconStyle, textStyle} = theme || {};
    const {label, icon, activeIcon} = tab;
    const selected = selectedTab === tabKey;
    let tabIcon = selected ? activeIcon : icon;
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => navigation.navigate(tabKey)}>
        <Image source={tabIcon} style={iconStyle} />
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    const {
      theme = {},
      navigation,
      selectedTab,
      state,
      descriptors,
      isFocused,
    } = this.props;
    let renderFloatingButton = props => {
      const {isFocused} = props;
      return (
        <View
          style={{
            alignSelf: 'center',
            // height: 20,
            height: '100%',
          }}>
          <Ionicons
            name={'home'}
            size={20}
            color={isFocused ? '#673ab7' : '#222'}
          />
          {/* <Image
          source={{
            uri:
              'data:image/png;base64,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',
          }}
          style={{height: 20, width: 20}}
        /> */}
        </View>
      );
    };
    const {
      // svgStyle,
      // svgPathStyle,
      // fillColor,
      // rowContainerStyle,
      tabStyle,

      // buttonHeight,
      // buttonWidth,
    } = theme || {};
    let barHeight = 64;
    let buttonHeight = 40;
    let buttonWidth = 40;
    const d = this.getPath({barHeight, buttonHeight, buttonWidth});

    return (
      <View style={containerStyle}>
        <Svg height={barHeight} style={svgStyle} width="100%">
          <Path style={svgPathStyle} fill={fillColor} {...{d}} />
        </Svg>
        <View style={rowContainerStyle}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            // console.log('tbbba>>>>>>>>>>>>r', options);
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  // borderWidth: 1,
                  // borderColor: 'green',
                  // justifyContent:"space-evenly"
                }}>
                <>
                  {label === 'Profile' ? (
                    React.cloneElement(
                      renderFloatingButton({isFocused: isFocused}),
                      {
                        navigation,
                      },
                    )
                  ) : (
                    <>
                      <Ionicons
                        name={'home'}
                        size={20}
                        color={isFocused ? '#673ab7' : '#222'}
                      />

                      {/* {options.tabBarIcon} */}
                      <Text style={{color: isFocused ? '#673ab7' : '#222'}}>
                        {label}
                      </Text>
                    </>
                  )}
                </>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}
