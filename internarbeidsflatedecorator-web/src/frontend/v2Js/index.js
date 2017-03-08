import React from 'react';
import { render } from 'react-dom';
import Header from './components/Header';

document.renderDecorator = function (toggles) {
    render(<Header toggles={toggles} />, document.getElementById('header'));
};