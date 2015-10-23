import React from 'react';
import Dependency from 'components/Shared/Dependency';

export default function Dependencies({ dependencies }) {
  return (
    <ul>
      { Object.keys(dependencies)
        .sort((curr, next) => (curr > next) ? 1 : -1)
        .map((dependency, index) =>
          <Dependency
            key={ index }
            name={ dependency }
            data={ dependencies[dependency] } /> ) }
    </ul>
  );
}
