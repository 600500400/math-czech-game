
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { GameControls } from '@/components/spelling/GameControls';

describe('GameControls', () => {
  const defaultProps = {
    selectedGroupsCount: 2,
    hasStats: false,
    onShowGroupDialog: vi.fn(),
    onStartGame: vi.fn(),
    onShowStats: vi.fn()
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

  test('Statistics button should show when hasStats is true', () => {
    render(<GameControls {...defaultProps} hasStats={true} />);
    
    expect(screen.getByText('Zobrazit statistiky')).toBeInTheDocument();
  });

  test('Statistics button should not show when hasStats is false', () => {
    render(<GameControls {...defaultProps} />);
    
    expect(screen.queryByText('Zobrazit statistiky')).not.toBeInTheDocument();
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

  test('Stats button click should trigger onShowStats', async () => {
    const user = userEvent.setup();
    render(<GameControls {...defaultProps} hasStats={true} />);
    
    await user.click(screen.getByText('Zobrazit statistiky'));
    expect(defaultProps.onShowStats).toHaveBeenCalledTimes(1);
  });
});
