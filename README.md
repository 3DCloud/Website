# 3DCloud Client
## Getting Started
Install [Node.js](https://nodejs.org/en/). It's usually safer to install the LTS version, but anything marked as compatible in [Angular's package.json file](https://github.com/angular/angular/blob/master/package.json) will work. If you already have Node.js installed, you can check the version you have by running `npm -v`.

Once that's done, install the Angular CLI globally by running

```
npm install -g @angular/cli
```

You are now ready to develop! To run the app, simply run

```
ng serve --open
```

This should open your default browser to http://localhost:4200.

## Updating
Angular-related packages should be updated through the `ng update` command since they may need to run additional commands before/after installing. If you're not sure if a package can be updated through it, running `ng update` without specifying arguments will tell you which packages can be updated; for example:
```text
We analyzed your package.json, there are some packages to update:

  Name                               Version                  Command to update
 --------------------------------------------------------------------------------
  @angular/cli                       11.1.1 -> 11.2.7         ng update @angular/cli
  @angular/core                      11.1.0 -> 11.2.8         ng update @angular/core
  rxjs                               6.6.3 -> 6.6.7           ng update rxjs

There might be additional packages which don't provide 'ng update' capabilities that are outdated.
You can update the additional packages by running the update command of your package manager.
```

If you want to update multiple packages at once, it's faster to run `ng update` with all the package names (e.g. `ng update @angular/cli @angular/core rxjs`) since the updater requires a clean repository (no uncommitted changes).

All other packages can be updated normally through NPM.
