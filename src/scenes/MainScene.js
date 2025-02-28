// src/scenes/MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Placeholder: Load fantasy sprites here in the future
    // this.load.image('knight', 'assets/sprites/knight.png');
    // this.load.image('mage', 'assets/sprites/mage.png');
  }

  create() {
    this.characters = {};
    this.report = null;
    this.currentTurn = 0;

    // Fantasy Background (stone/parchment aesthetic)
    this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 800, 600, 0x8B4513); // Saddle brown
    this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 780, 580, 0xD2B48C, 0.2).setStrokeStyle(2, 0xFFD700); // Tan with gold border

    // Instructions (fantasy-styled text)
    const instructions = [
      'How to Play:',
      '1. Enter number of turns above (default: 10).',
      '2. Click "Submit" to run the simulation.',
      '3. Click "Replay" to watch the battle unfold.'
    ].join('\n');
    this.add.text(10, 10, instructions, { fontFamily: 'Georgia', fontSize: '14px', fill: '#FFD700', wordWrap: { width: 200 } });

    // Submit Button (wooden style)
    const submitButton = this.add.rectangle(250, 40, 100, 40, 0x8B4513)
      .setStrokeStyle(2, 0xFFD700)
      .setInteractive()
      .on('pointerdown', () => this.simulateCombat())
      .on('pointerover', () => submitButton.setFillStyle(0xA0522D))
      .on('pointerout', () => submitButton.setFillStyle(0x8B4513));
    this.add.text(250, 40, 'Submit', { fontFamily: 'Georgia', fontSize: '16px', fill: '#FFD700' }).setOrigin(0.5);

    // Replay Button
    this.viewReplayButton = this.add.text(this.game.config.width - 150, 20, 'Replay', { fontFamily: 'Georgia', fontSize: '16px', fill: '#FFD700' })
      .setInteractive()
      .on('pointerdown', () => this.replayCombat())
      .setVisible(false);

    // Loading Indicator
    this.loadingText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Simulating...', { fontSize: '24px', fill: '#FFD700' })
      .setOrigin(0.5)
      .setVisible(false);

    // Metrics Dashboard (sci-fi green text on fantasy background)
    this.metricsText = this.add.text(this.game.config.width - 250, 50, 'Metrics\nFLUX: -\nCHAOS: -\nFlow: -\nTension: -\nPULSE: -', { fontSize: '14px', fill: '#00ff00' });

    // Combat Log (bottom panel)
    this.logText = this.add.text(10, this.game.config.height - 150, 'Combat Log:\nAwaiting simulation...', { fontSize: '12px', fill: '#FFD700', wordWrap: { width: this.game.config.width - 20 } });

    // Error Message
    this.errorText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 50, '', { fontSize: '16px', fill: '#ff0000' })
      .setOrigin(0.5)
      .setVisible(false);

    // Attack Timeline Graph Area
    this.attackGraph = this.add.graphics();
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

      // Placeholder sprites: knight (red) for Fighter, wizard (blue) for Mage
      const spriteColor = name === 'Fighter' ? 0xff0000 : 0x0000ff;
      const sprite = this.add.rectangle(0, 0, 50, 100, spriteColor).setOrigin(0.5);
      const maxHealth = 1000; // Placeholder until API provides it
      const currentHealth = healths[name];
      const healthBar = this.createHealthBar(-25, -60, 50, 10, maxHealth, currentHealth);
      const nameText = this.add.text(0, 50, name, { fontFamily: 'Georgia', fontSize: '16px', fill: '#FFD700' }).setOrigin(0.5);

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
    const turns = report.total_turns;
    const damageEvents = report.timeline.filter(t => t.action.includes('damage')).length;
    const healEvents = report.timeline.filter(t => t.action.includes('heal')).length;
    const lowHealthEvents = report.timeline.filter(t => Object.values(t.healths).some(h => h < 200)).length;

    const flux = Math.min(1, (damageEvents + healEvents) / turns).toFixed(2);
    const chaos = (damageEvents / turns).toFixed(2);
    const flow = (turns > 5 && turns < 15 ? 0.8 : 0.5).toFixed(2);
    const tension = (lowHealthEvents / turns).toFixed(2);
    const pulse = lowHealthEvents > 0 ? 1.0 : 0.0;

    this.metricsText.setText(`Metrics\nFLUX: ${flux}\nCHAOS: ${chaos}\nFlow: ${flow}\nTension: ${tension}\nPULSE: ${pulse}`);
  }

  updateAttackGraph(report) {
    this.attackGraph.clear();
    const timeline = report.timeline;
    const width = this.game.config.width - 300;
    const height = 100;
    const xOffset = 150;
    const yOffset = this.game.config.height - 250;

    // Draw grid lines for turns
    this.attackGraph.lineStyle(1, 0xFFD700, 0.5);
    for (let i = 0; i <= report.total_turns; i++) {
      const x = xOffset + (i / report.total_turns) * width;
      this.attackGraph.beginPath();
      this.attackGraph.moveTo(x, yOffset);
      this.attackGraph.lineTo(x, yOffset + height);
      this.attackGraph.strokePath();
    }

    // Plot damage/healing per turn
    const maxDamage = Math.max(...timeline.map(t => {
      const match = t.action.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }));
    timeline.forEach((entry, index) => {
      const damageMatch = entry.action.match(/Dealt (\d+) damage/);
      const healMatch = entry.action.match(/Healed (\d+) HP/);
      const amount = damageMatch ? parseInt(damageMatch[1]) : (healMatch ? -parseInt(healMatch[1]) : 0);
      if (amount !== 0) {
        const x = xOffset + (index / report.total_turns) * width;
        const y = yOffset + height - ((amount + maxDamage) / (maxDamage * 2)) * height; // Normalize to graph height
        this.attackGraph.fillStyle(amount > 0 ? 0xff0000 : 0x00ff00, 1);
        this.attackGraph.fillCircle(x, y, 5);
      }
    });
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

      this.updateCharacters(this.report.characters);
      this.updateLog(this.report.timeline, this.currentTurn);
      this.updateMetrics(this.report);
      this.updateAttackGraph(this.report);
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