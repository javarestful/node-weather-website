const request = require('request');

const forecast = (options, callback) => {
  request({url: createURL(options), json: true}, (error, response) => {
    if (error) {
        callback('Unable to connect to weather API.', undefined);
      } else if (response.body.error) {
        callback('Invalid request. Please check latitude/longitude values.', undefined);
      } else {
        const data = response.body.daily.data[0];
        callback(undefined, {
          summary: data.summary,
          precipProbability: data.precipProbability * 100,
          temperatureHigh: data.temperatureHigh,
          temperatureLow: data.temperatureLow
        });
      }
  });
};

const createURL = ({key, latitude, longitude, exclude, units}) => {
  let queryString = '';
  if (exclude !== undefined && units !== undefined) queryString = `?exclude=${exclude}&units=${units}`;
  if (exclude !== undefined && units === undefined) queryString = `?exclude=${exclude}`;
  if (units !== undefined && exclude === undefined) queryString = `?units=${units}`
  return `https://api.darksky.net/forecast/${key}/${latitude},${longitude}${queryString}`;
};

module.exports = {
  forecast
}