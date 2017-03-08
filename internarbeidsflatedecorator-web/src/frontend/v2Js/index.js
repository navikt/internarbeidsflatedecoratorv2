import React from 'react';
import { render } from 'react-dom';
import Header from './components/Header';

document.renderDecorator = function () {
    render(<Header />, document.getElementById('header'));
};