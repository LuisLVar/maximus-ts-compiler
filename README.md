# MaximusTS

This project is a compiler focused on generating and executing Three-Address Code (C3D).

**Author:** Luis Vargas

## Description

MaximusTS is built with Angular and provides a web console where you can write code, translate it into C3D and run the result. Its main components include:

- **Console**: interface to enter code, view the C3D translation and clear the output.
- **Reports**: placeholder section for symbol table and AST reports (in development).
- **Outputs**: defines the structures that store the input, translation and console result.

The integrated editor is based on CodeMirror to provide syntax highlighting and a friendly editing experience.

## Installation

1. Install project dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   ng serve
   ```

   Then open `http://localhost:4200/` in your browser.

## Project Structure

The source code is in the `src/app` folder and organized by components. The `salidas.ts` file maintains the shared state for the console and translation. Necessary Angular modules are defined in `app.module.ts`.

## License

This project is distributed without a specific license and may be used for academic or personal purposes.

