import React from 'react';
import PropTypes from 'prop-types';

const Example = ({flag}) => {
  return (
    <div>
    	{flag.toString()}
    </div>
  );
};

Example.propTypes = {
	flag: PropTypes.bool.isRequired
};

export default Example;
