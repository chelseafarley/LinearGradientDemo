import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

const START_DEFAULT = { x: 0.5, y: 0 };
const END_DEFAULT = { x: 0.5, y: 1 };
const START_HORIZONTAL = { x: 0, y: 0.5 };
const END_HORIZONTAL = { x: 1, y: 0.5 };
const GRADIENT_COLORS = ["#fdf4c9", "#fbcdf2", "#e8befa", "#acbfff", "#bbf3bf", "#fdf4c9", "#fbcdf2"];
const GRADIENT_LOCATIONS = [0, 0.2, 0.4, 0.6, 0.8, 1, 1];
const MOVEMENT = GRADIENT_LOCATIONS[1] / 20;
const INTERVAL = 30;

let timeout = undefined;

export default function App() {
  let [gradientOptions, setGradientOptions] = React.useState({
    colors: GRADIENT_COLORS,
    locations: GRADIENT_LOCATIONS,
    start: START_DEFAULT,
    end: END_DEFAULT
  });
  const gradientOptionsRef = React.useRef(gradientOptions);
  gradientOptionsRef.current = gradientOptions;

  let reset = () => {
    // Stop existing animation
    if (timeout != undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    setGradientOptions({
      colors: GRADIENT_COLORS,
      locations: GRADIENT_LOCATIONS,
      start: START_DEFAULT,
      end: END_DEFAULT
    });
  };

  let infiniteRainbow = () => {
    if (gradientOptionsRef.current.locations[1] - MOVEMENT <= 0) {
      // Shift colours and reset locations
      let gradientColors = [...gradientOptionsRef.current.colors];
      gradientColors.shift();
      gradientColors.push(gradientColors[1]);

      setGradientOptions({
        colors: gradientColors,
        locations: GRADIENT_LOCATIONS,
        start: START_DEFAULT,
        end: END_DEFAULT
      });
    } else {
      let updatedLocations = gradientOptionsRef.current.locations.map((item, index) => {
        if (index === gradientOptionsRef.current.locations.length - 1) {
          return 1;
        }

        return parseFloat(Math.max(0, item - MOVEMENT).toFixed(2));
      });

      setGradientOptions({
        colors: [...gradientOptionsRef.current.colors],
        locations: updatedLocations,
        start: START_DEFAULT,
        end: END_DEFAULT
      });
    }

    timeout = setTimeout(infiniteRainbow, INTERVAL);
  };

  let slideClosed = (start, end) => {
    let updatedLocations = gradientOptionsRef.current.locations.map(item => {
      return parseFloat(Math.min(1, item + MOVEMENT).toFixed(2));
    });

    setGradientOptions({
      colors: [...gradientOptionsRef.current.colors],
      locations: updatedLocations,
      start: start,
      end: end
    });

    if (!updatedLocations.every(item => item === 1)) {
      timeout = setTimeout(() => slideClosed(start, end), INTERVAL);
    }
  };

  return (
    <LinearGradient 
      style={styles.container}
      colors={gradientOptions.colors}
      locations={gradientOptions.locations}
      start={gradientOptions.start}
      end={gradientOptions.end}
    >
      <Button title="Slide Down" onPress={() => slideClosed(START_DEFAULT, END_DEFAULT)} />
      <Button title="Slide Right" onPress={() => slideClosed(START_HORIZONTAL, END_HORIZONTAL)} />
      <Button title="Infinite" onPress={infiniteRainbow} />
      <Button title="Reset" onPress={reset} />
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
