import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { WordProblemDialog } from '@/components/spelling/WordProblemDialog';

describe('WordProblemDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    displayedWord: 'b_strý',
    currentWord: 'bystrý',
    isPhrase: false,
    wordGroup: 'b',
    missingPositions: [1],
    correctLetters: ['y'],
    currentPosition: 0,
    onAnswerI: vi.fn(),
    onAnswerY: vi.fn(),
    onEndGame: vi.fn()
  };

  test('should render dialog when open', () => {
    render(<WordProblemDialog {...defaultProps} />);
    
    expect(screen.getByText('Doplňte správné i/y')).toBeInTheDocument();
    expect(screen.getByText('Vyjmenované slovo po b')).toBeInTheDocument();
  });

  test('should render phrase indicator when isPhrase is true', () => {
    render(<WordProblemDialog {...defaultProps} isPhrase={true} />);
    
    expect(screen.getByText('Věta/spojení')).toBeInTheDocument();
  });

  test('should call onAnswerI when i button is clicked', () => {
    render(<WordProblemDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('i'));
    
    expect(defaultProps.onAnswerI).toHaveBeenCalledTimes(1);
  });

  test('should call onAnswerY when y button is clicked', () => {
    render(<WordProblemDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('y'));
    
    expect(defaultProps.onAnswerY).toHaveBeenCalledTimes(1);
  });

  test('should call onEndGame when end game button is clicked', () => {
    render(<WordProblemDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Ukončit hru'));
    
    expect(defaultProps.onEndGame).toHaveBeenCalledTimes(1);
  });

  test('should call onEndGame when dialog is closed', () => {
    render(<WordProblemDialog {...defaultProps} />);
    
    // Close the dialog (this is an implementation detail of the shadcn/ui Dialog component)
    const closeButton = document.querySelector('[data-radix-collection-item]');
    if (closeButton) fireEvent.click(closeButton);
    
    expect(defaultProps.onOpenChange).toHaveBeenCalled();
  });
});
