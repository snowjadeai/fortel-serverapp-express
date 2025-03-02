const { Origin, Horoscope } = require("circular-natal-horoscope-js");
const { DestinyBoard, DestinyConfigBuilder, DayTimeGround, ConfigType, Gender } = require("fortel-ziweidoushu");

// module.exports ensure that calculateDestinyBoard can be used in other files
// this function takes in date object as an input
module.exports.calculateDestinyBoard = (date) => {
  // using the fortel-ziweidoushu library to calculate our readings
  // here, we are breaking down the year, month, day, and filling the rest with a default value
  const destinyBoard = new DestinyBoard(
    DestinyConfigBuilder.withSolar({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      bornTimeGround: DayTimeGround.getByHour(0),
      configType: ConfigType.SKY,
      gender: Gender.F,
    }),
  )

  return destinyBoard
}

module.exports.calculateNatalChart = (date) => {
  // similarly to the above, this time we are doing it for the western astrology
  const origin = new Origin({
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hour: 0,
    minute: 0,
    latitude: 1.3521,
    longitude: 103.8198,
  });

  const horoscope = new Horoscope({
      origin,
      houseSystem: "whole-sign",
      zodiac: "tropical",
      aspectPoints: ['bodies', 'points', 'angles'],
      aspectWithPoints: ['bodies', 'points', 'angles'],
      aspectTypes: ["major", "minor"],
      customOrbs: {},
      language: 'en'
  });

  const {
      Angles,
      CelestialBodies,
      Houses,
  } = horoscope

  return {
    Angles,
    CelestialBodies,
    Houses,
  }
}
