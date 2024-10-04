import React from 'react';

const Satellite3D = () => {
  return (
    <>
      {/* Iframe /3d.html here in the full page */}
      <iframe
        src="/3d.html"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ minHeight: '600px' }}
        title="3D Satellite View"
      />
    </>
  );
};

export default Satellite3D;
