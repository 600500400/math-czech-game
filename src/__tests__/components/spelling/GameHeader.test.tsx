
import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { GameHeader } from '@/components/spelling/GameHeader';

describe('GameHeader', () => {
  test('should render with all information', () => {
    render(<GameHeader problemCount={10} correctAnswers={5} wrongAnswers={2} />);
    
    // Check title
    expect(screen.getByText('Procvičování vyjmenovaných slov')).toBeInTheDocument();
    
    // Check problem count
    expect(screen.getByText('Počet slov:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Check correct answers
    expect(screen.getByText('Správně:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check wrong answers
    expect(screen.getByText('Špatně:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('should not render wrong answers when count is 0', () => {
    render(<GameHeader problemCount={10} correctAnswers={5} wrongAnswers={0} />);
    
    // Shouldn't have the "Špatně:" text
    expect(screen.queryByText('Špatně:')).not.toBeInTheDocument();
  });
});
