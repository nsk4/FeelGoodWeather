# Feel Good Weather

"Feel Good Weather" is your go-to app for comparing weather like never before! Simply choose your
location and a rival spot to see who's winning the weather game. We fetch real-time weather data for
both places and deliver the verdict with a witty, humorous twist! Brought to you by SvelteKit,
TypeScript, and SCSS for a modern, polished experience.

## Table of Contents

-   [Features](#features)
-   [Usage](#usage)
-   [Tech Stack](#tech-stack)
-   [Development](#development)
    -   [Installation](#installation)
    -   [Running the App](#running-the-app)
-   [Using VSCode Devcontainers](#using-vscode-devcontainers)
    -   [Prerequisites](#2-prerequisites)
    -   [Getting Started](#getting-started)
-   [Bug Reporting](#bug-reporting)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   Choose your location and a target location.
-   Retrieves weather data for both locations.
-   Compares the weather conditions and determines the better location.
-   Presents the comparison result in a lighthearted, humorous style.

## Usage

1. Open the application in your browser.
2. Select your current location.
3. Select a location you want to compare your weather to.
4. Click the compare button.
5. View the results.

### Tech Stack

-   [SvelteKit](https://kit.svelte.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [SCSS](https://sass-lang.com/)
-   [Vite](https://vitejs.dev/)

## Development

Make sure you have the following installed on your local development machine:

-   [Node.js](https://nodejs.org/en/) (v18 or higher)
    > Older versions will probably work but are not officially supported.

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/nsk4/FeelGoodWeather.git
    cd feel-good-weather
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

### Running the App

To run the application in development mode:

```sh
npx vite --port=4000
```

> This will start the Vite development server. Open your browser and navigate to
> http://localhost:4000.

## Using VSCode Devcontainers

This project includes a devcontainer configuration to set up a consistent development environment
using Visual Studio Code Dev Containers. You can read more about devcontainers
[HERE](https://code.visualstudio.com/docs/devcontainers/containers).

### Prerequisites

-   [Docker](https://www.docker.com/get-started) installed on your machine.
-   [Visual Studio Code](https://code.visualstudio.com/) installed.
-   [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    installed in Visual Studio Code.

### Getting Started

1. Clone the repository:

    ```sh
    git clone https://github.com/nsk4/FeelGoodWeather.git
    cd feel-good-weather
    ```

2. Open the project in Visual Studio Code.

3. If prompted, reopen the project in a container by clicking on the green "Open a Remote Window"
   button in the bottom left corner of the window, then select "Reopen in Container."

4. Visual Studio Code will now build the devcontainer image and start the container with the
   necessary dependencies for development.

5. You are now ready to start developing inside the devcontainer.

## Bug Reporting

If you encounter any bugs or issues, please report them by creating a new issue in the
[GitHub Issues](https://github.com/nsk4/FeelGoodWeather/issues/new?labels=bug) section of the
repository. Provide as much detail as possible, including steps to reproduce the issue, your
environment, and any relevant screenshots or logs.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch: git checkout -b feature/your-feature-name.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/your-feature-name.
5. Open a pull request.

Please ensure your code adheres to the project's coding standards and passes all tests.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.
