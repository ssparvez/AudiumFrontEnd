// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //connectionURL: "http://localhost:5000", // dev 
  connectionURL: "http://audium-api.us-east-2.elasticbeanstalk.com", // prod
  mediaURL: "https://s3.us-east-2.amazonaws.com/assets.audium.io"
};
