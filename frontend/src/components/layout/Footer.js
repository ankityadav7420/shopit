import React, { Fragment } from 'react';
import '../../App.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Fragment>
      <footer className="py-1">
        <p className="text-center mt-1">
          ShoppIT {currentYear}, All Rights Reserved
        </p>
      </footer>
    </Fragment>
  );
};

export default Footer;
