import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default class ParticlesContainer extends React.PureComponent {
  async customInit(engine) {
    await loadFull(engine);
  }

  render() {
    const options = {
      fullScreen: true,
      background: {
        image: "linear-gradient(180deg, #000000 5%, #808080 130%)"
      },

      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
            mode: "repulse"
          },
          onclick: {
            enable: false,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 800,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 790,
            size: 79,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          repulse: {
            distance: 400,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    };

    const particleStyle = {
      position: 'absolute', // Necessary for z-index to work
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0 // Set z-index to -1
    };

    return <Particles id="tsparticles" style={particleStyle} options={options} init={this.customInit.bind(this)} />;
  }
}

// import React from 'react';
// import Particles from "react-tsparticles"; // Ensure this package is installed
// import { loadFull } from "tsparticles";
// import { loadFirePreset } from "tsparticles-preset-fire";


// export class ParticlesContainer extends React.PureComponent {
//   // this customizes the component tsParticles installation
//   async customInit(engine) {
//     // this adds the preset to tsParticles, you can safely use the
//     await loadFirePreset(engine);
//   }

//   render() {
//     const options = {
//       preset: "fire",
//     };

//     return <Particles id="tsparticles" options={options} init={this.customInit.bind(this)} />;
//   }
// }


// https://codesandbox.io/s/particles-js-4p9jf?file=/src/App.js:6904-6936