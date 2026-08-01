// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,

    buildVersion: "@buildVersion@",
    buildTimestamp: "@buildTimestamp@",
    beRestServiceUrl: "https://localhost:8441",
    // when adding or changing keycloak json, update auth-config.ts and auth-module-config.ts as well
    keycloak: {
        issuer: 'https://localhost:8083/realms/flight-log',
        clientId: 'flight-log',
        requireHttps: true,

        // prefixes of urls to send with Bearer token
        // prefixes have to be in lowerr case
        urlPrefixesWithBearerToken: ['https://localhost:8441/protected']
    },
};
