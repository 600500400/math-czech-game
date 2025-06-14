
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import WordProblemDialog from '@/components/spelling/WordProblemDialog';

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
    handleAnswerI: vi.fn(),
    handleAnswerY: vi.fn(),
    onEndGame: vi.fn(),
    correctAnswers: 0,
    wrongAnswers: 0
  };

  test('should render dialog when open', () => {
    render(<WordProblemDialog {...defaultProps} />);
    
    expect(screen.getByText('Doplň správné písmeno')).toBeInTheDocument();
  });

  test('should render phrase indicator when isPhrase is true', () => {
    render(<WordProblemDialog {...defaultProps} isPhrase={true} />);
    
    expect(screen.getByText('Spojení')).toBeInTheDocument();
  });

  test('should call handleAnswerI when I button is clicked', async () => {
    const user = userEvent.setup();
    render(<WordProblemDialog {...defaultProps} />);
    
    await user.click(screen.getByText('I'));
    
    expect(defaultProps.handleAnswerI).toHaveBeenCalledTimes(1);
  });

  test('should call handleAnswerY when Y button is clicked', async () => {
    const user = userEvent.setup();
    render(<WordProblemDialog {...defaultProps} />);
    
    await user.click(screen.getByText('Y'));
    
    expect(defaultProps.handleAnswerY).toHaveBeenCalledTimes(1);
  });

  test('should call onEndGame when end game button is clicked', async () => {
    const user = userEvent.setup();
    render(<WordProblemDialog {...defaultProps} />);
    
    await user.click(screen.getByText('⏸️ Přestávka'));
    
    expect(defaultProps.onEndGame).toHaveBeenCalledTimes(1);
  });
});
