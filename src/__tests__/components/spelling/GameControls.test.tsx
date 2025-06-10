
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { GameControls } from '@/components/spelling/GameControls';

describe('GameControls', () => {
  const defaultProps = {
    selectedGroupsCount: 2,
    onShowGroupDialog: vi.fn(),
    onStartGame: vi.fn()
  };

  test('renders all buttons correctly', () => {
    render(<GameControls {...defaultProps} />);
    
    expect(screen.getByText('Vybrat skupiny slov')).toBeInTheDocument();
    expect(screen.getByText('Spustit hru')).toBeInTheDocument();
  });

  test('Start game button should be disabled when no groups selected', () => {
    render(<GameControls {...defaultProps} selectedGroupsCount={0} />);
    
    const startButton = screen.getByText('Spustit hru');
    expect(startButton).toBeDisabled();
  });

  test('Start game button should be enabled when groups are selected', () => {
    render(<GameControls {...defaultProps} />);
    
    const startButton = screen.getByText('Spustit hru');
    expect(startButton).not.toBeDisabled();
  });

  test('Group button click should trigger onShowGroupDialog', async () => {
    const user = userEvent.setup();
    render(<GameControls {...defaultProps} />);
    
    await user.click(screen.getByText('Vybrat skupiny slov'));
    expect(defaultProps.onShowGroupDialog).toHaveBeenCalledTimes(1);
  });

  test('Start game button click should trigger onStartGame', async () => {
    const user = userEvent.setup();
    render(<GameControls {...defaultProps} />);
    
    await user.click(screen.getByText('Spustit hru'));
    expect(defaultProps.onStartGame).toHaveBeenCalledTimes(1);
  });
});
