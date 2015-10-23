import React, { Component } from 'react';
import remote from 'remote';
import { promisify } from 'app-utils';

const fs = remote.require('q-io/fs');
const dialog = remote.require('dialog');
const david = remote.require('david');

const getUpdatedDependencies = promisify(david.getUpdatedDependencies);

class Home extends Component {

  state = {}

  handleClick(event) {
    event.preventDefault();
    dialog.showOpenDialog(
      { properties: [ 'openFile' ],
        filters: [ { name: 'NPM Package', extensions: [ 'json' ] } ] },
      (file) => this.handleFile(file)
    );
  }

  async handleFile(files) {
    if (files && files.length) {
      const [ file ] = files;
      try {
        const rawPackage = await fs.read(file);
        const parsedPackage = JSON.parse(rawPackage);

        const outdatedDeps = await getUpdatedDependencies(parsedPackage);
        const outdatedDevDeps = await getUpdatedDependencies(parsedPackage, { dev: true });

        return this.setState({ outdatedDeps, outdatedDevDeps });
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const { outdatedDeps = {}, outdatedDevDeps = {} } = this.state;
    return (
      <div>
        <button
          onClick={ ::this.handleClick }>
          Choose your `package.json`
        </button>
        <div>
          <strong>Outdated dependencies</strong>
          <ul>
            { Object
                .keys(outdatedDeps)
                .map((dependency, index) =>
                  <li key={ index }>{ dependency }</li>) }
          </ul>
        </div>
        <div>
          <strong>Outdated devDependencies</strong>
          <ul>
            { Object
                .keys(outdatedDevDeps)
                .map((devDependency, index) =>
                  <li key={ index }>{ devDependency }</li>) }
          </ul>
        </div>
      </div>
    );
  }

}

export default Home;
