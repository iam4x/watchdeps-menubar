import React from 'react';

export default function Dependency({ name, data }) {
  const { required, stable, latest, warn } = data;

  if (warn) {
    return (
      <tr>
        <td>{ name }</td>
        <td colSpan='3'>
          <span className='label label-danger'>
            Cant check for update
          </span>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{ name }</td>
      <td className='text-left'>
        <div className='label label-default'>
          { required }
        </div>
      </td>
      <td className='text-left'>
        <span className='label label-success'>
          { stable }
        </span>
      </td>
      <td className='text-left'>
        <span className='label label-warning'>
          { latest }
        </span>
      </td>
    </tr>
  );
}
