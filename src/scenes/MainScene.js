// src/scenes/MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Load a retro pixel font (e.g., via Google Fonts in index.html)
    // Future: Load sprite assets for characters
  }

  create() {
    this.characters = {};
    this.report = null;
    this.currentTurn = 0;

    // Retro RPG Background (gray with sci-fi border)
    this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 800, 600, 0x333333);
    this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 780, 580, 0x00ff00, 0.2).setStrokeStyle(2, 0x00ff00);

    // UI Controls
    this.add.text(100, 20, 'Simulate', { fontFamily: 'Arial', fontSize: '16px', fill: '#fff' }) // Replace with pixel font in production
      .setInteractive()
      .on('pointerdown', () => this.simulateCombat());
    this.viewReplayButton = this.add.text(this.game.config.width - 150, 20, 'Replay', { fontFamily: 'Arial', fontSize: '16px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.replayCombat())
      .setVisible(false);

    // Loading Indicator
    this.loadingText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Simulating...', { fontSize: '24px', fill: '#fff' })
      .setOrigin(0.5)
      .setVisible(false);

    // Metrics Dashboard (top right)
    this.metricsText = this.add.text(this.game.config.width - 250, 50, 'Metrics\nFLUX: -\nCHAOS: -\nFlow: -\nTension: -\nPULSE: -', { fontSize: '14px', fill: '#00ff00' });

    // Combat Log (bottom panel)
    this.logText = this.add.text(10, this.game.config.height - 150, 'Combat Log:\nAwaiting simulation...', { fontSize: '12px', fill: '#fff', wordWrap: { width: this.game.config.width - 20 } });

    // Error Message
    this.errorText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 50, '', { fontSize: '16px', fill: '#ff0000' })
      .setOrigin(0.5)
      .setVisible(false);
  }

  createHealthBar(x, y, width, height, maxHealth, currentHealth) {
    const bar = this.add.graphics();
    bar.fillStyle(0xff0000, 1);
    bar.fillRect(x, y, width, height);
    const healthWidth = Math.max(0, (currentHealth / maxHealth) * width);
    bar.fillStyle(0x00ff00, 1);
    bar.fillRect(x, y, healthWidth, height);
    return bar;
  }

  updateCharacters(healths) {
    Object.values(this.characters).forEach(container => container.destroy());
    this.characters = {};

    const characterNames = Object.keys(healths);
    const spacing = this.game.config.width / (characterNames.length + 1);

    characterNames.forEach((name, index) => {
      const x = (index + 1) * spacing;
      const y = this.game.config.height / 2 - 50;
      const container = this.add.container(x, y);

      const sprite = this.add.rectangle(0, 0, 50, 100, 0x0000ff).setOrigin(0.5);
      const maxHealth = 1000; // Placeholder
      const currentHealth = healths[name];
      const healthBar = this.createHealthBar(-25, -60, 50, 10, maxHealth, currentHealth);
      const nameText = this.add.text(0, 50, name, { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);

      // Highlight low health (PULSE moment)
      if (currentHealth / maxHealth < 0.2) {
        healthBar.setStrokeStyle(2, 0xff0000).setAlpha(0.7 + 0.3 * Math.sin(this.time.now / 200));
      }

      container.add([sprite, healthBar, nameText]);
      this.characters[name] = container;
    });
  }

  updateLog(timeline, turnIndex) {
    const visibleTurns = timeline.slice(0, turnIndex + 1).map(entry => 
      `Turn ${entry.turn}: ${entry.character} ${entry.action}`
    );
    this.logText.setText(`Combat Log:\n${visibleTurns.join('\n')}`);
  }

  updateMetrics(report) {
    // Mock metrics until API provides them
    const turns = report.total_turns;
    const damageEvents = report.timeline.filter(t => t.action.includes('damage')).length;
    const healEvents = report.timeline.filter(t => t.action.includes('heal')).length;
    const lowHealthEvents = report.timeline.filter(t => Object.values(t.healths).some(h => h < 200)).length;

    const flux = Math.min(1, (damageEvents + healEvents) / turns).toFixed(2); // Strategic pivots
    const chaos = (damageEvents / turns).toFixed(2); // Outcome variability
    const flow = (turns > 5 && turns < 15 ? 0.8 : 0.5).toFixed(2); // Arbitrary flow balance
    const tension = (lowHealthEvents / turns).toFixed(2); // Narrative tension
    const pulse = lowHealthEvents > 0 ? 1.0 : 0.0; // Suspense moments

    this.metricsText.setText(`Metrics\nFLUX: ${flux}\nCHAOS: ${chaos}\nFlow: ${flow}\nTension: ${tension}\nPULSE: ${pulse}`);
  }

  async simulateCombat() {
    this.loadingText.setVisible(true);
    this.errorText.setVisible(false);

    try {
      const turns = document.getElementById('turns-input').value || 10;
      const simulateResponse = await fetch(`http://localhost:8000/combat/simulate?turns=${turns}`, { method: 'POST' });
      if (!simulateResponse.ok) throw new Error('Simulation failed');

      const reportResponse = await fetch('http://localhost:8000/combat/report');
      if (!reportResponse.ok) throw new Error('Failed to fetch report');

      this.report = await reportResponse.json();
      this.currentTurn = 0;

      // Initial display
      this.updateCharacters(this.report.characters);
      this.updateLog(this.report.timeline, this.currentTurn);
      this.updateMetrics(this.report);
      this.viewReplayButton.setVisible(true);
    } catch (error) {
      console.error('Error:', error);
      this.errorText.setText(`Error: ${error.message}`).setVisible(true);
    } finally {
      this.loadingText.setVisible(false);
    }
  }

  replayCombat() {
    if (!this.report) return;
    this.currentTurn = 0;
    this.time.addEvent({
      delay: 1000, // 1 second per turn
      repeat: this.report.total_turns - 1,
      callback: () => {
        this.updateCharacters(this.report.timeline[this.currentTurn].healths);
        this.updateLog(this.report.timeline, this.currentTurn);
        this.currentTurn++;
      }
    });
  }
}