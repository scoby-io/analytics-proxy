# Scoby Analytics Privacy Proxy

A privacy-preserving analytics proxy server that captures and logs page views without compromising user privacy. This proxy uses the `@scoby/analytics-ts` client to log information and offers Sentry error tracking for debugging purposes. The service is designed to be deployed as a Docker container.

## Features

- 🔍 Privacy-safe capture essential page view metrics
- 🛡 Isolate and safeguard user data using a salted hashing approach.
- 🐛 Optional error tracking and monitoring.
- 🚫 Comprehensive cache-control headers to ensure accurate tracking.
- 🐳 Easily deployable as a Docker container.

## Setup & Deployment with Docker

1. **Clone the repository**:
   ```
   git clone https://github.com/scoby-io/analytics-proxy.git
   ```

2. **Build the Docker image**:
   ```
   docker build -t scoby-analytics-proxy .
   ```

3. **Setup Environment Variables**:
   You can use a `.env` file or specify environment variables directly when running your Docker container. These are the expected variables:

   ```
   SCOBY_ANALYTICS_API_KEY=your_api_key_here
   SCOBY_ANALYTICS_SALT=your_salt_here
   PORT=3000
   SCOBY_ANALYTICS_PATH=/count
   SCOBY_ANALYTICS_DEBUG=true_or_false
   ```

4. **Run the Docker container**:
   ```
   docker run -p 3000:3000 --env-file=.env scoby-analytics-proxy
   ```

   _Note: If you choose not to use a `.env` file, replace `--env-file=.env` with your environment variables, e.g., `-e SCOBY_ANALYTICS_API_KEY=your_api_key_here`._

## Endpoints

- `GET /`: A simple greeting from Scoby Analytics.
- `GET [SCOBY_ANALYTICS_PATH]`: The primary analytics logging endpoint. Expecting parameters:
    - `url`: The URL being accessed.
    - `ref`: The referring URL.
    - `sg`: A comma-separated list of segments to log.

## Debugging

When `SCOBY_ANALYTICS_DEBUG` is set to 1 in the environment variables, Sentry error tracking and monitoring will be activated. Any errors will be reported and can be viewed on the configured Sentry dashboard.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)