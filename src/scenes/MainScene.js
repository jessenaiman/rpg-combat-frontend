import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Future: Load assets (e.g., sprites) here
  }

  create() {
    this.characters = {}; // Store character containers
    this.report = null;   // Store the latest combat report

    // UI Controls
    const simulateButton = this.add.text(100, 10, 'Simulate', { fontSize: '16px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.simulateCombat());
    this.viewLogButton = this.add.text(this.game.config.width - 100, 10, 'View Log', { fontSize: '16px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.showLogModal())
      .setVisible(false);

    // Loading Indicator
    this.loadingText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Simulating...', { fontSize: '24px', fill: '#fff' })
      .setOrigin(0.5)
      .setVisible(false);

    // Summary Stats
    this.statsText = this.add.text(10, this.game.config.height - 100, 'No simulation run yet.', { fontSize: '16px', fill: '#fff' });

    // Error Message
    this.errorText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 50, '', { fontSize: '16px', fill: '#ff0000' })
      .setOrigin(0.5)
      .setVisible(false);

    // Log Modal
    this.logModal = this.add.container(0, 0).setVisible(false);
    const modalBg = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 400, 300, 0x000000, 0.8);
    this.logText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 100, '', { fontSize: '14px', fill: '#fff', wordWrap: { width: 380 } })
      .setOrigin(0.5, 0);
    const closeButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, 'Close', { fontSize: '16px', fill: '#fff' })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.logModal.setVisible(false));
    this.logModal.add([modalBg, this.logText, closeButton]);
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

  updateCharacters(report) {
    Object.values(this.characters).forEach(container => container.destroy());
    this.characters = {};

    const characterNames = Object.keys(report.characters);
    const spacing = this.game.config.width / (characterNames.length + 1);

    characterNames.forEach((name, index) => {
      const x = (index + 1) * spacing;
      const y = this.game.config.height / 2;
      const container = this.add.container(x, y);

      const sprite = this.add.rectangle(0, 0, 50, 100, 0x0000ff).setOrigin(0.5);
      const maxHealth = 1000; // Placeholder max health
      const currentHealth = report.characters[name].health;
      const healthBar = this.createHealthBar(-25, -60, 50, 10, maxHealth, currentHealth);
      const nameText = this.add.text(0, 50, name, { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);

      container.add([sprite, healthBar, nameText]);
      this.characters[name] = container;
    });
  }

  updateStats(report) {
    const statsLines = [];
    for (const name in report.damage_dealt) {
      const damage = report.damage_dealt[name] || 0;
      const healing = report.healing_done[name] || 0;
      const spells = report.spells_cast[name] || 0;
      statsLines.push(`${name}: Damage: ${damage}, Healing: ${healing}, Spells: ${spells}`);
    }
    this.statsText.setText(statsLines.join('\n'));
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

      this.updateCharacters(this.report);
      this.updateStats(this.report);
      this.viewLogButton.setVisible(true);
    } catch (error) {
      this.errorText.setText(`Error: ${error.message}`).setVisible(true);
    } finally {
      this.loadingText.setVisible(false);
    }
  }

  showLogModal() {
    if (!this.report) return;
    const logLines = this.report.timeline.map(entry => 
      `Turn ${entry.turn}: ${entry.character} ${entry.action} - Healths: ${JSON.stringify(entry.healths)}`
    );
    this.logText.setText(logLines.join('\n'));
    this.logModal.setVisible(true);
  }
}