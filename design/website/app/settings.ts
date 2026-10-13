import type { ThemeConfiguration } from './mode.ts'

export const defaultSettings: ThemeConfiguration = {
  "dark": {
    "appearance": {
      "logoShadowStrength": 33,
      "logoShadowBlur": 4,
      "textShadowStrength": 33,
      "textShadowBlur": 4,
      "cssBlur": 2.2,
      "dropShadowColor": "#000000"
    },
    "flash": {
      "enabled": true,
      "color": "#7a839b",
      "intensity": 40
    },
    "camera": {
      "speed": 1,
      "height": 18,
      "position": {
        "x": 0,
        "z": 5
      },
      "aim": {
        "yaw": 75,
        "pitch": -60.9,
        "distance": 20.6
      }
    },
    "cubeSetA": {
      "range": 98,
      "scale": 1.2,
      "height": 1.25,
      "color": "#000000",
      "distribution": "random",
      "metalness": 0.6,
      "shininess": 60,
      "specularIntensity": 1,
      "waveAmplitude": 0,
      "waveSpeed": 2.5,
      "waveTilt": true,
      "waveEmitterCount": 8,
      "waveEmitters": [
        {
          "x": -0.7,
          "z": -0.65,
          "frequency": 0.065,
          "amplitude": 1
        },
        {
          "x": 0.15,
          "z": -0.72,
          "frequency": 0.105,
          "amplitude": 0.7
        },
        {
          "x": 0.72,
          "z": -0.38,
          "frequency": 0.14,
          "amplitude": 1.1
        },
        {
          "x": -0.35,
          "z": -0.15,
          "frequency": 0.085,
          "amplitude": 0.85
        },
        {
          "x": 0.4,
          "z": 0.08,
          "frequency": 0.175,
          "amplitude": 0.65
        },
        {
          "x": -0.72,
          "z": 0.48,
          "frequency": 0.12,
          "amplitude": 1.2
        },
        {
          "x": 0.02,
          "z": 0.68,
          "frequency": 0.075,
          "amplitude": 0.8
        },
        {
          "x": 0.7,
          "z": 0.63,
          "frequency": 0.155,
          "amplitude": 1
        }
      ]
    },
    "cubeSetB": {
      "range": 98,
      "scale": 1.15,
      "color": "#ffffff",
      "distribution": "random",
      "metalness": 0.6,
      "shininess": 60,
      "specularIntensity": 1,
      "height": 18.5,
      "elevation": 0
    },
    "ground": {
      "scale": 1,
      "y": -9.5,
      "color": "#000000"
    },
    "light": {
      "fogDensity": 0.02,
      "directionalIntensity": 15,
      "ambientIntensity": 0,
      "position": {
        "x": 84.71,
        "y": 185.75,
        "z": 18.64
      },
      "color": "#555e6d",
      "ambientColor": "#53607a",
      "fogColor": "#000000"
    }
  },
  "light": {
    "appearance": {
      "logoShadowStrength": 23,
      "logoShadowBlur": 4.5,
      "textShadowStrength": 57,
      "textShadowBlur": 8.5,
      "cssBlur": 2,
      "dropShadowColor": "#ffffff"
    },
    "flash": {
      "enabled": false,
      "color": "#ffffff",
      "intensity": 40
    },
    "camera": {
      "speed": 1.78,
      "height": 23.17,
      "position": {
        "x": 24,
        "z": 32
      },
      "aim": {
        "yaw": 76.46,
        "pitch": -55.78,
        "distance": 81
      }
    },
    "cubeSetA": {
      "range": 241.21,
      "scale": 2.05,
      "height": 2.3,
      "color": "#58606a",
      "distribution": "random",
      "metalness": 0.37,
      "shininess": 38.86,
      "specularIntensity": 0.45,
      "waveAmplitude": 7.6,
      "waveSpeed": 6.2,
      "waveTilt": true,
      "waveEmitterCount": 3,
      "waveEmitters": [
        {
          "x": -0.7,
          "z": -0.65,
          "frequency": 0.08,
          "amplitude": 0.65
        },
        {
          "x": -0.15,
          "z": -0.08,
          "frequency": 0.05,
          "amplitude": 0.5
        },
        {
          "x": 0.37,
          "z": -0.53,
          "frequency": 0.135,
          "amplitude": 0.35
        },
        {
          "x": -0.84,
          "z": -0.15,
          "frequency": 0.49,
          "amplitude": 1.2
        },
        {
          "x": 0.4,
          "z": 0.08,
          "frequency": 0.175,
          "amplitude": 0.65
        },
        {
          "x": -0.72,
          "z": 0.48,
          "frequency": 0.12,
          "amplitude": 1.2
        },
        {
          "x": 0.02,
          "z": 0.68,
          "frequency": 0.075,
          "amplitude": 0.8
        },
        {
          "x": 0.7,
          "z": 0.63,
          "frequency": 0.155,
          "amplitude": 1
        }
      ]
    },
    "cubeSetB": {
      "range": 203.77,
      "scale": 1.6,
      "color": "#e5f1ff",
      "distribution": "random",
      "metalness": 0.29,
      "shininess": 25.28,
      "specularIntensity": 0.69,
      "height": 8.32,
      "elevation": 12.39
    },
    "ground": {
      "scale": 1,
      "y": -12.53,
      "color": "#000000"
    },
    "light": {
      "fogDensity": 0.01,
      "directionalIntensity": 1.6,
      "ambientIntensity": 1,
      "position": {
        "x": -47.43,
        "y": 24,
        "z": 1
      },
      "color": "#f1f5f9",
      "ambientColor": "#acb4be",
      "fogColor": "#707275"
    }
  },
  "cubeCounts": {
    "cubeSetA": 512,
    "cubeSetB": 64
  },
  "cubeBevels": {
    "cubeSetA": 0.03,
    "cubeSetB": 0.03
  }
}