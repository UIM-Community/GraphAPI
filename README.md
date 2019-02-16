# GraphAPI
CA UIM GraphQL API

## Getting started
Clone and install the project
```bash
$ git clone https://github.com/UIM-Community/GraphAPI.git
$ cd GraphAPI
$ npm ci
```

Create a local `.env` file and fill the following keys:
```
port=1337
uim_user="administrator"
uim_password="password"
uim_path="/opt/nimsoft/bin/pu"
```

And then
```bash
$ npm start
> node index.js
Http Server is listening on port <1337>
```

## Endpoints

### GET /
Return the API uptime in JSON `{ uptime: 0 }`

### POST /
GraphQL endpoint API. Take a raw JSON body with a **query** field.

### POST /pu
Nimsoft probe utilities endpoint. Take a raw JSON body with a **path** and **args** fields. Path argument is not mandatory.

## License
MIT
