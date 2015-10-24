import React from 'react';
import Dependency from 'components/Shared/Dependency';

export default function Dependencies(props) {
  const { dependencies, label, withLatest } = props;
  const hasOutdated = Object.keys(dependencies).length > 0;

  if (hasOutdated) {
    return (
      <div className='card-block'>
        <strong>{ label }</strong>
        <table className='table'>
          <thead>
            <tr>
              <th>Package</th>
              <th>Actual</th>
              <th>Stable</th>
              { withLatest && <th>Latest</th> }
            </tr>
          </thead>
          <tbody>
            { Object.keys(dependencies)
              .sort((curr, next) => (curr > next) ? 1 : -1)
              .map((dependency, index) =>
                <Dependency
                  key={ index }
                  name={ dependency }
                  withLatest={ withLatest }
                  data={ dependencies[dependency] } /> ) }
          </tbody>
        </table>
      </div>
    );
  }

  return (<div className='hide' />);
}
