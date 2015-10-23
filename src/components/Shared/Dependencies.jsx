import React from 'react';
import Dependency from 'components/Shared/Dependency';

export default function Dependencies({ dependencies }) {
  return (
    <table className='table table-bordered'>
      <thead>
        <tr>
          <th>Package</th>
          <th>Actual</th>
          <th>Stable</th>
          <th>Latest</th>
        </tr>
      </thead>
      <tbody>
        { Object.keys(dependencies)
          .sort((curr, next) => (curr > next) ? 1 : -1)
          .map((dependency, index) =>
            <Dependency
              key={ index }
              name={ dependency }
              data={ dependencies[dependency] } /> ) }
      </tbody>
    </table>
  );
}
