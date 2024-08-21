import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const Card = ({ children }) => {
    return <div className="card">{children}</div>;
  };
  
  Card.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export const CardHeader = ({ children }) => {
    return <div className="card-header">{children}</div>;
  };
  
  CardHeader.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export const CardTitle = ({ children }) => {
    return <h5 className="card-title">{children}</h5>;
  };
  
  CardTitle.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export const CardContent = ({ children }) => {
    return <div className="card-body">{children}</div>;
  };
  
  CardContent.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export const CardDescription = ({ children }) => {
    return <p className="card-text">{children}</p>;
  };
  
  CardDescription.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export const CardFooter = ({ children, className }) => {
    return <div className={`card-footer ${className || ''}`}>{children}</div>;
  };
  
  CardFooter.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };