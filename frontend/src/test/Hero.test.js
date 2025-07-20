import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom'
import Hero from '../landing_page/home/Hero';

// test suite for Hero component(can perform multiple test cases)
describe('Hero Component(Home)', () => {
  test('renders Hero component with correct image', () => {

    render(
        <Hero />
    )
    const imageElement = screen.getByAltText("HeroImage"); // alt text of the image
    expect(imageElement).toBeInTheDocument(); // check if image is in the document
    expect(imageElement).toHaveAttribute('src', 'media/images/homeHero.png'); // check if image source is correct
  
  });

  test("render Hero component with signup button", () => {
    render(
        <Hero />
    )
    const buttonElement = screen.getByRole('button', { name: "/signup now/i" }); // check if button is present
    expect(buttonElement).toBeInTheDocument(); // check if button is in the document
    expect(buttonElement).toHaveAttribute('btn-primary', '/signup'); // check if button has correct href attribute
  });
})